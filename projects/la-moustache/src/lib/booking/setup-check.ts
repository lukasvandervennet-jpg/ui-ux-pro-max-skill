import "server-only";

import { bookingMode, bookingSettings } from "@/config/booking";
import { business, seo, social } from "@/config/site";
import { links } from "@/lib/links";

import { testMail } from "./emails";
import { googleCalendarFromEnv, mailSetup } from "./server";
import { addDays, utcToZoned, zonedToUtc } from "./time";

export type Check = { title: string; ok: boolean | null; detail: string; fix?: string };

/** Vertaalt technische Google-fouten naar een concrete oplossing. */
function explainGoogleError(message: string, serviceAccount: string, calendarId: string) {
  if (/invalid_grant|invalid_client|PEM|private key|asn1|DECODER/i.test(message)) {
    return "De privésleutel of het e-mailadres van het serviceaccount klopt niet. Kopieer client_email en private_key opnieuw uit het JSON-bestand, inclusief -----BEGIN PRIVATE KEY----- en -----END PRIVATE KEY-----.";
  }
  if (/has not been used|is disabled|accessNotConfigured|SERVICE_DISABLED/i.test(message)) {
    return "De Google Calendar API staat nog niet aan in dit Google Cloud-project. Zoek 'Google Calendar API' in de console en klik op Inschakelen. Wacht daarna 2 minuten.";
  }
  if (/notFound|not found|404|Agenda niet bereikbaar/i.test(message)) {
    return `De agenda "${calendarId}" is niet gedeeld met ${serviceAccount}. Open Google Agenda → instellingen van de agenda → Delen met specifieke personen → voeg ${serviceAccount} toe met "Wijzigingen aanbrengen in afspraken".`;
  }
  if (/403|forbidden|insufficient/i.test(message)) {
    return `Het serviceaccount mag de agenda niet aanpassen. Geef ${serviceAccount} de rechten "Wijzigingen aanbrengen in afspraken" (niet enkel "Alle afspraakdetails bekijken").`;
  }
  return "Controleer de drie Google-instellingen. Lukt het niet, stuur de foutmelding hierboven door.";
}

