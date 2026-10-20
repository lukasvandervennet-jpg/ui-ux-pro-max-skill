import { CalendarCheck, Phone } from "lucide-react";
import Link from "next/link";

import { BOOKING_PATH } from "@/config/booking";
import { business, openingHours } from "@/config/site";
import { formatRange } from "@/lib/hours";
import { links, onlineBooking } from "@/lib/links";
import { WhatsAppIcon } from "./icons";
import { MoustacheMark } from "./Logo";
import { LineReveal, Reveal } from "./motion";
import { TodayHighlight } from "./OpenStatus";

/** Ronde stempel "Enkel op afspraak" rond het beeldmerk. */
function Stamp({ className }: { className?: string }) {
  const text = "ENKEL OP AFSPRAAK · SINT-MARTENS-LATEM · ";
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="size-full animate-[spin_40s_linear_infinite] motion-reduce:animate-none">
        <defs>
          <path id="stamp-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-bronze font-sans text-[13.2px] font-semibold tracking-[0.2em]">
          <textPath href="#stamp-circle">{text}</textPath>
        </text>
      </svg>
      <MoustacheMark className="absolute left-1/2 top-1/2 w-[42%] -translate-x-1/2 -translate-y-1/2 text-bronze" />
    </div>
  );
}

export function Booking() {
  return (
    <section id="afspraak" aria-labelledby="booking-title" className="grain relative bg-graphite py-12 sm:py-24 lg:py-32">
      <div className="container-luxe">
        <Reveal className="on-light relative mx-auto max-w-6xl overflow-hidden bg-ivory text-ink shadow-[0_60px_120px_-60px_rgba(0,0,0,0.8)]">
          <div className="grid lg:grid-cols-[1.35fr_1fr]">
            {/* Linkerdeel: de oproep */}
            <div className="relative p-6 xs:p-8 sm:p-12 lg:p-16">
              <p className="eyebrow flex items-center gap-3 text-bronze">
                <span className="tabular-nums">06</span>
                <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
                Afspraak
              </p>
              <h2 id="booking-title" className="display mt-6 text-[clamp(2.6rem,5.2vw,4.25rem)] text-ink">
                <LineReveal>Your next cut</LineReveal>
                <LineReveal delay={0.08}>starts here.</LineReveal>
              </h2>
              <p className="mt-8 max-w-md text-[1.0625rem] leading-relaxed text-ink/75">
                {onlineBooking
                  ? "La Moustache werkt enkel op afspraak. Kies online een vrij moment en je krijgt meteen een bevestiging per e-mail. Liever persoonlijk? Stuur Aziz een berichtje of bel even."
                  : "La Moustache werkt enkel op afspraak. Stuur Aziz een berichtje via WhatsApp of bel even, en jullie spreken samen een moment af dat past."}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {onlineBooking ? (
                  <Link href={BOOKING_PATH} className="btn btn-dark">
                    <CalendarCheck className="size-4" aria-hidden="true" strokeWidth={1.6} />
                    Online afspraak maken
                  </Link>
                ) : (
                  business.bookingUrl && (
                    <a href={business.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
                      <CalendarCheck className="size-4" aria-hidden="true" strokeWidth={1.6} />
                      Online boeken
                    </a>
                  )
                )}
                <a
                  href={links.whatsapp()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={onlineBooking || business.bookingUrl ? "btn btn-outline-dark" : "btn btn-dark"}
                >
                  <WhatsAppIcon className="size-4" />
                  Afspraak via WhatsApp
                </a>
                <a href={links.tel} className="btn btn-outline-dark">
                  <Phone className="size-4" aria-hidden="true" strokeWidth={1.6} />
                  {business.phone.display}
                </a>
              </div>
              <p className="mt-5 text-[0.8125rem] text-stone">
                WhatsApp opent met een kant-en-klaar bericht. Je kan het nog aanpassen voor je verstuurt.
              </p>
            </div>

            {/* Rechterdeel: het afsprakenkaartje */}
            <div className="relative border-t border-dashed border-ink/20 bg-ivory-deep/60 p-6 xs:p-8 sm:p-12 lg:border-l lg:border-t-0 lg:p-14">
              {/* Perforatie-inkepingen */}
              <span aria-hidden="true" className="absolute -left-3 -top-3 hidden size-6 rounded-full bg-graphite lg:block" />
              <span aria-hidden="true" className="absolute -bottom-3 -left-3 hidden size-6 rounded-full bg-graphite lg:block" />

              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="whitespace-nowrap font-script text-[2.2rem] leading-none text-ink sm:text-[2.6rem]">La Moustache</p>
                  <p className="eyebrow mt-2 text-bronze">Openingsuren</p>
                </div>
                <Stamp className="relative -mr-2 -mt-2 size-20 shrink-0 xs:size-24 sm:size-28" />
              </div>

              <table className="mt-8 w-full text-[0.9375rem]">
                <caption className="sr-only">Openingsuren La Moustache</caption>
                <tbody>
                  {openingHours.map((d) => (
                    <TodayHighlight key={d.day} day={d.day} className="border-b border-ink/10 last:border-b-0">
                      <th scope="row" className="py-2 text-left font-normal sm:py-2.5">
                        {d.label}
                      </th>
                      <td className={`py-2 text-right tabular-nums sm:py-2.5 ${d.open ? "" : "text-stone"}`}>{formatRange(d)}</td>
                    </TodayHighlight>
                  ))}
                </tbody>
              </table>

              <address className="mt-8 border-t border-ink/15 pt-6 text-[0.9375rem] not-italic leading-relaxed text-ink/80">
                {business.address.street}
                <br />
                {business.address.postalCode} {business.address.city}
              </address>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
