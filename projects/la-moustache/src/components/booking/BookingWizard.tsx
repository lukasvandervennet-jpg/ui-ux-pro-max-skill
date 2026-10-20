"use client";

import { AlertCircle, ArrowLeft, ArrowRight, CalendarPlus, Check, Clock, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { buildIcs } from "@/lib/booking/ics";
import { bookableDays, type SlotRules } from "@/lib/booking/slots";
import { formatLongDate, formatTimeNl, weekdayOf } from "@/lib/booking/time";
import { cn } from "@/lib/cn";
import { WhatsAppIcon } from "../icons";

export type WizardService = { id: string; title: string; titleNl: string; duration: number };

type Props = {
  services: WizardService[];
  rules: SlotRules;
  demo: boolean;
  address: string;
  whatsappHref: string;
  phoneHref: string;
  phoneDisplay: string;
};

type Confirmed = { service: string; date: string; from: string; to: string; email: string; start: string; end: string };
type FieldErrors = Partial<Record<"service" | "date" | "time" | "name" | "email" | "phone" | "privacy", string>>;

const DAY_SHORT = ["zo", "ma", "di", "wo", "do", "vr", "za"];
const MONTH_SHORT = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

function Step({ n, title, done, children, id }: { n: number; title: string; done: boolean; children: React.ReactNode; id?: string }) {
  return (
    <section aria-labelledby={id} className="border-t border-ink/12 py-8 first:border-t-0 first:pt-0 sm:py-10">
      <h2 id={id} className="flex items-center gap-3 font-display text-[1.6rem] leading-none text-ink sm:text-[1.9rem]">
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex size-8 shrink-0 items-center justify-center rounded-full border font-sans text-[0.75rem] font-bold transition-colors",
            done ? "border-ink bg-ink text-ivory" : "border-ink/25 text-ink/60",
          )}
        >
          {done ? <Check className="size-4" strokeWidth={2.2} /> : n}
        </span>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function BookingWizard({ services, rules, demo, address, whatsappHref, phoneHref, phoneDisplay }: Props) {
  const uid = useId();
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [days, setDays] = useState<string[]>([]);
  const [slots, setSlots] = useState<string[] | null>(null);
  const [slotsState, setSlotsState] = useState<"idle" | "loading" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);
  const dayScroller = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  const service = services.find((s) => s.id === serviceId) ?? null;

  // Dagen pas in de browser berekenen: "vandaag" hangt af van het moment van bezoek.
  useEffect(() => {
    setDays(bookableDays(rules, new Date()));
    const pre = new URLSearchParams(window.location.search).get("dienst");
    if (pre && services.some((s) => s.id === pre)) setServiceId(pre);
  }, [rules, services]);

  const loadSlots = useCallback(async (d: string, s: string) => {
    setSlotsState("loading");
    setSlots(null);
    try {
      const res = await fetch(`/api/booking/slots?date=${d}&service=${encodeURIComponent(s)}`, { cache: "no-store" });
      const data = (await res.json()) as { slots?: string[]; error?: string };
      if (!res.ok || !data.slots) throw new Error(data.error);
      setSlots(data.slots);
      setSlotsState("idle");
    } catch {
      setSlotsState("error");
    }
  }, []);

  useEffect(() => {
    setTime(null);
    if (date && serviceId) void loadSlots(date, serviceId);
  }, [date, serviceId, loadSlots]);

  const scrollDays = (dir: number) => dayScroller.current?.scrollBy({ left: dir * 280, behavior: "smooth" });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const form = new FormData(e.currentTarget);
    setErrors({});
    setFormError(null);
    if (!serviceId || !date || !time) {
      setFormError("Kies eerst een dienst, een dag en een tijdstip.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          service: serviceId,
          date,
          time,
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          note: form.get("note"),
          privacy: form.get("privacy") === "on",
          reviewOptOut: form.get("reviewOptOut") === "on",
          website: form.get("website"),
        }),
      });
      const data = (await res.json()) as { booking?: Confirmed; error?: string; fields?: FieldErrors };
      if (res.ok && data.booking) {
        setConfirmed(data.booking);
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          resultRef.current?.focus({ preventScroll: true });
        });
        return;
      }
      if (res.status === 409) {
        setTime(null);
        void loadSlots(date, serviceId);
        timeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setErrors(data.fields ?? {});
      setFormError(data.error ?? "Er ging iets mis. Probeer het opnieuw.");
    } catch {
      setFormError("Geen verbinding. Controleer je internet en probeer opnieuw.");
    } finally {
      setSubmitting(false);
    }
  }

  const icsHref = useMemo(() => {
    if (!confirmed) return null;
    const ics = buildIcs({
      uid: `${confirmed.start}-${confirmed.email}`,
      start: new Date(confirmed.start),
      end: new Date(confirmed.end),
      summary: `${confirmed.service} bij La Moustache`,
      location: address,
      description: `Vragen of verhinderd? Bel ${phoneDisplay}.`,
    });
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
  }, [confirmed, address, phoneDisplay]);

  if (confirmed) {
    return (
      <div ref={resultRef} tabIndex={-1} className="mx-auto max-w-2xl outline-none" role="status" aria-live="polite">
        <div className="bg-white p-7 shadow-[0_40px_80px_-50px_rgba(16,16,16,0.45)] sm:p-12">
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-ink text-gold">
            <Check className="size-7" strokeWidth={2} aria-hidden="true" />
          </span>
          <h2 className="display mt-6 text-[clamp(2.3rem,6vw,3.6rem)] text-ink">Je afspraak staat vast.</h2>
          <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10 text-[1rem]">
            {[
              ["Dienst", confirmed.service],
              ["Datum", confirmed.date],
              ["Uur", `${confirmed.from} – ${confirmed.to}`],
              ["Adres", address],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 py-3.5">
                <dt className="text-stone">{k}</dt>
                <dd className="text-right font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-[0.975rem] leading-relaxed text-ink/75">
            {demo ? (
              <>
                <strong className="text-ink">Demo:</strong> er werd niets echt geboekt en geen e-mail verstuurd.
              </>
            ) : (
              <>
                We stuurden een bevestiging naar <strong className="text-ink">{confirmed.email}</strong>. Daarin vind je ook
                een link om te annuleren als je toch verhinderd bent.
              </>
            )}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {icsHref && (
              <a href={icsHref} download="afspraak-la-moustache.ics" className="btn btn-dark">
                <CalendarPlus className="size-4" aria-hidden="true" strokeWidth={1.6} />
                Zet in je agenda
              </a>
            )}
            <Link href="/" className="btn btn-outline-dark">
              Terug naar de website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const done = { service: !!service, date: !!date, time: !!time };

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <form onSubmit={submit} noValidate className="min-w-0 lg:col-span-8" aria-describedby={formError ? `${uid}-err` : undefined}>
        {/* 1. Dienst */}
        <Step n={1} title="Kies je dienst" done={done.service} id={`${uid}-s1`}>
          <fieldset className="min-w-0">
            <legend className="sr-only">Dienst</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {services.map((s) => (
                <label
                  key={s.id}
                  className={cn(
                    "group relative flex cursor-pointer items-center justify-between gap-4 border bg-white px-5 py-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-bronze",
                    serviceId === s.id ? "border-ink" : "border-ink/12 hover:border-ink/40",
                  )}
                >
                  <input
                    type="radio"
                    name="service"
                    value={s.id}
                    checked={serviceId === s.id}
                    onChange={() => setServiceId(s.id)}
                    className="sr-only"
                  />
                  <span>
                    <span className="block font-display text-[1.35rem] uppercase leading-tight text-ink">{s.title}</span>
                    <span className="mt-1 block text-[0.8125rem] text-stone">
                      {s.titleNl} · {s.duration} min
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "inline-flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                      serviceId === s.id ? "border-ink bg-ink text-ivory" : "border-ink/25",
                    )}
                  >
                    {serviceId === s.id && <Check className="size-3.5" strokeWidth={2.4} />}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </Step>

        {/* 2. Dag */}
        <Step n={2} title="Kies een dag" done={done.date} id={`${uid}-s2`}>
          <fieldset disabled={!service} className="min-w-0 disabled:opacity-45">
            <legend className="sr-only">Dag</legend>
            <div className="relative">
              <div ref={dayScroller} className="no-scrollbar relative -mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
                {days.length === 0 && <div className="h-[5.5rem] w-full animate-pulse bg-ink/5" aria-hidden="true" />}
                {days.map((d) => {
                  const [, m, day] = d.split("-").map(Number);
                  const selected = date === d;
                  return (
                    <label
                      key={d}
                      className={cn(
                        "relative flex w-[4.5rem] shrink-0 cursor-pointer snap-start flex-col items-center border py-3 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-bronze",
                        selected ? "border-ink bg-ink text-ivory" : "border-ink/12 bg-white text-ink hover:border-ink/40",
                      )}
                    >
                      <input
                        type="radio"
                        name="date"
                        value={d}
                        checked={selected}
                        onChange={() => setDate(d)}
                        className="sr-only"
                        aria-label={formatLongDate(d)}
                      />
                      <span className={cn("text-[0.6875rem] font-semibold uppercase tracking-[0.18em]", selected ? "text-gold" : "text-stone")}>
                        {DAY_SHORT[weekdayOf(d)]}
                      </span>
                      <span className="mt-1 font-display text-[1.7rem] leading-none">{day}</span>
                      <span className={cn("mt-1 text-[0.75rem]", selected ? "text-ivory/70" : "text-stone")}>{MONTH_SHORT[m - 1]}</span>
                    </label>
                  );
                })}
              </div>
              <div className="mt-3 hidden justify-end gap-2 sm:flex">
                <button type="button" onClick={() => scrollDays(-1)} className="inline-flex size-10 items-center justify-center rounded-full border border-ink/15 text-ink hover:border-ink" aria-label="Vorige dagen">
                  <ArrowLeft className="size-4" strokeWidth={1.6} />
                </button>
                <button type="button" onClick={() => scrollDays(1)} className="inline-flex size-10 items-center justify-center rounded-full border border-ink/15 text-ink hover:border-ink" aria-label="Volgende dagen">
                  <ArrowRight className="size-4" strokeWidth={1.6} />
                </button>
              </div>
            </div>
            {!service && <p className="mt-3 text-[0.875rem] text-stone">Kies eerst een dienst.</p>}
          </fieldset>
        </Step>

        {/* 3. Tijd */}
        <Step n={3} title="Kies een tijdstip" done={done.time} id={`${uid}-s3`}>
          <div ref={timeRef} aria-live="polite">
            {!date && <p className="text-[0.875rem] text-stone">Kies eerst een dag.</p>}
            {date && slotsState === "loading" && (
              <div className="grid grid-cols-3 gap-2 xs:grid-cols-4 sm:grid-cols-6" aria-label="Vrije momenten laden">
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="h-12 animate-pulse bg-ink/[0.06]" />
                ))}
              </div>
            )}
            {date && slotsState === "error" && (
              <p className="flex items-start gap-2 text-[0.9375rem] text-ink">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-bronze" aria-hidden="true" />
                <span>
                  De vrije momenten konden niet geladen worden.{" "}
                  <button type="button" className="underline underline-offset-4" onClick={() => serviceId && loadSlots(date, serviceId)}>
                    Probeer opnieuw
                  </button>
                </span>
              </p>
            )}
            {date && slotsState === "idle" && slots && slots.length === 0 && (
              <p className="text-[0.9375rem] leading-relaxed text-ink/75">
                Op {formatLongDate(date)} is er geen vrij moment meer. Kies een andere dag of{" "}
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  stuur een WhatsApp
                </a>
                .
              </p>
            )}
            {date && slotsState === "idle" && slots && slots.length > 0 && (
              <fieldset className="min-w-0">
                <legend className="mb-4 text-[0.875rem] text-stone first-letter:uppercase">{formatLongDate(date)}</legend>
                <div className="grid grid-cols-3 gap-2 xs:grid-cols-4 sm:grid-cols-6">
                  {slots.map((t) => (
                    <label
                      key={t}
                      className={cn(
                        "relative flex h-12 cursor-pointer items-center justify-center border text-[0.9375rem] font-semibold tabular-nums transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-bronze",
                        time === t ? "border-ink bg-ink text-ivory" : "border-ink/12 bg-white text-ink hover:border-ink/40",
                      )}
                    >
                      <input type="radio" name="time" value={t} checked={time === t} onChange={() => setTime(t)} className="sr-only" />
                      {formatTimeNl(t)}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
          </div>
        </Step>

        {/* 4. Gegevens */}
        <Step n={4} title="Jouw gegevens" done={false} id={`${uid}-s4`}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Naam" name="name" autoComplete="name" error={errors.name} className="sm:col-span-2" />
            <Field label="E-mail" name="email" type="email" autoComplete="email" inputMode="email" error={errors.email} hint="Hier komt je bevestiging." />
            <Field label="Telefoon" name="phone" type="tel" autoComplete="tel" inputMode="tel" error={errors.phone} hint="Voor als er iets verandert." />
            <div className="sm:col-span-2">
              <label htmlFor={`${uid}-note`} className="text-[0.875rem] font-semibold text-ink">
                Opmerking <span className="font-normal text-stone">(optioneel)</span>
              </label>
              <textarea
                id={`${uid}-note`}
                name="note"
                rows={3}
                maxLength={500}
                className="mt-2 w-full resize-y border border-ink/15 bg-white px-4 py-3 text-[1rem] text-ink outline-none transition-colors focus:border-ink"
              />
            </div>
          </div>

          {/* Honeypot tegen spam: onzichtbaar voor mensen */}
          <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
            <label>
              Website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="mt-6 space-y-3">
            <label className="flex cursor-pointer items-start gap-3 text-[0.9375rem] leading-snug text-ink/80">
              <input
                type="checkbox"
                name="privacy"
                aria-invalid={!!errors.privacy}
                aria-describedby={errors.privacy ? `${uid}-privacy-err` : undefined}
                className="lm-check mt-0.5"
              />
              <span>
                Ik ga akkoord met de{" "}
                <Link href="/privacy" target="_blank" className="underline underline-offset-4">
                  privacyverklaring
                </Link>
                .
              </span>
            </label>
            {errors.privacy && (
              <p id={`${uid}-privacy-err`} className="pl-8 text-[0.8125rem] text-[#9b2c1f]">
                {errors.privacy}
              </p>
            )}
            <label className="flex cursor-pointer items-start gap-3 text-[0.9375rem] leading-snug text-ink/80">
              <input type="checkbox" name="reviewOptOut" className="lm-check mt-0.5" />
              <span>
                Liever geen bedankmail na mijn afspraak.{" "}
                <span className="text-stone">Normaal sturen we er één, met de vraag om een review.</span>
              </span>
            </label>
          </div>

          {formError && (
            <p id={`${uid}-err`} role="alert" className="mt-6 flex items-start gap-2 border-l-2 border-[#9b2c1f] bg-[#9b2c1f]/[0.06] px-4 py-3 text-[0.9375rem] text-ink">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-[#9b2c1f]" aria-hidden="true" />
              {formError}
            </p>
          )}

          <button type="submit" disabled={submitting} className="btn btn-dark mt-8 w-full disabled:opacity-60 sm:w-auto">
            {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Check className="size-4" aria-hidden="true" />}
            {submitting ? "Bezig met boeken…" : "Afspraak bevestigen"}
          </button>
        </Step>
      </form>

      {/* Samenvatting */}
      <aside className="min-w-0 lg:col-span-4" aria-label="Jouw afspraak">
        <div className="bg-ink p-7 text-ivory lg:sticky lg:top-28">
          <p className="eyebrow text-gold">Jouw afspraak</p>
          <dl className="mt-5 space-y-4 text-[0.9375rem]">
            <div>
              <dt className="text-ivory/50">Dienst</dt>
              <dd className="mt-1 font-display text-[1.4rem] leading-tight">{service ? service.titleNl : "—"}</dd>
            </div>
            <div>
              <dt className="text-ivory/50">Dag</dt>
              <dd className="mt-1">{date ? formatLongDate(date) : "—"}</dd>
            </div>
            <div>
              <dt className="sr-only">Uur</dt>
              <dd className="flex items-center gap-2">
                <Clock className="size-4 text-gold" aria-hidden="true" strokeWidth={1.6} />
                {time && service ? `${formatTimeNl(time)} · ${service.duration} min` : "Nog geen tijdstip"}
              </dd>
            </div>
            <div>
              <dt className="sr-only">Adres</dt>
              <dd className="flex items-start gap-2 text-ivory/70">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" strokeWidth={1.6} />
                {address}
              </dd>
            </div>
          </dl>
          <div className="mt-7 border-t border-ivory/10 pt-6 text-[0.875rem] text-ivory/65">
            Liever persoonlijk contact?
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !min-h-11 !px-4 !text-[0.625rem]">
                <WhatsAppIcon className="size-4" />
                WhatsApp
              </a>
              <a href={phoneHref} className="btn btn-ghost !min-h-11 !px-4 !text-[0.625rem]">
                Bel {phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  name,
  error,
  hint,
  className,
  ...input
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const describedBy = [error ? `${id}-err` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="text-[0.875rem] font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        name={name}
        required
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={cn(
          "mt-2 h-12 w-full border bg-white px-4 text-[1rem] text-ink outline-none transition-colors focus:border-ink",
          error ? "border-[#9b2c1f]" : "border-ink/15",
        )}
        {...input}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[0.8125rem] text-stone">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-[0.8125rem] text-[#9b2c1f]">
          {error}
        </p>
      )}
    </div>
  );
}
