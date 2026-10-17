import type { Metadata } from "next";

import { LegalPage } from "@/components/LegalPage";
import { business } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacyverklaring",
  description: "Hoe La Moustache Barbershop omgaat met je persoonsgegevens.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const controller = business.legal.companyName ?? business.name;
  return (
    <LegalPage title="Privacyverklaring" updated="oktober 2026">
      <p>
        {controller}
        {business.legal.enterpriseNumber ? ` (ondernemingsnummer ${business.legal.enterpriseNumber})` : ""}, gevestigd
        te {business.address.street}, {business.address.postalCode} {business.address.city}, is verantwoordelijk voor
        de verwerking van persoonsgegevens zoals beschreven in deze verklaring. We gaan zorgvuldig om met je gegevens,
        in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG/GDPR).
      </p>

      <h2>Welke gegevens we verwerken</h2>
      <p>Deze website heeft geen contactformulier, geen account en geen nieuwsbrief. We verwerken enkel gegevens die je zelf met ons deelt:</p>
      <ul>
        <li>
          <strong>Afspraken via telefoon of WhatsApp:</strong> je naam, telefoonnummer en het gewenste tijdstip. Deze
          gegevens gebruiken we uitsluitend om je afspraak in te plannen en je te contacteren over die afspraak.
        </li>
        <li>
          <strong>Technische gegevens:</strong> onze hostingprovider verwerkt bij elk bezoek technische gegevens (zoals
          IP-adres en browsertype) om de website veilig en beschikbaar te houden.
        </li>
      </ul>

      <h2>Diensten van derden</h2>
      <p>
        Wanneer je via WhatsApp een bericht stuurt, gelden de voorwaarden en het privacybeleid van WhatsApp (Meta).
        Kies je ervoor om de kaart van Google Maps te tonen, dan worden gegevens uitgewisseld met Google. Dat gebeurt
        pas nadat je daar zelf toestemming voor geeft. Links naar Instagram en Facebook openen de platformen van Meta,
        met hun eigen privacybeleid.
      </p>

      <h2>Foto&apos;s</h2>
      <p>
        Foto&apos;s van klanten op deze website en op onze sociale media worden enkel gepubliceerd met toestemming van
        de betrokken persoon. Wil je dat een foto verwijderd wordt? Laat het ons weten, dan doen we dat zo snel
        mogelijk.
      </p>

      <h2>Bewaartermijn</h2>
      <p>We bewaren gegevens niet langer dan nodig is voor het doel waarvoor ze verzameld werden.</p>

      <h2>Je rechten</h2>
      <p>
        Je hebt het recht om je gegevens in te kijken, te laten verbeteren of te laten verwijderen, en om bezwaar te
        maken tegen de verwerking. Neem hiervoor contact op via {business.phone.display}
        {business.email.verified ? ` of ${business.email.address}` : ""}, of kom langs in de zaak. Ben je niet
        tevreden over hoe we met je gegevens omgaan, dan kan je een klacht indienen bij de{" "}
        <a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" rel="noopener noreferrer">
          Gegevensbeschermingsautoriteit
        </a>
        .
      </p>

      <h2>Cookies</h2>
      <p>
        Lees meer over cookies en externe inhoud in onze <a href="/cookies">cookieverklaring</a>.
      </p>
    </LegalPage>
  );
}
