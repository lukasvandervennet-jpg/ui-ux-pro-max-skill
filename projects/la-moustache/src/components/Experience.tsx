import Image from "next/image";

import { photos } from "@/config/photos";
import { Reveal, RevealItem } from "./motion";
import { SectionHeading } from "./SectionHeading";

const pillars = [
  {
    title: "Rust",
    text: "Een lichte zaak met een groot raam, zachte fauteuils en groen. Geen drukte, geen wachtrij.",
  },
  {
    title: "Persoonlijke aandacht",
    text: "Enkel op afspraak, dus dit moment is van jou. Eerst praten, dan pas knippen.",
  },
  {
    title: "Precisie",
    text: "Overgangen, lijnen en contouren — tot in het kleinste detail uitgewerkt.",
  },
  {
    title: "Afwerking",
    text: "Gestyled en verzorgd. Je stapt pas buiten wanneer alles klopt.",
  },
];

export function Experience() {
  return (
    <section id="ervaring" aria-labelledby="experience-title" className="relative overflow-hidden bg-ink">
      <div className="grid lg:grid-cols-[5fr_7fr]">
        <div className="relative min-h-[70svh] lg:min-h-0">
          <Image
            src={photos.interiorWindow.src}
            alt={photos.interiorWindow.alt}
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ink/70" />
          <p className="absolute bottom-6 left-5 text-[0.8125rem] text-ivory/70 sm:left-10 lg:bottom-10 lg:left-10">
            La Moustache · Sint-Martens-Latem
          </p>
        </div>

        <div className="grain relative flex items-center py-24 sm:py-32 lg:py-36">
          <div className="w-full px-5 sm:px-10 lg:px-14 xl:px-20">
            <SectionHeading index="05" label="De ervaring" title={["Take a seat.", "Leave sharp."]} id="experience-title" />
            <Reveal className="mt-8 max-w-md text-[1.0625rem] leading-relaxed text-ivory/70">
              Een bezoek aan La Moustache is tijd voor jezelf. Je wordt ontvangen, er wordt geluisterd en er
              wordt met aandacht gewerkt — in een sfeer die eerder aanvoelt als een woonkamer dan als een zaak.
            </Reveal>

            <ol className="mt-14 grid gap-px overflow-hidden border border-ivory/10 bg-ivory/10 sm:grid-cols-2">
              {pillars.map((p, i) => (
                <RevealItem key={p.title} delay={i * 0.06} className="bg-ink p-7">
                  <span className="font-display text-lg tabular-nums text-gold">0{i + 1}</span>
                  <h3 className="mt-4 font-display text-[1.75rem] font-medium leading-tight text-ivory">{p.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-ivory/60">{p.text}</p>
                </RevealItem>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
