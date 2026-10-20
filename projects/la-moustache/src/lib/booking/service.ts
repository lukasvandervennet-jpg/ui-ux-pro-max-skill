import { buildIcs } from "./ics";
import { cancellationMail, confirmationMail, ownerMail, thankYouMail, type MailContext } from "./emails";
import { freeSlots, type SlotRules } from "./slots";
import { addDays, isDateISO, isTime, zonedToUtc } from "./time";
import { signCancelToken, verifyCancelToken } from "./token";
import type { CalendarClient, Mailer, StoredBooking } from "./types";

/**
 * De volledige boekingslogica, los van Next.js. Alles wat de buitenwereld
 * raakt (agenda, e-mail, klok) komt binnen via `deps`, zodat dit ook in
 * tests en in demo-modus werkt.
 */

export type BookableService = { id: string; name: string; duration: number };

export type BookingDeps = {
  calendar: CalendarClient;
  mailer: Mailer;
  rules: SlotRules;
  services: BookableService[];
  mail: MailContext;
  secret: string;
  bookUrl: string;
  cancelUrl: (token: string) => string;
  notifyEmail?: string;
};

export class BookingError extends Error {
  constructor(
    public readonly code: "invalid" | "unavailable" | "not_found" | "past",
    message: string,
    public readonly fields?: Record<string, string>,
  ) {
    super(message);
  }
}

function dayWindow(dateISO: string, tz: string) {
  return { from: zonedToUtc(dateISO, "00:00", tz), to: zonedToUtc(addDays(dateISO, 1), "00:00", tz) };
}

export async function getSlots(deps: BookingDeps, dateISO: unknown, serviceId: unknown, now = new Date()) {
  if (!isDateISO(dateISO)) throw new BookingError("invalid", "Ongeldige datum.");
  const service = deps.services.find((s) => s.id === serviceId);
  if (!service) throw new BookingError("invalid", "Onbekende dienst.");
  const { from, to } = dayWindow(dateISO, deps.rules.timeZone);
  const busy = await deps.calendar.busy(from, to);
  return freeSlots(dateISO, service.duration, busy, deps.rules, now);
}

export type BookingRequest = {
  service?: unknown;
  date?: unknown;
  time?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  note?: unknown;
  privacy?: unknown;
  reviewOptOut?: unknown;
  website?: unknown; // honeypot: moet leeg blijven
};

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "");

export function validateRequest(req: BookingRequest, services: BookableService[]) {
  const fields: Record<string, string> = {};
  const service = services.find((s) => s.id === req.service);
  if (!service) fields.service = "Kies een dienst.";
  if (!isDateISO(req.date)) fields.date = "Kies een dag.";
  if (!isTime(req.time)) fields.time = "Kies een tijdstip.";

  const name = str(req.name, 80);
  if (name.length < 2) fields.name = "Vul je naam in.";
  const email = str(req.email, 120).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) fields.email = "Vul een geldig e-mailadres in.";
  const phone = str(req.phone, 30);
  if (phone.replace(/[^\d]/g, "").length < 8) fields.phone = "Vul een geldig telefoonnummer in.";
  const note = typeof req.note === "string" ? req.note.trim().slice(0, 500) : "";
  if (req.privacy !== true) fields.privacy = "Ga akkoord met de privacyverklaring om te boeken.";

  if (Object.keys(fields).length) throw new BookingError("invalid", "Controleer de gemarkeerde velden.", fields);
  return {
    service: service!,
    date: req.date as string,
    time: req.time as string,
    name,
    email,
    phone,
    note,
    reviewOptOut: req.reviewOptOut === true,
  };
}

export async function createBooking(deps: BookingDeps, req: BookingRequest, now = new Date()): Promise<StoredBooking> {
  // Bots vullen het verborgen veld in: weigeren zonder uitleg.
  if (typeof req.website === "string" && req.website.trim() !== "") {
    throw new BookingError("invalid", "Er ging iets mis. Probeer het opnieuw.");
  }
  const v = validateRequest(req, deps.services);
  const tz = deps.rules.timeZone;

  // Altijd opnieuw controleren vlak voor het boeken: zo kan niemand een bezet uur boeken.
  const free = await getSlots(deps, v.date, v.service.id, now);
  if (!free.includes(v.time)) {
    throw new BookingError("unavailable", "Dit tijdstip is net niet meer vrij. Kies een ander moment.");
  }

  const start = zonedToUtc(v.date, v.time, tz);
  const end = new Date(start.getTime() + v.service.duration * 60000);
  const booking = await deps.calendar.create({
    serviceId: v.service.id,
    serviceName: v.service.name,
    start,
    end,
    name: v.name,
    email: v.email,
    phone: v.phone,
    note: v.note,
    reviewOptOut: v.reviewOptOut,
  });

  const token = signCancelToken(booking.id, deps.secret);
  const ics = buildIcs({
    uid: booking.id,
    start,
    end,
    summary: `${v.service.name} bij La Moustache`,
    location: deps.mail.address,
    description: `Annuleren: ${deps.cancelUrl(token)}`,
    now,
  });

  // De afspraak staat vast; een mislukte mail mag de boeking niet ongedaan maken.
  await settle(deps.mailer.send(confirmationMail(booking, deps.mail, deps.cancelUrl(token), ics)), "bevestiging");
  if (deps.notifyEmail) await settle(deps.mailer.send(ownerMail("new", booking, deps.mail, deps.notifyEmail)), "melding");
  return booking;
}

export async function findByToken(deps: BookingDeps, token: unknown) {
  const id = typeof token === "string" ? verifyCancelToken(token, deps.secret) : null;
  if (!id) throw new BookingError("not_found", "Deze link is ongeldig.");
  const booking = await deps.calendar.get(id);
  if (!booking) throw new BookingError("not_found", "Deze afspraak bestaat niet meer of is al geannuleerd.");
  return booking;
}

export async function cancelBooking(deps: BookingDeps, token: unknown, now = new Date()) {
  const booking = await findByToken(deps, token);
  if (booking.start <= now) throw new BookingError("past", "Deze afspraak is al voorbij en kan niet meer geannuleerd worden.");
  await deps.calendar.remove(booking.id);
  await settle(deps.mailer.send(cancellationMail(booking, deps.mail, deps.bookUrl)), "annulering");
  if (deps.notifyEmail) await settle(deps.mailer.send(ownerMail("cancelled", booking, deps.mail, deps.notifyEmail)), "melding");
  return booking;
}

/**
 * Stuurt de bedankmail voor afspraken die afgelopen zijn. Wordt één keer per
 * dag 's avonds aangeroepen (Vercel Cron) en kijkt twee dagen terug, zodat een
 * gemiste run vanzelf ingehaald wordt.
 */
export async function runFollowUps(deps: BookingDeps, now = new Date()) {
  const from = new Date(now.getTime() - 2 * 24 * 3600 * 1000);
  const candidates = await deps.calendar.pendingFollowUps(from, now);
  let sent = 0;
  for (const b of candidates) {
    if (b.end > now) continue; // nog bezig of nog niet begonnen
    if (!b.reviewOptOut) {
      try {
        await deps.mailer.send(thankYouMail(b, deps.mail));
        sent++;
      } catch (e) {
        console.error("[afspraken] bedankmail mislukt", b.id, e);
        continue; // morgen opnieuw proberen
      }
    }
    await deps.calendar.markFollowUpSent(b.id);
  }
  return { checked: candidates.length, sent };
}

async function settle(p: Promise<unknown>, what: string) {
  try {
    await p;
  } catch (e) {
    console.error(`[afspraken] ${what}-mail mislukt`, e);
  }
}

