import "server-only";

import { bookingMode, bookingSettings, BOOKING_PATH, serviceDuration } from "@/config/booking";
import { business, openingHours, seo, services, social } from "@/config/site";
import { links } from "@/lib/links";

import { demoCalendar } from "./demo-calendar";
import { GoogleCalendarClient } from "./google-calendar";
import { demoMailer, ResendMailer, SmtpMailer, TestLabelMailer } from "./mailer";
import type { BookableService, BookingDeps } from "./service";
import type { WeekHours } from "./slots";
import type { Mailer } from "./types";

/** Diensten die online geboekt kunnen worden: de gepubliceerde diensten uit site.ts. */
export const bookableServices: BookableService[] = services
  .filter((s) => s.published)
  .map((s) => ({ id: s.id, name: s.titleNl, duration: serviceDuration(s.id) }));

const weekHours: WeekHours = Object.fromEntries(openingHours.map((d) => [d.day, { open: d.open, close: d.close }]));

const CALENDAR_ENV = ["GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY", "GOOGLE_CALENDAR_ID"] as const;

export type MailSetup = { mailer: Mailer; provider: "Resend" | "Gmail/SMTP"; from: string };

/**
 * Kiest de e-maildienst: Resend als er een sleutel is, anders SMTP (bv. Gmail met
 * een app-wachtwoord). Zonder één van beide: null.
 */
export function mailSetup(env = process.env): MailSetup | null {
  if (env.RESEND_API_KEY && env.MAIL_FROM) {
    return { mailer: new ResendMailer(env.RESEND_API_KEY, env.MAIL_FROM), provider: "Resend", from: env.MAIL_FROM };
  }
  if (env.SMTP_USER && env.SMTP_PASS) {
    const from = env.MAIL_FROM || `La Moustache <${env.SMTP_USER}>`;
    const mailer = new SmtpMailer(
      {
        host: env.SMTP_HOST || "smtp.gmail.com",
        port: Number(env.SMTP_PORT || 465),
        user: env.SMTP_USER,
        pass: env.SMTP_PASS.replace(/\s+/g, ""), // Gmail toont app-wachtwoorden met spaties
      },
      from,
    );
    return { mailer, provider: "Gmail/SMTP", from };
  }
  return null;
}

/** Welke instellingen ontbreken nog voor de stand "live"? */
export function missingLiveSettings(env = process.env): string[] {
  const missing: string[] = CALENDAR_ENV.filter((k) => !env[k]);
  if (!mailSetup(env)) missing.push("E-mail (SMTP_USER + SMTP_PASS, of RESEND_API_KEY + MAIL_FROM)");
  if (!env.BOOKING_SECRET) missing.push("BOOKING_SECRET");
  return missing;
}

export function googleCalendarFromEnv(env = process.env) {
  if (CALENDAR_ENV.some((k) => !env[k])) return null;
  return new GoogleCalendarClient({
    clientEmail: env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    privateKey: env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    calendarId: env.GOOGLE_CALENDAR_ID!,
    timeZone: bookingSettings.timeZone,
    location: `${business.address.street}, ${business.address.postalCode} ${business.address.city}`,
  });
}

let cached: BookingDeps | null = null;

/** Bouwt alles wat het boekingssysteem nodig heeft, of legt uit wat er ontbreekt. */
export function bookingDeps(): { deps: BookingDeps } | { error: string; missing?: string[] } {
  if (bookingMode === "off") return { error: "Online boeken staat uit." };
  if (cached) return { deps: cached };

  const env = process.env;
  const live = bookingMode === "live";
  if (live) {
    const missing = missingLiveSettings(env);
    if (missing.length) return { error: "Online boeken is nog niet volledig ingesteld.", missing };
  }
  const mail = mailSetup(env);

  const address = `${business.address.street}, ${business.address.postalCode} ${business.address.city}`;
  const siteUrl = seo.siteUrl;

  cached = {
    calendar: live ? googleCalendarFromEnv(env)! : demoCalendar,
    // Demo: met ingestelde e-mail worden echte mails verstuurd, duidelijk gemarkeerd als TEST.
    mailer: live ? mail!.mailer : mail ? new TestLabelMailer(mail.mailer) : demoMailer,
    rules: {
      timeZone: bookingSettings.timeZone,
      slotInterval: bookingSettings.slotInterval,
      leadMinutes: bookingSettings.leadMinutes,
      maxDaysAhead: bookingSettings.maxDaysAhead,
      closedDates: bookingSettings.closedDates,
      hours: weekHours,
    },
    services: bookableServices,
    mail: {
      timeZone: bookingSettings.timeZone,
      siteUrl,
      businessName: business.name,
      address,
      phoneDisplay: business.phone.display,
      phoneHref: links.tel,
      whatsappHref: links.whatsapp(),
      mapsHref: links.mapsDirections,
      instagramHref: social.instagram.url,
      reviewHref: links.googleWriteReview ?? links.googleReviews,
      replyTo: env.MAIL_REPLY_TO || undefined,
    },
    secret: env.BOOKING_SECRET || "demo-secret-alleen-voor-testen",
    bookUrl: `${siteUrl}${BOOKING_PATH}`,
    cancelUrl: (token) => `${siteUrl}/afspraak-annuleren?token=${encodeURIComponent(token)}`,
    notifyEmail: env.BOOKING_NOTIFY_EMAIL || undefined,
  };
  return { deps: cached };
}
