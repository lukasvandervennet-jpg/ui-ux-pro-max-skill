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
    title: "Aandacht",
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
    <section id="ervaring" aria-labelledby="experience-title" className="on-light relative bg-ivory-deep py-16 text-ink sm:py-24 lg:py-36">
      <div className="container-luxe grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="lg:col-span-5">
          <SectionHeading
            index="05"
            label="De ervaring"
            title={["Take a seat.", "Leave sharp."]}
            tone="light"
            size="md"
            id="experience-title"
          />
          <Reveal className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-ink/75 sm:mt-8">
            Een bezoek aan La Moustache is tijd voor jezelf. Je wordt ontvangen, er wordt geluisterd en er wordt met
            aandacht gewerkt, in een sfeer die eerder aanvoelt als een woonkamer dan als een zaak.
          </Reveal>
          <Reveal className="mt-8 hidden lg:block">
            <figure>
              <div className="relative aspect-[3/1] w-full max-w-md overflow-hidden">
                <Image
                  src={photos.products.src}
                  alt={photos.products.alt}
                  fill
                  placeholder="blur"
                  sizes="28rem"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-[0.8125rem] text-stone">{photos.products.caption}</figcaption>
            </figure>
          </Reveal>
        </div>

        <ol className="grid grid-cols-2 gap-px overflow-hidden border border-ink/10 bg-ink/10 lg:col-span-7">
          {pillars.map((p, i) => (
            <RevealItem key={p.title} delay={i * 0.06} className="bg-ivory-deep p-4 xs:p-5 sm:p-8">
              <span className="font-display text-base tabular-nums text-bronze sm:text-lg">0{i + 1}</span>
              <h3 className="mt-2 font-display text-[1.3rem] font-medium leading-tight text-ink sm:mt-4 sm:text-[1.75rem]">
                {p.title}
              </h3>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink/65 sm:mt-3 sm:text-[0.9375rem]">{p.text}</p>
            </RevealItem>
          ))}
        </ol>
      </div>
    </section>
  );
}
