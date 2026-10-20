# La Moustache Barbershop: website

Website voor **La Moustache Barbershop** (Aziz Güler), Karel Lodewijk Maenhoutstraat 45, 9830 Sint-Martens-Latem.

Gebouwd met Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Framer Motion en Lucide.

---

## Lokaal starten

Vereist Node.js 20 of hoger.

```bash
cd projects/la-moustache
npm install
npm run dev          # ontwikkelserver op http://localhost:3000
```

Productieversie testen:

```bash
npm run build
npm start
```

Typecheck: `npm run lint`

## Deployen op Vercel

1. Push deze repository naar GitHub (staat er al).
2. Ga naar [vercel.com/new](https://vercel.com/new) en importeer de repository.
3. Zet **Root Directory** op `projects/la-moustache`. Vercel herkent Next.js automatisch.
4. Voeg onder *Environment Variables* toe:
   `NEXT_PUBLIC_SITE_URL` = het definitieve domein, bv. `https://www.lamoustache.be`
   (nodig voor canonical URLs, sitemap, Open Graph en structured data).
5. Deploy. Koppel daarna het eigen domein via *Settings → Domains*.
6. Na livegang: dien `https://<domein>/sitemap.xml` in bij Google Search Console en zet de
   website-URL in het Google Bedrijfsprofiel.

## Alles aanpassen op één plek

| Wat | Bestand |
| --- | --- |
| Adres, telefoon, WhatsApp, e-mail, ondernemingsnummer, boekingslink | `src/config/site.ts` → `business` |
| Openingsuren | `src/config/site.ts` → `openingHours` |
| Diensten, prijzen en duur | `src/config/site.ts` → `services` |
| Reviews (alleen geverifieerde worden getoond) | `src/config/site.ts` → `reviews`, `reviewSummary` |
| Instagram en Facebook | `src/config/site.ts` → `social` |
| Sponsor (STMNT) | `src/config/site.ts` → `sponsor` |
| Online afspraken (duur, voorlooptijd, sluitingsdagen) | `src/config/booking.ts` |
| SEO-titel, beschrijving, zoekwoorden | `src/config/site.ts` → `seo` |
| Foto's en alt-teksten | `src/assets/photos/*` en `src/config/photos.ts` |

- **Een dienst tonen of verbergen:** zet `published` op `true` of `false`.
- **Prijzen:** vul `price` (in euro) en `duration` (in minuten) in. Zolang ze `null` zijn, staat er "Tarief op aanvraag".
- **Reviews:** neem tekst, naam en score letterlijk over van Google en zet `verified: true`. Daarna verschijnt
  automatisch de reviewslider. Vul je ook `reviewSummary` in, dan staat de gemiddelde score bovenaan.
- **Online boeken:** vul `bookingUrl` in (Salonized, Planity, Booksy, …). Dan verschijnt overal een knop "Online boeken".
- **Foto vervangen:** zet een scherpere versie met **dezelfde bestandsnaam** in `src/assets/photos/`.

## Wat er gebouwd is

- One-page site met Hero, Over ons, Services, Gallery (met lightbox, swipe en toetsenbord), Reviews,
  Experience, Afspraak, Contact & locatie en Footer
- Navigatie die meekleurt bij scrollen, een volledig scherm mobiel menu (focus-trap, Escape) en een
  actieve-sectie-indicator
- Plakkende afspraakbalk op mobiel, die verdwijnt bij de afspraak- en contactsectie
- Live status "Nu open / Gesloten" in Belgische tijd, met markering van vandaag in de urentabel
- Google Maps pas na toestemming (de keuze blijft lokaal bewaard en is in te trekken op `/cookies`)
- Pagina's `/privacy` en `/cookies`, plus een eigen 404-pagina
- SEO: metadata, Open Graph en Twitter cards (`public/og.jpg`), canonical URLs, `sitemap.xml`, `robots.txt`,
  webmanifest, favicon en apple-icon, structured data van het type `BarberShop` (zonder reviewsterren, zie Google-richtlijnen)
- Toegankelijkheid: skip-link, semantische koppen, alt-teksten, zichtbare focus, `prefers-reduced-motion`
- Prestaties: geoptimaliseerde beelden (AVIF/WebP via `next/image`), zelf gehoste fonts (`next/font`),
  hero-animaties in pure CSS en Framer Motion lui geladen

### Lighthouse (lokaal gemeten op een productiebuild)

| | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| Desktop | 100 | 100 | 100 | 100 |
| Mobiel (gesimuleerde trage 4G) | 87–93 | 100 | 100 | 100 |

## Online afspraken

Klanten boeken zelf een vrij moment op `/afspraak-maken`. Zo werkt het:

1. **Kiezen.** De klant kiest een dienst, een dag en een vrij tijdstip. Vrije momenten zijn de openingsuren
   (`src/config/site.ts`) min alles wat al in de Google Agenda van Aziz staat.
2. **Boeken.** Het systeem controleert vlak voor het boeken opnieuw of het moment nog vrij is (geen dubbele
   boekingen) en zet de afspraak meteen in zijn **Google Agenda**, met naam, telefoon en e-mail van de klant.
3. **Bevestiging.** De klant krijgt een **bevestigingsmail** met datum, uur, adres, routebeschrijving, een
   agenda-bestand (.ics) en een **annuleerlink**. Annuleert de klant, dan verdwijnt de afspraak uit de agenda en
   komt het moment weer vrij.
4. **Bedankmail.** Elke avond om ±21u stuurt het systeem een **bedankmail** naar wie die dag (of de dag ervoor) een
   afspraak had, met een knop naar de Google Reviews. Klanten kunnen dat bij het boeken uitzetten. Iedereen krijgt
   die mail hooguit één keer.

Er is geen aparte database: de Google Agenda zelf is de databank. Elke afspraak bevat verborgen velden met de
klantgegevens en of de bedankmail al verstuurd is.

### Drie standen (`NEXT_PUBLIC_BOOKING_MODE`)

| Stand | Wat er gebeurt |
| --- | --- |
| `off` (standaard) | Alles blijft zoals voorheen: de knoppen verwijzen naar WhatsApp. |
| `demo` | De boekingspagina werkt volledig, maar afspraken blijven in het geheugen en e-mails worden niet verstuurd. Om te testen. |
| `live` | Echte afspraken in Google Agenda en echte e-mails. Werkt pas als alle sleutels hieronder ingevuld zijn; anders zegt de pagina dat online boeken nog niet beschikbaar is. |

Na het wijzigen van de stand op Vercel: opnieuw deployen.

### Eenmalig instellen (± 30 minuten)

**1. Google Agenda koppelen (gratis)**

1. Ga naar [console.cloud.google.com](https://console.cloud.google.com), maak een project (bv. "La Moustache").
2. Zoek **Google Calendar API** en klik op **Inschakelen**.
3. Ga naar *IAM en beheer → Serviceaccounts → Serviceaccount maken* (naam bv. "boekingen"). Rollen zijn niet nodig.
4. Open het serviceaccount → *Sleutels → Sleutel toevoegen → JSON*. Er wordt een bestand gedownload.
5. Open in **Google Agenda** de instellingen van de agenda van de zaak → *Delen met specifieke personen* → voeg het
   e-mailadres van het serviceaccount toe met **"Wijzigingen aanbrengen in afspraken"**.
6. Noteer de **agenda-ID** (onder *Agenda integreren*; bij de hoofdagenda is dat het Gmail-adres).

**2. E-mail instellen via [Resend](https://resend.com)** (gratis tot 3.000 mails per maand)

1. Maak een account en voeg het domein van de website toe. Kies als regio **Ierland (eu-west-1)**.
2. Zet de DNS-records die Resend toont bij de domeinregistrar (nodig zodat mails niet in spam belanden).
3. Maak een **API-sleutel** aan.

**3. Op Vercel invullen** (*Project → Settings → Environment Variables*). Zie ook `.env.example`.

| Variabele | Waarde |
| --- | --- |
| `NEXT_PUBLIC_BOOKING_MODE` | `live` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `client_email` uit het JSON-bestand |
| `GOOGLE_PRIVATE_KEY` | `private_key` uit het JSON-bestand (volledig, met `-----BEGIN…`) |
| `GOOGLE_CALENDAR_ID` | de agenda-ID uit stap 1.6 |
| `RESEND_API_KEY` | de sleutel uit stap 2.3 |
| `MAIL_FROM` | bv. `La Moustache <afspraken@domein.be>` (adres op het geverifieerde domein) |
| `MAIL_REPLY_TO` | het adres waarop klanten mogen antwoorden |
| `BOOKING_SECRET` | een lange willekeurige tekst (beveiligt de annuleerlinks) |
| `CRON_SECRET` | een lange willekeurige tekst (beveiligt de dagelijkse bedankmail-taak) |
| `BOOKING_NOTIFY_EMAIL` | optioneel: Aziz krijgt ook een mail bij elke boeking of annulering |

**4. Deployen.** De dagelijkse bedankmail staat al ingepland in `vercel.json` (19:15 UTC = 20:15 of 21:15 in België).

**5. Testen.** Boek zelf een afspraak, controleer de agenda en de bevestigingsmail, en annuleer via de link.

### Dagelijks gebruik voor Aziz

- **Nieuwe afspraken** verschijnen vanzelf in zijn Google Agenda, met een melding op zijn telefoon zoals elke
  andere afspraak. Titel: `Dienst · Naam klant`, met telefoon en e-mail in de beschrijving.
- **Een moment blokkeren** (pauze, privé): zet een afspraak in de agenda. Alles wat als "Bezet" staat, kan niet
  geboekt worden. Let op: een afspraak voor een **hele dag** staat in Google Agenda standaard op "Beschikbaar"; zet
  die op **"Bezet"**, of voeg de datum toe aan `closedDates` in `src/config/booking.ts`.
- **Zelf een afspraak verplaatsen of schrappen** in de agenda kan gewoon, maar dan krijgt de klant **geen**
  automatische mail. Verwittig de klant dus zelf (telefoon of WhatsApp).
- **Boekingsregels** (duur per dienst, om de hoeveel minuten, minimaal 2 uur op voorhand, tot 6 weken vooruit)
  staan in `src/config/booking.ts`. **De duur per dienst (nu overal 30 min) moet Aziz nog bevestigen.**

### Goed om te weten

- **Vercel-abonnement:** het gratis Hobby-plan van Vercel is bedoeld voor niet-commerciële projecten. Voor een
  zaak is het **Pro-plan** (± $20 per maand) de juiste keuze. Google Agenda-koppeling en Resend zijn gratis bij dit
  volume.
- **Bescherming tegen misbruik:** een onzichtbaar lokveld houdt eenvoudige spambots tegen, en per IP-adres is het
  aantal pogingen beperkt. Komt er toch spam binnen, dan is Cloudflare Turnstile een eenvoudige uitbreiding.
- **Testen:** `npm test` draait 17 automatische tests op de boekingslogica: tijdzones (zomer/winter), vrije
  momenten, dubbele boekingen, annuleren, bedankmails, het agenda-bestand en de Google-koppeling met een
  nagebootste Google-server. Lokaal uitproberen: `NEXT_PUBLIC_BOOKING_MODE=demo npm run dev`.

## Bronnen

| Bron | Gebruikt voor |
| --- | --- |
| Instagram [@la_moustache_latem](https://www.instagram.com/la_moustache_latem/) (screenshots van de klant) | Naam eigenaar, openingsuren, "enkel op afspraak", telefoon, adres, foto's |
| Instagramposts van 27 februari en 3 april 2025 (screenshots van de klant) | Letterlijke citaten in "Over ons" en "De ervaring" |
| Facebookpagina "La moustache Latem" (screenshots van de klant) | Adres met postcode, telefoon, e-mailadres (nog niet getoond), cover- en logobeeld |
| [Het Nieuwsblad, 21 februari 2025](https://www.nieuwsblad.be/regio/oost-vlaanderen/regio-gent/eeklo/kapper-aziz-32-realiseert-in-latem-zijn-grote-droom-idee-is-ontstaan-op-een-tuktuk-in-thailand/42678205.html) | Opening in 2025 en het idee "ontstaan op een tuktuk in Thailand" (enkel de kop, overgenomen uit de link en op de site getoond als persvermelding met bron; de artikeltekst zelf was niet bereikbaar en is niet gebruikt) |
| [Goudengids / Golden Pages](https://www.goldenpages.be/companies/Sint-Martens-Latem/hairdressing+salons+-+gentlemen/) | Bevestiging van de volledige straatnaam "Karel Lodewijk Maenhoutstraat 45". De telefoonnummers op die vermelding wijken af en zijn **niet** gebruikt. |

Niet bereikbaar vanuit de bouwomgeving: Google Maps / Google Bedrijfsprofiel, Google Reviews, Instagram en
Facebook live. Daarom staan er nog geen reviews, prijzen of beoordelingsaantallen op de site.

## Nog te bevestigen door Aziz vóór livegang

1. **Zaterdag sluitingsuur:** Instagram vermeldt 16:00, Facebook 17:00. De site gebruikt nu 16:00.
2. **Diensten:** zijn baardverzorging en "knippen & baard" aanbod? Ze staan klaar in de config maar zijn verborgen.
3. **Prijzen en duur** per dienst.
4. **Google Reviews:** welke reviews (naam, tekst, score) mogen getoond worden, plus de actuele gemiddelde score en het aantal.
5. **Google Place ID** van het Bedrijfsprofiel, voor directe links naar reviews en het reviewformulier.
6. **E-mailadres:** is `barbershopeeklo@gmail.com` (van Facebook) het juiste adres voor de zaak?
7. **Directe link naar de Facebookpagina:** nu staat er een zoeklink.
8. **Wettelijke gegevens (verplicht in België):** juridische naam van de onderneming en het ondernemingsnummer (KBO/btw).
9. **Domeinnaam:** de placeholder `lamoustache-latem.be` in `seo.siteUrl` moet vervangen worden.
10. **Online afspraken:** de duur per dienst bevestigen en de koppeling instellen (zie "Online afspraken").
11. **Origineel logobestand** (SVG, AI of PDF). Het huidige beeldmerk is een vectorreconstructie op basis van het
    profielbeeld. Het woordmerk is gezet in het lettertype Allura, als benadering van het handgeschreven logo.
12. **Originele foto's** in hoge resolutie. De huidige beelden zijn uitgesneden uit screenshots van Instagram- en
    Facebookvideo's, dus ze zijn zachter dan nodig.
13. **Privacyverklaring:** klopt de zin dat klantfoto's enkel met toestemming gepubliceerd worden?
14. **Sponsor STMNT Grooming Goods:** staat op de site in "Over ons", de footer, de Styling-dienst en de
    structured data, omdat de klant bevestigde dat Aziz door STMNT gesponsord wordt. Vraag STMNT of ze akkoord gaan
    met de vermelding, of ze een officieel logo willen laten gebruiken, en controleer de link
    (`https://www.stmntgrooming.com`). Uitzetten kan met `sponsor.active = false` in `src/config/site.ts`.

## Gebruikte afbeeldingen en toestemming

Alle foto's komen van de eigen Instagram- en Facebookaccounts van La Moustache, aangeleverd als screenshots.
Er zijn geen stockfoto's gebruikt en er is niets aan gezichten, kapsels of resultaten veranderd. De foto's zijn
alleen bijgesneden, zodat de interface van Instagram en Facebook wegvalt. Twee spiegelopnames zijn teruggespiegeld.

| Bestand | Inhoud | Herkenbare klant? |
| --- | --- | --- |
| `aziz-portrait.jpg` | Aziz aan zijn bureau, post van 3 april 2025 (Over ons) | Nee |
| `interior.jpg` | De zaak met wasstoelen en raam, een barber aan het werk (hero, OG-beeld) | Ja |
| `neon.jpg` | Barber en klant voor de neonmuur, post van 27 februari 2025 (De ervaring) | Ja |
| `stmnt-aziz.jpg` | Lachende barber stylet een klant (galerij). Gespiegeld, net als `stmnt-cape.jpg` | Ja |
| `stmnt-cape.jpg` | Klant onder de STMNT-kapmantel (galerij). Horizontaal gespiegeld: het origineel is via een spiegel gefilmd, zodat het STMNT-logo nu leesbaar is | Ja |
| `spray.jpg` | Haar bevochtigen voor het knippen (galerij) | Deels (zijaanzicht) |
| `curls-result.jpg` | Portret van het resultaat: krullen met fade (galerij) | Ja |
| `cap-cut.jpg` | Aziz knipt met de schaar (galerij) | Deels (gezicht naar beneden) |

Het citaat in "Over ons" komt letterlijk uit Aziz' Instagrampost van 3 april 2025.

Bij `interior.jpg`, `neon.jpg` en `spray.jpg` is niet zeker of de barber in beeld Aziz zelf is. De alt-teksten
noemen daarom geen naam. Laat Aziz dit bevestigen.

Zwakkere uitsneden (een klant die volledig in beeld zit, wazige interieurbeelden, een decoratieve basketbal)
zijn bewust weggelaten. Nieuwe foto's toevoegen gaat via `src/config/photos.ts`: de galerij groeit dan
automatisch mee.

✅ **Toestemming:** de klant bevestigde dat het gebruik van alle foto's op de website juridisch in orde is.
De foto van een kind uit het Instagram-raster is niet gebruikt.
