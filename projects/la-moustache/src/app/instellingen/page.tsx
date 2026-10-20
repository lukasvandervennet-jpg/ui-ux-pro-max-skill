import { CheckCircle2, CircleDashed, XCircle } from "lucide-react";
import type { Metadata } from "next";

import { BookingShell } from "@/components/booking/BookingShell";
import { runSetupChecks, type Check } from "@/lib/booking/setup-check";

export const metadata: Metadata = {
  title: "Instellingen-check",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function Row({ c }: { c: Check }) {
  const Icon = c.ok === true ? CheckCircle2 : c.ok === false ? XCircle : CircleDashed;
  const color = c.ok === true ? "text-[#2f6b3c]" : c.ok === false ? "text-[#9b2c1f]" : "text-bronze";
  return (
    <li className="flex gap-4 border-b border-ink/10 py-5 last:border-b-0">
      <Icon className={`mt-0.5 size-6 shrink-0 ${color}`} aria-hidden="true" strokeWidth={1.8} />
      <div className="min-w-0">
        <p className="font-semibold text-ink">
          {c.title}
          <span className="sr-only">: {c.ok === true ? "in orde" : c.ok === false ? "actie nodig" : "info"}</span>
        </p>
        <p className="mt-1 break-words text-[0.9375rem] text-ink/75">{c.detail}</p>
        {c.fix && <p className="mt-2 border-l-2 border-bronze/60 pl-3 text-[0.9375rem] text-ink">{c.fix}</p>}
      </div>
    </li>
  );
}

export default async function SetupPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const secret = process.env.BOOKING_SECRET;

  if (!secret || params.sleutel !== secret) {
    return (
      <BookingShell
        eyebrow="Beheer"
        title="Instellingen-check"
        intro={
          secret
            ? "Open deze pagina met ?sleutel= gevolgd door de waarde van BOOKING_SECRET."
            : "Vul eerst BOOKING_SECRET in op Vercel (een lange willekeurige tekst) en deploy opnieuw. Open daarna deze pagina met ?sleutel= gevolgd door die tekst."
        }
      >
        <span />
      </BookingShell>
    );
  }

  const { checks, testResult, ready, mode } = await runSetupChecks({ testMailTo: params.testmail?.trim() });

  return (
    <BookingShell
      eyebrow="Beheer"
      title="Instellingen-check"
      intro={
        ready
          ? mode === "live"
            ? "Alles staat goed. Online boeken is actief."
            : "Alles staat goed. Zet NEXT_PUBLIC_BOOKING_MODE op live en deploy opnieuw om online boeken te activeren."
          : "Hieronder zie je per onderdeel of het in orde is, en wat je moet doen als het nog niet lukt."
      }
    >
      <div className="grid gap-10 lg:grid-cols-12">
        <ul className="bg-white px-6 py-2 shadow-[0_30px_60px_-45px_rgba(16,16,16,0.4)] sm:px-8 lg:col-span-7">
          {checks.map((c) => (
            <Row key={c.title} c={c} />
          ))}
        </ul>

        <div className="lg:col-span-5">
          <form method="get" className="bg-ink p-6 text-ivory sm:p-8">
            <h2 className="font-display text-[1.6rem] leading-tight">Testmail sturen</h2>
            <p className="mt-2 text-[0.9375rem] text-ivory/70">Stuur een testmail om te zien of e-mails aankomen.</p>
            <input type="hidden" name="sleutel" value={params.sleutel} />
            <label htmlFor="testmail" className="mt-6 block text-[0.875rem] font-semibold">
              Naar e-mailadres
            </label>
            <input
              id="testmail"
              name="testmail"
              type="email"
              required
              defaultValue={params.testmail ?? ""}
              className="mt-2 h-12 w-full border border-ivory/20 bg-ink-soft px-4 text-ivory outline-none focus:border-gold"
            />
            <button type="submit" className="btn btn-primary mt-5 w-full">
              Stuur testmail
            </button>
          </form>
          {testResult && (
            <ul className="mt-4 bg-white px-6 py-1" role="status">
              <Row c={testResult} />
            </ul>
          )}
        </div>
      </div>
    </BookingShell>
  );
}
