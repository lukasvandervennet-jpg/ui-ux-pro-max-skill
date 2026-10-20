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
10. **Online boekingssysteem:** is er een? Zo ja, de link.
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
