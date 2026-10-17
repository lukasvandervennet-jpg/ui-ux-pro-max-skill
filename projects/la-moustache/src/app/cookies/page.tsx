import type { Metadata } from "next";

import { CookieControls } from "@/components/CookieControls";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Cookieverklaring",
  description: "Welke cookies en externe inhoud de website van La Moustache gebruikt.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <LegalPage title="Cookies" updated="oktober 2026">
      <p>
        Deze website plaatst zelf <strong>geen</strong> tracking-, analyse- of advertentiecookies. Daarom zie je ook
        geen cookiebanner.
      </p>

      <h2>Google Maps</h2>
      <p>
        In de sectie &ldquo;Find your barber&rdquo; kan je een kaart van Google Maps laden. Die kaart wordt pas getoond
        nadat je op &ldquo;Kaart tonen&rdquo; klikt. Vanaf dat moment kan Google cookies plaatsen en gegevens zoals je
        IP-adres verwerken, volgens het{" "}
        <a href="https://policies.google.com/privacy?hl=nl" target="_blank" rel="noopener noreferrer">
          privacybeleid van Google
        </a>
        .
      </p>
      <p>
        Vink je &ldquo;Keuze onthouden&rdquo; aan, dan bewaren we die keuze lokaal in je browser (localStorage). Dat is
        geen cookie en wordt niet naar ons doorgestuurd. Je kan je toestemming hier op elk moment intrekken:
      </p>
      <CookieControls />

      <h2>Externe links</h2>
      <p>
        Links naar WhatsApp, Instagram, Facebook en Google openen de websites of apps van die partijen. Op die
        platformen gelden hun eigen cookie- en privacyregels.
      </p>
    </LegalPage>
  );
}