export async function runSetupChecks(opts: { testMailTo?: string } = {}) {
  const env = process.env;
  const checks: Check[] = [];

  checks.push({
    title: "Website-adres",
    ok: env.NEXT_PUBLIC_SITE_URL ? true : null,
    detail: seo.siteUrl,
    fix: env.NEXT_PUBLIC_SITE_URL
      ? undefined
      : "Nog geen eigen domein ingesteld; links in e-mails gebruiken voorlopig het adres hierboven. Vul NEXT_PUBLIC_SITE_URL in zodra de domeinnaam er is.",
  });

  checks.push({
    title: "Stand van online boeken",
    ok: bookingMode === "live" ? true : null,
    detail:
      bookingMode === "live"
        ? "live — echte afspraken in Google Agenda en echte e-mails"
        : bookingMode === "demo"
          ? "demo — de boekingspagina werkt, niets komt in de agenda; e-mails gaan als TEST de deur uit (als e-mail ingesteld is)"
          : "off — de knoppen verwijzen naar WhatsApp",
    fix: bookingMode === "live" ? undefined : "Zet NEXT_PUBLIC_BOOKING_MODE op live zodra alles hieronder groen is, en deploy opnieuw.",
  });

  checks.push({
    title: "Geheime sleutels",
    ok: Boolean(env.BOOKING_SECRET && env.CRON_SECRET),
    detail: `BOOKING_SECRET ${env.BOOKING_SECRET ? "✓" : "ontbreekt"} · CRON_SECRET ${env.CRON_SECRET ? "✓" : "ontbreekt"}`,
    fix: env.CRON_SECRET ? undefined : "Vul CRON_SECRET in (een lange willekeurige tekst). Zonder deze sleutel worden de bedankmails niet verstuurd.",
  });

  // E-mail
  const mail = mailSetup(env);
  const mailCheck: Check = mail
    ? { title: "E-mail versturen", ok: true, detail: `${mail.provider} · afzender: ${mail.from}` }
    : {
        title: "E-mail versturen",
        ok: false,
        detail: "Nog geen e-maildienst ingesteld.",
        fix: "Vul SMTP_USER (het Gmail-adres) en SMTP_PASS (een app-wachtwoord van Google) in. Of gebruik Resend met RESEND_API_KEY en MAIL_FROM.",
      };
  checks.push(mailCheck);

  let testResult: Check | null = null;
  if (opts.testMailTo) {
    if (!mail) {
      testResult = { title: "Testmail", ok: false, detail: "Stel eerst een e-maildienst in." };
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(opts.testMailTo)) {
      testResult = { title: "Testmail", ok: false, detail: "Dat is geen geldig e-mailadres." };
    } else {
      try {
        await mail.mailer.send(
          testMail(opts.testMailTo, {
            timeZone: bookingSettings.timeZone,
            siteUrl: seo.siteUrl,
            businessName: business.name,
            address: `${business.address.street}, ${business.address.postalCode} ${business.address.city}`,
            phoneDisplay: business.phone.display,
            phoneHref: links.tel,
            whatsappHref: links.whatsapp(),
            mapsHref: links.mapsDirections,
            instagramHref: social.instagram.url,
            reviewHref: links.googleWriteReview ?? links.googleReviews,
            replyTo: env.MAIL_REPLY_TO || undefined,
          }),
        );
        testResult = { title: "Testmail", ok: true, detail: `Verstuurd naar ${opts.testMailTo}. Kijk ook in de map Spam.` };
      } catch (e) {
        const msg = (e as Error).message;
        testResult = {
          title: "Testmail",
          ok: false,
          detail: msg.slice(0, 300),
          fix: /535|Username and Password not accepted|Invalid login|BadCredentials/i.test(msg)
            ? "Gmail weigert de login. Gebruik een app-wachtwoord (niet het gewone wachtwoord): myaccount.google.com/apppasswords. Daarvoor moet verificatie in twee stappen aan staan."
            : /domain is not verified|not verified/i.test(msg)
              ? "Resend: het domein van het afzenderadres is nog niet geverifieerd. Zet de DNS-records die Resend toont."
              : /ENOTFOUND|ECONNREFUSED|ETIMEDOUT|ECONNRESET/i.test(msg)
                ? "De mailserver is niet bereikbaar. Laat SMTP_HOST en SMTP_PORT leeg voor Gmail (dan gebruikt de site smtp.gmail.com, poort 465)."
                : undefined,
        };
      }
    }
  }

  // Google Agenda
  const calendar = googleCalendarFromEnv(env);
  if (!calendar) {
    checks.push({
      title: "Google Agenda",
      ok: false,
      detail: "Nog niet gekoppeld.",
      fix: "Vul GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY en GOOGLE_CALENDAR_ID in (zie de handleiding).",
    });
  } else {
    const today = utcToZoned(new Date(), bookingSettings.timeZone).dateISO;
    try {
      const busy = await calendar.busy(
        zonedToUtc(today, "00:00", bookingSettings.timeZone),
        zonedToUtc(addDays(today, 7), "00:00", bookingSettings.timeZone),
      );
      checks.push({
        title: "Google Agenda",
        ok: true,
        detail: `Verbonden met ${env.GOOGLE_CALENDAR_ID}. ${busy.length} bezette moment(en) in de komende 7 dagen gevonden.`,
      });
    } catch (e) {
      const msg = (e as Error).message;
      checks.push({
        title: "Google Agenda",
        ok: false,
        detail: msg.slice(0, 300),
        fix: explainGoogleError(msg, env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? "het serviceaccount", env.GOOGLE_CALENDAR_ID ?? ""),
      });
    }
  }

  const ready = checks.filter((c) => c.title !== "Stand van online boeken" && c.title !== "Website-adres").every((c) => c.ok);
  return { checks, testResult, ready, mode: bookingMode };
}
