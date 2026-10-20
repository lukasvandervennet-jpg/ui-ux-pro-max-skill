"use client";

import { AlertCircle, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { BOOKING_PATH } from "@/config/booking";

type Summary = { service: string; date: string; from: string; past: boolean };
type State =
  | { kind: "loading" }
  | { kind: "ready"; booking: Summary }
  | { kind: "cancelling"; booking: Summary }
  | { kind: "done"; booking: Summary }
  | { kind: "error"; message: string };

export function CancelPanel() {
  const [token, setToken] = useState<string | null>(null);
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token");
    setToken(t);
    if (!t) {
      setState({ kind: "error", message: "Deze link is onvolledig. Gebruik de link uit je bevestigingsmail." });
      return;
    }
    fetch(`/api/booking/cancel?token=${encodeURIComponent(t)}`, { cache: "no-store" })
      .then(async (res) => {
        const data = (await res.json()) as { booking?: Summary; error?: string };
        if (!res.ok || !data.booking) throw new Error(data.error ?? "Deze afspraak kon niet gevonden worden.");
        setState({ kind: "ready", booking: data.booking });
      })
      .catch((e: Error) => setState({ kind: "error", message: e.message }));
  }, []);

  async function cancel() {
    if (state.kind !== "ready" || !token) return;
    setState({ kind: "cancelling", booking: state.booking });
    try {
      const res = await fetch("/api/booking/cancel", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Annuleren lukte niet.");
      setState({ kind: "done", booking: state.booking });
    } catch (e) {
      setState({ kind: "error", message: (e as Error).message });
    }
  }

  return (
    <div className="max-w-2xl bg-white p-7 shadow-[0_40px_80px_-50px_rgba(16,16,16,0.45)] sm:p-10" aria-live="polite">
      {state.kind === "loading" && (
        <p className="flex items-center gap-3 text-ink/70">
          <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Afspraak opzoeken…
        </p>
      )}

      {state.kind === "error" && (
        <>
          <p className="flex items-start gap-3 text-[1.0625rem] text-ink">
            <AlertCircle className="mt-1 size-5 shrink-0 text-[#9b2c1f]" aria-hidden="true" />
            {state.message}
          </p>
          <Link href={BOOKING_PATH} className="btn btn-outline-dark mt-8">
            Nieuwe afspraak maken
          </Link>
        </>
      )}

      {(state.kind === "ready" || state.kind === "cancelling" || state.kind === "done") && (
        <>
          <dl className="divide-y divide-ink/10 border-y border-ink/10">
            {[
              ["Dienst", state.booking.service],
              ["Datum", state.booking.date],
              ["Uur", state.booking.from],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 py-3.5">
                <dt className="text-stone">{k}</dt>
                <dd className="text-right font-medium text-ink first-letter:uppercase">{v}</dd>
              </div>
            ))}
          </dl>

          {state.kind === "done" ? (
            <>
              <p className="mt-7 flex items-center gap-3 text-[1.0625rem] text-ink" role="status">
                <Check className="size-5 text-bronze" aria-hidden="true" />
                Je afspraak is geannuleerd. Je krijgt nog een bevestiging per e-mail.
              </p>
              <Link href={BOOKING_PATH} className="btn btn-dark mt-8">
                Nieuwe afspraak maken
              </Link>
            </>
          ) : state.booking.past ? (
            <p className="mt-7 text-ink/75">Deze afspraak is al voorbij en kan niet meer geannuleerd worden.</p>
          ) : (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={cancel} disabled={state.kind === "cancelling"} className="btn btn-dark disabled:opacity-60">
                {state.kind === "cancelling" && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                {state.kind === "cancelling" ? "Bezig…" : "Ja, annuleer mijn afspraak"}
              </button>
              <Link href="/" className="btn btn-outline-dark">
                Nee, ik kom gewoon
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
