import { formatLongDate, formatTimeNl, utcToZoned } from "./time";
import type { MailMessage, StoredBooking } from "./types";

/**
 * E-mails in de huisstijl van La Moustache. Opgebouwd met tabellen en inline
 * stijlen, want e-mailprogramma's ondersteunen weinig moderne CSS.
 */

export type MailContext = {
  timeZone: string;
  siteUrl: string;
  businessName: string;
  address: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappHref: string;
  mapsHref: string;
  instagramHref: string;
  reviewHref: string;
  replyTo?: string;
};

const INK = "#101010";
const GOLD = "#b9975b";
const IVORY = "#f5f1e9";
const STONE = "#6b655c";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

function when(b: StoredBooking, tz: string) {
  const s = utcToZoned(b.start, tz);
  const e = utcToZoned(b.end, tz);
  return { date: formatLongDate(s.dateISO), from: formatTimeNl(s.time), to: formatTimeNl(e.time) };
}

function button(href: string, label: string, primary = true) {
  const bg = primary ? GOLD : "transparent";
  const border = primary ? GOLD : "#d9d2c3";
  return `<a href="${esc(href)}" style="display:inline-block;padding:14px 26px;border-radius:999px;background:${bg};border:1px solid ${border};color:${INK};font:700 12px/1 Arial,Helvetica,sans-serif;letter-spacing:2px;text-transform:uppercase;text-decoration:none">${esc(label)}</a>`;
}

function row(label: string, value: string) {
  return `<tr><td style="padding:10px 0;border-bottom:1px solid #e4ddcf;color:${STONE};font:13px Arial,Helvetica,sans-serif;width:110px;vertical-align:top">${esc(label)}</td><td style="padding:10px 0;border-bottom:1px solid #e4ddcf;color:${INK};font:15px Arial,Helvetica,sans-serif">${value}</td></tr>`;
}

function layout(ctx: MailContext, preheader: string, body: string) {
  return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(ctx.businessName)}</title></head>
<body style="margin:0;padding:0;background:${IVORY}">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${IVORY}"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff">
<tr><td style="background:${INK};padding:28px 32px">
<div style="font:italic 30px/1 Georgia,'Times New Roman',serif;color:${IVORY}">La Moustache</div>
<div style="margin-top:8px;font:700 10px/1 Arial,Helvetica,sans-serif;letter-spacing:4px;color:${GOLD}">BARBERSHOP · SINT-MARTENS-LATEM</div>
</td></tr>
<tr><td style="padding:32px">${body}</td></tr>
<tr><td style="background:${INK};padding:22px 32px;font:12px/1.6 Arial,Helvetica,sans-serif;color:#b8b2a7">
${esc(ctx.businessName)} · ${esc(ctx.address)}<br>
<a href="${esc(ctx.phoneHref)}" style="color:#b8b2a7">${esc(ctx.phoneDisplay)}</a> · <a href="${esc(ctx.instagramHref)}" style="color:#b8b2a7">Instagram</a> · <a href="${esc(ctx.siteUrl)}" style="color:#b8b2a7">Website</a>
</td></tr></table></td></tr></table></body></html>`;
}

const h1 = (t: string) => `<h1 style="margin:0 0 14px;font:400 28px/1.15 Georgia,'Times New Roman',serif;color:${INK}">${t}</h1>`;
const p = (t: string) => `<p style="margin:0 0 16px;font:15px/1.6 Arial,Helvetica,sans-serif;color:#3a3833">${t}</p>`;

export function confirmationMail(b: StoredBooking, ctx: MailContext, cancelUrl: string, ics: string): MailMessage {
  const w = when(b, ctx.timeZone);
  const body = [
    h1(`Tot ${esc(w.date.split(" ")[0])}, ${esc(firstName(b.name))}.`),
    p("Je afspraak bij La Moustache is bevestigd. Hieronder vind je alles op een rij."),
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px">
      ${row("Dienst", esc(b.serviceName))}
      ${row("Datum", esc(w.date))}
      ${row("Uur", `${esc(w.from)} – ${esc(w.to)}`)}
      ${row("Adres", `<a href="${esc(ctx.mapsHref)}" style="color:${INK}">${esc(ctx.address)}</a>`)}
    </table>`,
    p("In de bijlage zit een agenda-bestand: open het om de afspraak in je eigen agenda te zetten."),
    `<p style="margin:24px 0">${button(ctx.mapsHref, "Routebeschrijving")}</p>`,
    p(
      `Toch verhinderd? <a href="${esc(cancelUrl)}" style="color:${INK}">Annuleer je afspraak</a>, zodat iemand anders je plaats kan krijgen. Vragen? Bel <a href="${esc(ctx.phoneHref)}" style="color:${INK}">${esc(ctx.phoneDisplay)}</a> of stuur een <a href="${esc(ctx.whatsappHref)}" style="color:${INK}">WhatsApp</a>.`,
    ),
  ].join("");

  const text = [
    `Dag ${firstName(b.name)},`,
    "",
    "Je afspraak bij La Moustache is bevestigd.",
    "",
    `Dienst: ${b.serviceName}`,
    `Datum: ${w.date}`,
    `Uur: ${w.from} – ${w.to}`,
    `Adres: ${ctx.address}`,
    `Route: ${ctx.mapsHref}`,
    "",
    `Toch verhinderd? Annuleer hier: ${cancelUrl}`,
    `Vragen? Bel ${ctx.phoneDisplay}.`,
    "",
    "La Moustache Barbershop",
  ].join("\n");

  return {
    to: b.email,
    subject: `Bevestigd: ${b.serviceName} op ${w.date} om ${w.from}`,
    html: layout(ctx, `Je afspraak op ${w.date} om ${w.from} is bevestigd.`, body),
    text,
    replyTo: ctx.replyTo,
    attachments: [{ filename: "afspraak-la-moustache.ics", content: Buffer.from(ics).toString("base64"), contentType: "text/calendar" }],
  };
}

