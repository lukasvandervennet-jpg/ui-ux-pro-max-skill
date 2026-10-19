import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { business, press } from "@/config/site";
import { photos } from "@/config/photos";
import { ImageReveal, Reveal } from "./motion";
import { SectionHeading } from "./SectionHeading";

const facts = [
  { value: String(business.founded), label: "Geopend in Latem" },
  { value: "Nº 45", label: "Maenhoutstraat" },
  { value: "1 op 1", label: "Enkel op afspraak" },
];

export function About() {
  return (
    <section id="over-ons" aria-labelledby="about-title" className="on-light relative bg-ivory py-16 text-ink sm:py-24 lg:py-36">
      <div className="container-luxe grid gap-10 lg:grid-cols-12 lg:gap-10">
        {/* Beeld: op mobiel onder de tekst */}
        <div className="order-2 lg:order-none lg:col-span-5 lg:self-start">
          <ImageReveal className="relative mx-auto aspect-square w-full max-w-[26rem] overflow-hidden rounded-[2px] bg-ivory-deep sm:aspect-[4/5] lg:mx-0">
            <Image
              src={photos.capCut.src}
              alt={photos.capCut.alt}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 26rem, 90vw"
              className="object-cover object-top"
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

          <Reveal className="mt-8 max-w-[34rem] space-y-5 text-[1.0625rem] leading-[1.7] text-ink/80 sm:mt-10">
            <p>
              <span className="font-display text-[1.6rem] leading-none text-ink">La Moustache</span> is de zaak van{" "}
              {business.owner}. Het idee voor een eigen barbershop ontstond ver van huis, op een tuktuk in Thailand. In{" "}
              {business.founded} werd die droom werkelijkheid, hier in Sint-Martens-Latem.
            </p>
            <p>
              Omdat La Moustache enkel op afspraak werkt, is er tijd: om te luisteren, je haar te lezen en af te werken
              tot elke lijn klopt. Geen haast, geen standaardwerk — van een vloeiende fade tot krullen die eindelijk doen
              wat ze moeten doen.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <a
              href={press.nieuwsblad.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-ink/20 pb-1 text-sm font-medium text-ink transition-colors hover:border-ink"
            >
              Lees het verhaal in {press.nieuwsblad.outlet}
              <span className="text-stone">· 21 februari 2025</span>
              <ArrowUpRight
                className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
                strokeWidth={1.6}
              />
            </a>
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
