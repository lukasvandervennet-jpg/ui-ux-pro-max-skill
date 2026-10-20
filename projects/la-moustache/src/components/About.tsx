import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { business, press } from "@/config/site";
import { photos } from "@/config/photos";
import { ImageReveal, Reveal } from "./motion";
import { SectionHeading } from "./SectionHeading";
import { SponsorBadge } from "./Sponsor";

const facts = [
  { value: String(business.founded), label: "Geopend in Latem" },
  { value: "Nº 45", label: "Maenhoutstraat" },
  { value: "Di–Za", label: "Enkel op afspraak" },
];

export function About() {
  return (
    <section id="over-ons" aria-labelledby="about-title" className="on-light relative bg-ivory py-16 text-ink sm:py-24 lg:py-36">
      <div className="container-luxe grid gap-10 lg:grid-cols-12 lg:gap-10">
        {/* Beeld: op mobiel onder de tekst */}
        <div className="order-2 lg:order-none lg:col-span-5 lg:self-start">
          <ImageReveal className="relative mx-auto aspect-square w-full max-w-[26rem] overflow-hidden rounded-[2px] bg-ivory-deep sm:aspect-[4/5] lg:mx-0">
            <Image
              src={photos.azizPortrait.src}
              alt={photos.azizPortrait.alt}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 26rem, 90vw"
              className="object-cover object-[60%_30%]"
            />
          </ImageReveal>
          <p className="mx-auto mt-4 flex max-w-[26rem] items-center gap-3 text-[0.8125rem] text-stone lg:mx-0">
            <span aria-hidden="true" className="h-px w-6 bg-bronze/60" />
            {business.owner}, oprichter
          </p>
        </div>

        {/* Verhaal */}
        <div className="order-1 lg:order-none lg:col-span-6 lg:col-start-7 lg:pt-6">
          <SectionHeading index="01" label="Over ons" title={["More than", "a haircut."]} tone="light" id="about-title" />

          <Reveal className="mt-8 max-w-[34rem] text-[1.0625rem] leading-[1.7] text-ink/80 sm:mt-10">
            <p>
              <span className="font-display text-[1.6rem] leading-none text-ink">La Moustache</span> is de barbershop van{" "}
              {business.owner}, sinds {business.founded} aan de {business.address.street} in {business.address.city}. Zijn
              eigen woorden zeggen het best:
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <figure className="mt-7 max-w-[34rem] border-l-2 border-bronze/50 pl-5 sm:pl-6">
              <blockquote className="font-display text-[1.6rem] italic leading-[1.25] text-ink sm:text-[1.9rem]">
                “Dromen beginnen klein, maar groeien met passie en doorzettingsvermogen. Vandaag sta ik hier, in mijn
                eigen barbershop…”
              </blockquote>
              <figcaption className="mt-3 text-[0.8125rem] text-stone">
                {business.owner} op Instagram, 3 april 2025
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.1}>
            <a
              href={press.nieuwsblad.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 block max-w-[34rem] border border-ink/15 p-5 transition-colors duration-500 hover:border-ink/40 sm:p-6"
            >
              <span className="eyebrow flex items-center justify-between gap-4 text-stone">
                In de pers · {press.nieuwsblad.outlet}, 21 februari 2025
                <ArrowUpRight
                  className="size-4 shrink-0 text-ink/40 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                  aria-hidden="true"
                  strokeWidth={1.6}
                />
              </span>
              <span className="mt-3 block font-display text-[1.35rem] leading-snug text-ink sm:text-[1.5rem]">
                {press.nieuwsblad.title}
              </span>
              <span className="mt-1 block font-display text-[1.2rem] italic leading-snug text-ink/70 sm:text-[1.3rem]">
                “{press.nieuwsblad.subtitle}”
              </span>
            </a>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 max-w-[34rem] text-[1.0625rem] leading-[1.7] text-ink/80">
            <p>
              Je komt er enkel op afspraak, van dinsdag tot zaterdag. Binnen wachten veel daglicht, groene fluwelen
              stoelen en het logo in neon op een muur van groen.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-8">
            <SponsorBadge />
          </Reveal>

          <dl className="mt-10 grid grid-cols-3 border-t border-ink/15 sm:mt-14">
            {facts.map((f, i) => (
              <Reveal
                key={f.value}
                delay={i * 0.08}
                className="border-r border-ink/15 px-3 py-5 first:pl-0 last:border-r-0 sm:px-6 sm:py-6"
              >
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="block font-display text-[1.9rem] font-medium leading-none text-ink sm:text-[2.6rem]">{f.value}</span>
                  <span className="mt-2 block text-[0.75rem] leading-snug text-stone sm:mt-3 sm:text-[0.8125rem]">{f.label}</span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
