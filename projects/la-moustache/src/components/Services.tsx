import { ArrowUpRight } from "lucide-react";

import { business, services } from "@/config/site";
import { bookingHref, links, onlineBooking, serviceMessage } from "@/lib/links";
import { Reveal, RevealItem } from "./motion";
import { SectionHeading } from "./SectionHeading";

const priceLabel = (price: number | null, duration: number | null) => {
  const parts: string[] = [];
  if (price !== null) parts.push(`€ ${price}`);
  if (duration !== null) parts.push(`${duration} min`);
  return parts.length ? parts.join(" · ") : "Tarief op aanvraag";
};

export function Services() {
  const visible = services.filter((s) => s.published);

  return (
    <section id="services" aria-labelledby="services-title" className="grain relative bg-ink py-16 sm:py-24 lg:py-36">
      <div className="container-luxe">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <SectionHeading index="02" label="Services" title={["The", "services."]} className="lg:col-span-7" id="services-title" />
          <Reveal className="max-w-md text-[1.0625rem] leading-relaxed text-ivory/70 lg:col-span-5 lg:justify-self-end">
            Van een strakke fade tot krullen in vorm: dit is het werk dat je terugziet op Instagram. Kies wat je
            zoekt en stuur Aziz meteen een bericht voor een afspraak.
          </Reveal>
        </div>

        <ol className="mt-10 border-t border-ivory/12 lg:mt-24">
          {visible.map((s, i) => {
            const href = bookingHref(s.id) ?? links.whatsapp(serviceMessage(s.titleNl));
            const external = !onlineBooking;
            return (
              <RevealItem
                key={s.id}
                delay={i * 0.05}
                className="group relative grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-3 border-b border-ivory/12 py-6 transition-colors duration-500 hover:bg-ivory/[0.025] sm:grid-cols-[4rem_1fr] lg:grid-cols-[5rem_minmax(0,1.1fr)_minmax(0,1fr)_auto] lg:items-center lg:gap-x-10 lg:py-11"
              >
                  <span className="pt-2 font-display text-lg tabular-nums text-ivory/40 transition-colors duration-500 group-hover:text-gold lg:pt-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3 className="display text-[clamp(1.5rem,3.2vw,2.5rem)] text-ivory">{s.title}</h3>
                    <p className="eyebrow mt-2 text-gold/90 sm:mt-3">{s.titleNl}</p>
                  </div>

                  <p className="col-start-2 max-w-md text-[0.975rem] leading-relaxed text-ivory/65 lg:col-start-3">
                    {s.description}
                  </p>

                  <div className="col-start-2 flex flex-wrap items-center gap-x-6 gap-y-3 lg:col-start-4 lg:flex-col lg:items-end">
                    <span className="text-[0.8125rem] text-ivory/50">{priceLabel(s.price, s.duration)}</span>
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ivory/20 px-5 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ivory transition-colors duration-500 hover:border-gold hover:bg-gold hover:text-ink"
                      aria-label={`Afspraak maken voor ${s.titleNl}${onlineBooking ? "" : business.bookingUrl ? " (online boeken)" : " (opent WhatsApp)"}`}
                    >
                      Afspraak
                      <ArrowUpRight className="size-4" aria-hidden="true" strokeWidth={1.8} />
                    </a>
                  </div>
              </RevealItem>
            );
          })}
        </ol>

        <Reveal className="mt-8 flex flex-col gap-2 text-sm text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>Twijfel je wat je nodig hebt? Stel je vraag via WhatsApp of bel even.</p>
          <a href={links.tel} className="link-underline self-start text-ivory/80 sm:self-auto">
            Bel {business.phone.local}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
