import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { business, press } from "@/config/site";
import { photos } from "@/config/photos";
import { ImageReveal, Reveal } from "./motion";
import { SectionHeading } from "./SectionHeading";

const facts = [
  { value: String(business.founded), label: "Geopend in Sint-Martens-Latem" },
  { value: "Nº 45", label: "K. L. Maenhoutstraat" },
  { value: "1 op 1", label: "Enkel op afspraak, nooit aan de lopende band" },
];

export function About() {
  return (
    <section id="over-ons" aria-labelledby="about-title" className="on-light relative bg-ivory py-24 text-ink sm:py-32 lg:py-44">
      <div className="container-luxe grid gap-16 lg:grid-cols-12 lg:gap-10">
        {/* Beeld */}
        <div className="lg:col-span-5 lg:self-start">
          <div className="relative mx-auto w-full max-w-[26rem] lg:mx-0">
            <ImageReveal className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-ivory-deep">
              <Image
                src={photos.capCut.src}
                alt={photos.capCut.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 26rem, 90vw"
                className="object-cover"
              />
            </ImageReveal>
            <Reveal
              delay={0.2}
              className="absolute -bottom-12 -right-4 hidden w-[42%] border-[6px] border-ivory shadow-[0_30px_60px_-30px_rgba(16,16,16,0.45)] sm:block lg:-right-16"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={photos.shelfDetail.src}
                  alt={photos.shelfDetail.alt}
                  fill
                  placeholder="blur"
                  sizes="12rem"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
          <p className="mt-5 flex items-center gap-3 text-[0.8125rem] text-stone">
            <span aria-hidden="true" className="h-px w-6 bg-bronze/60" />
            {business.owner}, oprichter
          </p>
        </div>

        {/* Verhaal */}
        <div className="lg:col-span-6 lg:col-start-7 lg:pt-6">
          <SectionHeading index="01" label="Over ons" title={["More than", "a haircut."]} tone="light" id="about-title" />

          <Reveal className="mt-10 max-w-[34rem] space-y-6 text-[1.0625rem] leading-[1.75] text-ink/80">
            <p>
              <span className="font-display text-[1.6rem] leading-none text-ink">La Moustache</span> is de zaak van{" "}
              {business.owner}. Het idee voor een eigen barbershop ontstond ver van huis, op een tuktuk in Thailand. In{" "}
              {business.founded} werd die droom werkelijkheid, hier in Sint-Martens-Latem.
            </p>
            <p>
              Wat je in de stoel merkt, is de rust. Omdat La Moustache enkel op afspraak werkt, is er tijd: om te
              luisteren naar wat je wil, om je haar te lezen, en om af te werken tot elke lijn klopt. Van een vloeiende
              fade tot krullen die eindelijk doen wat ze moeten doen.
            </p>
            <p>
              Geen haast, geen standaardwerk. Gewoon een barber die zijn vak serieus neemt, in een lichte zaak waar je
              graag even blijft zitten.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <a
              href={press.nieuwsblad.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 inline-flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-ink/20 pb-1 text-sm font-medium text-ink transition-colors hover:border-ink"
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

          <dl className="mt-16 grid grid-cols-1 border-t border-ink/15 sm:grid-cols-3">
            {facts.map((f, i) => (
              <Reveal
                key={f.value}
                delay={i * 0.08}
                className="border-b border-ink/15 py-6 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0"
              >
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="block font-display text-[2.6rem] font-medium leading-none text-ink">{f.value}</span>
                  <span className="mt-3 block text-[0.8125rem] leading-snug text-stone">{f.label}</span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
