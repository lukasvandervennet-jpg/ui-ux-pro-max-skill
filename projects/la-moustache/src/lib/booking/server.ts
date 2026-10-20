import "server-only";

import { bookingMode, bookingSettings, BOOKING_PATH, serviceDuration } from "@/config/booking";
import { business, openingHours, seo, services, social } from "@/config/site";
import { links } from "@/lib/links";

import { demoCalendar } from "./demo-calendar";
import { GoogleCalendarClient } from "./google-calendar";
import { demoMailer, ResendMailer } from "./mailer";
import type { BookableService, BookingDeps } from "./service";
import type { WeekHours } from "./slots";

/** Diensten die online geboekt kunnen worden: de gepubliceerde diensten uit site.ts. */
export const bookableServices: BookableService[] = services
  .filter((s) => s.published)
  .map((s) => ({ id: s.id, name: s.titleNl, duration: serviceDuration(s.id) }));

const weekHours: WeekHours = Object.fromEntries(openingHours.map((d) => [d.day, { open: d.open, close: d.close }]));

const LIVE_ENV = [
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_PRIVATE_KEY",
  "GOOGLE_CALENDAR_ID",
  "RESEND_API_KEY",
  "MAIL_FROM",
  "BOOKING_SECRET",
] as const;

let cached: BookingDeps | null = null;

/** Bouwt alles wat het boekingssysteem nodig heeft, of legt uit wat er ontbreekt. */
export function bookingDeps(): { deps: BookingDeps } | { error: string; missing?: string[] } {
  if (bookingMode === "off") return { error: "Online boeken staat uit." };
  if (cached) return { deps: cached };

  const env = process.env;
  const live = bookingMode === "live";
  if (live) {
    const missing = LIVE_ENV.filter((k) => !env[k]);
    if (missing.length) return { error: "Online boeken is nog niet volledig ingesteld.", missing };
  }

  const address = `${business.address.street}, ${business.address.postalCode} ${business.address.city}`;
  const siteUrl = seo.siteUrl;

  cached = {
    calendar: live
      ? new GoogleCalendarClient({
          clientEmail: env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
          privateKey: env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
          calendarId: env.GOOGLE_CALENDAR_ID!,
          timeZone: bookingSettings.timeZone,
          location: address,
        })
      : demoCalendar,
    mailer: live ? new ResendMailer(env.RESEND_API_KEY!, env.MAIL_FROM!) : demoMailer,
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
