"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { business } from "@/config/site";
import { links } from "@/lib/links";
import { MoustacheMark } from "./Logo";

export const MAP_CONSENT_KEY = "lm-maps-consent";

/**
 * Google Maps wordt pas geladen na toestemming (Google plaatst cookies en
 * ontvangt het IP-adres). De keuze wordt lokaal onthouden en kan op
 * /cookies weer ingetrokken worden.
 */
export function MapConsent() {
  const [allowed, setAllowed] = useState(false);
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem(MAP_CONSENT_KEY) === "granted") setAllowed(true);
    } catch {
      /* opslag geblokkeerd: gewoon opnieuw vragen */
    }
  }, []);

  const accept = () => {
    setAllowed(true);
    if (remember) {
      try {
        localStorage.setItem(MAP_CONSENT_KEY, "granted");
      } catch {
        /* negeren */
      }
    }
  };

  if (allowed) {
    return (
      <iframe
        title={`Kaart: ${business.name}, ${links.fullAddress}`}
        src={links.mapsEmbed}
        className="size-full border-0 grayscale-[0.35] contrast-[1.05]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    );
  }

  return (
    <div className="grain relative flex size-full flex-col justify-between overflow-hidden bg-ink p-7 text-ivory sm:p-10">
      {/* Abstract stratenplan als decor */}
      <svg aria-hidden="true" className="absolute inset-0 size-full text-ivory/[0.06]" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 400">
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M-20 260 C80 230 150 250 220 210 S360 120 430 140" />
          <path d="M60 -20 C90 80 120 160 130 240 S150 360 140 430" />
          <path d="M-20 120 C60 140 140 110 230 130 S360 200 430 190" strokeWidth="6" />
          <path d="M260 -20 C250 80 280 170 300 260 S340 380 360 430" />
          <path d="M-20 340 C100 320 200 330 300 300 S400 280 430 290" />
          <circle cx="200" cy="200" r="60" />
          <circle cx="200" cy="200" r="120" />
        </g>
      </svg>

      <div className="relative flex items-center gap-3 text-sm text-ivory/70">
        <MapPin className="size-4 text-gold" aria-hidden="true" strokeWidth={1.6} />
        {business.address.streetShort}, {business.address.city}
      </div>

      <div className="relative mx-auto flex flex-col items-center text-center">
        <span className="relative inline-flex size-20 items-center justify-center rounded-full border border-gold/50">
          <MoustacheMark className="w-10 text-gold" />
        </span>
        <p className="mt-6 max-w-xs text-[0.9375rem] leading-relaxed text-ivory/75">
          Bij het tonen van de kaart worden gegevens uitgewisseld met Google.{" "}
          <Link href="/cookies" className="underline decoration-ivory/30 underline-offset-4 hover:decoration-gold">
            Meer info
          </Link>
        </p>
        <button type="button" onClick={accept} className="btn btn-primary mt-6">
          Kaart tonen
        </button>
        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-[0.8125rem] text-ivory/60">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="size-4 accent-[#b9975b]"
          />
          Keuze onthouden
        </label>
      </div>

      <a
        href={links.mapsDirections}
        target="_blank"
        rel="noopener noreferrer"
        className="link-underline relative self-start text-sm text-ivory/80"
      >
        Of open de route in Google Maps
      </a>
    </div>
  );
}
