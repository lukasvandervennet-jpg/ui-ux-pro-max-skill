/**
 * ─────────────────────────────────────────────────────────────────────────
 *  LA MOUSTACHE — centrale configuratie
 *
 *  Alle bedrijfsgegevens, openingsuren, diensten, reviews en SEO-instellingen
 *  staan in dit ene bestand. Pas hier aan, de hele website volgt automatisch.
 *
 *  Regel: alleen echte, bevestigde gegevens. Wat nog niet bevestigd is,
 *  staat op `null` of `verified: false` en wordt dan niet getoond.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const business = {
  name: "La Moustache Barbershop",
  shortName: "La Moustache",
  owner: "Aziz Güler",
  founded: 2025,

  address: {
    street: "Karel Lodewijk Maenhoutstraat 45",
    streetShort: "K. L. Maenhoutstraat 45",
    postalCode: "9830",
    city: "Sint-Martens-Latem",
    region: "Oost-Vlaanderen",
    country: "BE",
    countryName: "België",
  },

  phone: {
    display: "+32 499 92 33 42",
    local: "0499 92 33 42",
    e164: "+32499923342",
  },

  whatsapp: {
    number: "32499923342",
    message:
      "Dag Aziz, ik zou graag een afspraak maken bij La Moustache. Wanneer heb je nog plaats?",
  },

  /**
   * E-mailadres staat op de Facebookpagina "La moustache Latem", maar is nog
   * niet door Aziz bevestigd. Zet `verified` op true om het te tonen.
   */
  email: {
    address: "barbershopeeklo@gmail.com",
    verified: false,
  },

  /** Verplicht in België vóór livegang (KBO / BTW). Wordt getoond zodra ingevuld. */
  legal: {
    companyName: null as string | null, // bv. "Güler BV" of naam eenmanszaak
    enterpriseNumber: null as string | null, // bv. "BE 0123.456.789"
  },

  appointmentOnly: true,

  /**
   * Online boekingssysteem. Er is momenteel geen gevonden.
   * Vul een URL in (bv. Salonized, Planity, Booksy) en de knoppen verschijnen.
   */
  bookingUrl: null as string | null,

  /**
   * Google Place ID van het Bedrijfsprofiel (te vinden via
   * https://developers.google.com/maps/documentation/places/web-service/place-id).
   * Ingevuld → directe links naar de reviews en het reviewformulier.
   */
  googlePlaceId: null as string | null,
} as const;

export const social = {
  instagram: {
    handle: "@la_moustache_latem",
    url: "https://www.instagram.com/la_moustache_latem/",
  },
  facebook: {
    name: "La moustache Latem",
    // TODO: vervang door de directe link naar de Facebookpagina zodra die gekend is.
    url: "https://www.facebook.com/search/top?q=La%20moustache%20Latem",
    isDirectPage: false,
  },
} as const;

/* ── Openingsuren ────────────────────────────────────────────────────────
 * day: 0 = zondag … 6 = zaterdag (zoals JavaScript Date#getDay).
 * Zaterdag: Instagram vermeldt 16:00, Facebook 17:00 — nog te bevestigen.
 */
export type OpeningDay = {
  day: number;
  label: string;
  short: string;
  schemaDay: string;
  open: string | null;
  close: string | null;
};

export const openingHours: OpeningDay[] = [
  { day: 1, label: "Maandag", short: "Ma", schemaDay: "Monday", open: null, close: null },
  { day: 2, label: "Dinsdag", short: "Di", schemaDay: "Tuesday", open: "10:00", close: "19:00" },
  { day: 3, label: "Woensdag", short: "Wo", schemaDay: "Wednesday", open: "10:00", close: "19:00" },
  { day: 4, label: "Donderdag", short: "Do", schemaDay: "Thursday", open: "10:00", close: "19:00" },
  { day: 5, label: "Vrijdag", short: "Vr", schemaDay: "Friday", open: "10:00", close: "19:00" },
  { day: 6, label: "Zaterdag", short: "Za", schemaDay: "Saturday", open: "10:00", close: "16:00" },
  { day: 0, label: "Zondag", short: "Zo", schemaDay: "Sunday", open: null, close: null },
];

/* ── Diensten ────────────────────────────────────────────────────────────
 * `published: true` alleen voor diensten die bevestigd zijn.
 * Prijs en duur: laat `null` tot Aziz ze bevestigt — er wordt dan
 * "Tarief op aanvraag" getoond in plaats van een verzonnen bedrag.
 */
export type Service = {
  id: string;
  title: string;
  titleNl: string;
  description: string;
  price: number | null; // in euro
  duration: number | null; // in minuten
  published: boolean;
};