export function thankYouMail(b: StoredBooking, ctx: MailContext): MailMessage {
  const body = [
    h1(`Bedankt voor je bezoek, ${esc(firstName(b.name))}.`),
    p(`Fijn dat je langskwam bij La Moustache voor je ${esc(b.serviceName.toLowerCase())}. We hopen dat je tevreden bent met het resultaat.`),
    p("Heb je even? Een korte review op Google helpt anderen om La Moustache te vinden."),
    `<p style="margin:26px 0">${button(ctx.reviewHref, "Schrijf een review")}</p>`,
    p(`Tot de volgende keer. Je volgende afspraak maak je zo op <a href="${esc(ctx.siteUrl)}" style="color:${INK}">onze website</a>.`),
    `<p style="margin:24px 0 0;font:12px/1.6 Arial,Helvetica,sans-serif;color:${STONE}">Je krijgt deze mail één keer, na je afspraak. We sturen geen nieuwsbrieven.</p>`,
  ].join("");

  const text = [
    `Dag ${firstName(b.name)},`,
    "",
    `Bedankt voor je bezoek aan La Moustache voor je ${b.serviceName.toLowerCase()}. We hopen dat je tevreden bent.`,
    "Een korte review op Google helpt anderen om La Moustache te vinden:",
    ctx.reviewHref,
    "",
    `Volgende afspraak: ${ctx.siteUrl}`,
    "",
    "Je krijgt deze mail één keer, na je afspraak. We sturen geen nieuwsbrieven.",
  ].join("\n");

  return {
    to: b.email,
    subject: "Bedankt voor je bezoek aan La Moustache",
    html: layout(ctx, "Bedankt voor je bezoek. Laat je een review achter?", body),
    text,
    replyTo: ctx.replyTo,
  };
}

export function cancellationMail(b: StoredBooking, ctx: MailContext, bookUrl: string): MailMessage {
  const w = when(b, ctx.timeZone);
  const body = [
    h1("Je afspraak is geannuleerd."),
    p(`Je afspraak voor ${esc(b.serviceName.toLowerCase())} op ${esc(w.date)} om ${esc(w.from)} is geannuleerd.`),
    `<p style="margin:24px 0">${button(bookUrl, "Nieuwe afspraak maken")}</p>`,
  ].join("");
  return {
    to: b.email,
    subject: `Geannuleerd: ${b.serviceName} op ${w.date}`,
    html: layout(ctx, "Je afspraak is geannuleerd.", body),
    text: `Je afspraak voor ${b.serviceName} op ${w.date} om ${w.from} is geannuleerd.\nNieuwe afspraak: ${bookUrl}`,
    replyTo: ctx.replyTo,
  };
}

/** Optioneel bericht voor Aziz (BOOKING_NOTIFY_EMAIL). De afspraak staat sowieso al in zijn agenda. */
export function ownerMail(kind: "new" | "cancelled", b: StoredBooking, ctx: MailContext, to: string): MailMessage {
  const w = when(b, ctx.timeZone);
  const title = kind === "new" ? "Nieuwe afspraak" : "Afspraak geannuleerd";
  const lines = [
    `${title}: ${b.serviceName}`,
    `${w.date}, ${w.from} – ${w.to}`,
    `Klant: ${b.name}`,
    `Telefoon: ${b.phone}`,
    `E-mail: ${b.email}`,
    ...(b.note ? [`Opmerking: ${b.note}`] : []),
  ];
  return {
    to,
    subject: `${title}: ${b.name}, ${w.date} om ${w.from}`,
    html: layout(ctx, title, `${h1(esc(title))}${lines.slice(1).map((l) => p(esc(l))).join("")}`),
    text: lines.join("\n"),
  };
}

/** Testmail vanaf de instellingen-check: bewijst dat versturen werkt. */
export function testMail(to: string, ctx: MailContext): MailMessage {
  const body = [
    h1("Het werkt."),
    p("Dit is een testmail van de website van La Moustache. Als je dit leest, kan de website e-mails versturen."),
    p("Zo zien de bevestigingsmails en bedankmails voor klanten eruit: zelfde kop, zelfde stijl."),
  ].join("");
  return {
    to,
    subject: "Testmail van de website van La Moustache",
    html: layout(ctx, "Het versturen van e-mails werkt.", body),
    text: "Dit is een testmail van de website van La Moustache. Als je dit leest, kan de website e-mails versturen.",
    replyTo: ctx.replyTo,
  };
}
