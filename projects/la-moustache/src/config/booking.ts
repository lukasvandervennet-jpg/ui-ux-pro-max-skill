/**
 * ─────────────────────────────────────────────────────────────────────────
 *  ONLINE AFSPRAKEN — instellingen
 *
 *  De openingsuren komen uit src/config/site.ts. Hier staan enkel de regels
 *  voor het boeken zelf. Geheime sleutels (Google, e-mail) staan NIET hier,
 *  maar in de omgevingsvariabelen op Vercel (zie README → Online afspraken).
 * ─────────────────────────────────────────────────────────────────────────
 */

export const bookingSettings = {
  /** Tijdzone van de zaak. */
  timeZone: "Europe/Brussels",

  /** Om de hoeveel minuten een starttijd aangeboden wordt. */
  slotInterval: 30,

  /**
   * Duur van een afspraak per dienst, in minuten.
   * TE BEVESTIGEN door Aziz: dit bepaalt hoe lang het tijdslot in zijn agenda is.
   */
  defaultDuration: 30,
  durations: {
    haircut: 30,
    fade: 30,
    styling: 30,
    kids: 30,
    beard: 30,
    "haircut-beard": 45,
  } as Record<string, number>,

  /** Minimaal zoveel minuten op voorhand boeken. */
  leadMinutes: 120,

  /** Hoeveel dagen vooruit klanten kunnen boeken. */
  maxDaysAhead: 42,

  /**
   * Extra sluitingsdagen (vakantie, feestdagen) als JJJJ-MM-DD.
   * Alternatief: zet in Google Agenda een afspraak op "Bezet" over de hele dag.
   */
  closedDates: [] as string[],
} as const;

export function serviceDuration(serviceId: string) {
  return bookingSettings.durations[serviceId] ?? bookingSettings.defaultDuration;
}

/**
 * "off"  → geen online boeken: knoppen verwijzen naar WhatsApp (standaard)
 * "demo" → boekingspagina werkt, maar er wordt niets echt geboekt of verstuurd
 * "live" → echte boekingen in Google Agenda + e-mails
 */
export type BookingMode = "off" | "demo" | "live";

export const bookingMode: BookingMode = (() => {
  const v = process.env.NEXT_PUBLIC_BOOKING_MODE;
  return v === "demo" || v === "live" ? v : "off";
})();

export const BOOKING_PATH = "/afspraak-maken";