export const services: Service[] = [
  {
    id: "haircut",
    title: "Men’s Haircut",
    titleNl: "Herenknipbeurt",
    description:
      "Een snit die past bij je haar, je gezicht en je dag. We overlopen eerst wat je wil, daarna nemen we de tijd om het juist te doen.",
    price: null,
    duration: null,
    published: true,
  },
  {
    id: "fade",
    title: "Fade",
    titleNl: "Fade & skin fade",
    description:
      "Van low tot skin: een vloeiende overgang zonder harde lijnen, strak uitgewerkt rond oren en nek.",
    price: null,
    duration: null,
    published: true,
  },
  {
    id: "styling",
    title: "Styling",
    titleNl: "Krullen & styling",
    description:
      "Krullen, textuur of een strakke look: gevormd, gestyled en afgewerkt met het juiste product, zodat je weet hoe je het thuis houdt.",
    price: null,
    duration: null,
    published: true,
  },
  {
    id: "kids",
    title: "Kids Haircut",
    titleNl: "Kinderknipbeurt",
    description:
      "Rustig, geduldig en met dezelfde zorg. Voor de jongste klanten die er ook sharp willen uitzien.",
    price: null,
    duration: null,
    published: true,
  },
  {
    id: "beard",
    title: "Beard Trim",
    titleNl: "Baardverzorging",
    description: "Contouren, lengte en lijnen van je baard, netjes en symmetrisch afgewerkt.",
    price: null,
    duration: null,
    published: false, // nog te bevestigen
  },
  {
    id: "haircut-beard",
    title: "Haircut & Beard",
    titleNl: "Knippen & baard",
    description: "De volledige behandeling: snit en baard in één afspraak.",
    price: null,
    duration: null,
    published: false, // nog te bevestigen
  },
];

/* ── Reviews ─────────────────────────────────────────────────────────────
 * Alleen reviews met `verified: true` worden getoond.
 * Neem tekst, naam en score letterlijk over van Google en zet `verified`
 * pas op true nadat je ze op het Google Bedrijfsprofiel hebt nagekeken.
 */
export type Review = {
  author: string | null;
  text: string;
  rating: number | null;
  source: "Google";
  date?: string;
  verified: boolean;
};

export const reviews: Review[] = [
  {
    author: null,
    text: "Snit perfect afgewerkt tot in kleinste detail. Aanrader!",
    rating: null,
    source: "Google",
    verified: false,
  },
  {
    author: null,
    text: "Friendly and highly-skilled",
    rating: null,
    source: "Google",
    verified: false,
  },
  {
    author: null,
    text: "Strakke fade, baard netjes afgewerkt en goede service.",
    rating: null,
    source: "Google",
    verified: false,
  },
];

/** Totaalscore van het Google Bedrijfsprofiel. Pas invullen na controle. */
export const reviewSummary = {
  rating: null as number | null,
  count: null as number | null,
};

/* ── SEO ─────────────────────────────────────────────────────────────── */
export const seo = {
  /** Definitief domein. Stel in via NEXT_PUBLIC_SITE_URL op Vercel. */
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lamoustache-latem.be").replace(/\/$/, ""),
  title: "La Moustache Barbershop | Barbier & herenkapper in Sint-Martens-Latem",
  titleTemplate: "%s | La Moustache Barbershop",
  description:
    "La Moustache is de barbershop van Aziz Güler in Sint-Martens-Latem. Fades, herenknipbeurten en styling met precisie en persoonlijke aandacht. Enkel op afspraak.",
  locale: "nl_BE",
  keywords: [
    "barbier Sint-Martens-Latem",
    "barbershop Sint-Martens-Latem",
    "herenkapper Sint-Martens-Latem",
    "kapper Latem",
    "barber Latem",
    "herenkapper Gent",
    "fade Sint-Martens-Latem",
    "La Moustache Latem",
    "Aziz Güler kapper",
  ],
} as const;

/* ── Bronnen ─────────────────────────────────────────────────────────── */
export const press = {
  nieuwsblad: {
    outlet: "Het Nieuwsblad",
    date: "2025-02-21",
    title: "Kapper Aziz realiseert in Latem zijn grote droom",
    url: "https://www.nieuwsblad.be/regio/oost-vlaanderen/regio-gent/eeklo/kapper-aziz-32-realiseert-in-latem-zijn-grote-droom-idee-is-ontstaan-op-een-tuktuk-in-thailand/42678205.html",
  },
} as const;

export const navigation = [
  { href: "/#top", label: "Home" },
  { href: "/#over-ons", label: "Over ons" },
  { href: "/#services", label: "Services" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#contact", label: "Contact" },
] as const;
