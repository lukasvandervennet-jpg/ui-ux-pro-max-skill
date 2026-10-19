import { ArrowDownRight, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { business } from "@/config/site";
import { photos } from "@/config/photos";
import { groupedHours } from "@/lib/hours";

type CSSVars = CSSProperties & Record<`--${string}`, string>;

function Line({ children, delay }: { children: ReactNode; delay: string }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <span className="intro-line block" style={{ "--d": delay } as CSSVars}>
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  const hours = groupedHours().filter((g) => !g.closed);

  return (
    <section id="top" aria-labelledby="hero-title" className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink">
      {/* Beeld: volledig scherm op mobiel, redactioneel paneel rechts op desktop */}
      <div className="intro-settle absolute inset-0 -z-10 lg:left-auto lg:w-[46%]">
        <Image
          src={photos.interior.src}
          alt={photos.interior.alt}
          preload
          fetchPriority="high"
          fill
          placeholder="blur"
          quality={85}
          sizes="(min-width: 1024px) 46vw, 100vw"
          className="object-cover object-[68%_40%]"
        />
        {/* Leesbaarheid */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/35 lg:hidden" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-ink via-ink/10 to-transparent lg:block" />
        <div className="absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-ink/90 to-transparent lg:block" />
      </div>

      <div className="container-luxe flex flex-1 flex-col justify-end pb-10 pt-32 lg:justify-center lg:pb-28 lg:pt-36">
        <div className="max-w-[46rem] lg:max-w-[52%]">
          <p className="intro-fade eyebrow flex items-center gap-3 text-gold" style={{ "--d": "0.1s" } as CSSVars}>
            <span aria-hidden="true" className="h-px w-10 bg-gold/70" />
            Barbershop · Sint-Martens-Latem
          </p>

          <h1 id="hero-title" className="display mt-7 text-[clamp(3rem,12vw,5.25rem)] text-ivory lg:text-[clamp(4.75rem,6.6vw,7rem)]">
            <Line delay="0.1s">The art of</Line>
            <Line delay="0.18s">
              a <em className="font-normal italic text-gold-light">perfect</em>
            </Line>
            <Line delay="0.26s">cut.</Line>
          </h1>

          <div className="intro-fade-up" style={{ "--d": "0.3s" } as CSSVars}>
            <p className="mt-7 font-display text-[1.6rem] italic leading-none text-ivory/90 sm:text-[1.9rem]">
              Precision. Style. Confidence.
            </p>
            <p className="mt-6 max-w-[30rem] text-[1.0625rem] leading-relaxed text-ivory/75">
              Ontdek La Moustache, waar vakmanschap en persoonlijke aandacht samenkomen in het hart van
              Sint-Martens-Latem.
            </p>

            <div className="mt-10 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
              <Link href="/#afspraak" className="btn btn-primary group">
                Maak een afspraak
                <ArrowRight
                  className="size-4 transition-transform duration-500 group-hover:translate-x-1"
                  aria-hidden="true"
                  strokeWidth={1.8}
                />
              </Link>
              <Link href="/#gallery" className="btn btn-ghost group">
                Ontdek ons werk
                <ArrowDownRight
                  className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                  aria-hidden="true"
                  strokeWidth={1.8}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Praktische regel onderaan — de essentie van een afsprakenkaartje */}
      <div className="intro-fade relative border-t border-ivory/10" style={{ "--d": "0.6s" } as CSSVars}>
        <dl className="container-luxe grid grid-cols-2 gap-x-6 gap-y-3 py-5 text-[0.8125rem] text-ivory/70 sm:grid-cols-3 lg:flex lg:items-center lg:gap-10">
          {hours.map((h) => (
            <div key={h.days} className="flex flex-col lg:flex-row lg:gap-3">
              <dt className="text-ivory/45">{h.days}</dt>
              <dd className="tabular-nums text-ivory/85">{h.range}</dd>
            </div>
          ))}
          <div className="col-span-2 self-end sm:col-span-1">
            <dt className="sr-only">Afspraken</dt>
            <dd className="flex items-center gap-2 text-ivory/85">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />
              Enkel op afspraak
            </dd>
          </div>
          <div className="hidden lg:ml-auto lg:block">
            <dt className="sr-only">Adres</dt>
            <dd>
              {business.address.streetShort}, {business.address.city}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
