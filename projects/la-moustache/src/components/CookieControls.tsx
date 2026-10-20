"use client";

import { useEffect, useState } from "react";

import { MAP_CONSENT_KEY } from "./MapConsent";

export function CookieControls() {
  const [granted, setGranted] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      setGranted(localStorage.getItem(MAP_CONSENT_KEY) === "granted");
    } catch {
      setGranted(false);
    }
  }, []);

  const revoke = () => {
    try {
      localStorage.removeItem(MAP_CONSENT_KEY);
    } catch {
      /* negeren */
    }
    setGranted(false);
  };

  return (
    <div className="flex flex-col gap-4 border border-ink/15 p-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[0.9375rem]" aria-live="polite">
        Google Maps:{" "}
        <strong>{granted === null ? "…" : granted ? "toestemming gegeven" : "geen toestemming opgeslagen"}</strong>
      </p>
      <button type="button" onClick={revoke} disabled={!granted} className="btn btn-outline-dark disabled:pointer-events-none disabled:opacity-40">
        Toestemming intrekken
      </button>
    </div>
  );
}
