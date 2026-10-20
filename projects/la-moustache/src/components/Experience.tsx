import Image from "next/image";

import { photos } from "@/config/photos";
import { ImageReveal, Reveal, RevealItem } from "./motion";
import { SectionHeading } from "./SectionHeading";

/** Vier dingen die je ziet als je binnenstapt — allemaal te zien op de foto's van de zaak. */
const pillars = [
  { title: "Daglicht", text: "Een groot raam laat het licht binnen, tot aan de wasstoelen." },
  { title: "Op afspraak", text: "Geen wachtrij: je komt op een vast moment, van dinsdag tot zaterdag." },
  { title: "De neonmuur", text: "Een muur van groen met het La Moustache-logo in neon." },
  { title: "STMNT", text: "Gesponsord door STMNT Grooming Goods, met hun producten in de rekken." },
];

export function Experience() {
  return (
    <section id="ervaring" aria-labelledby="experience-title" className="on-light relative bg-ivory-deep py-16 text-ink sm:py-24 lg:py-36">
      <div className="container-luxe grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
          <SectionHeading
            index="05"
            label="De ervaring"
            title={["Take a seat.", "Leave sharp."]}
            tone="light"
            size="md"
            id="experience-title"
          />
          <Reveal className="mt-6 max-w-lg sm:mt-8">
            <p className="font-display text-[1.45rem] italic leading-snug text-ink sm:text-[1.7rem]">
              “A fresh cut is more than just a look — it’s a feeling. Step in, step out, feeling like a king.”
            </p>
            <p className="mt-3 text-[0.8125rem] not-italic text-stone">La Moustache op Instagram, 27 februari 2025</p>
          </Reveal>

          <ol className="mt-8 hidden grid-cols-2 gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:mt-10 lg:grid">
            {pillars.map((p, i) => (
              <Pillar key={p.title} index={i} {...p} />
            ))}
          </ol>
        </div>

        <ImageReveal className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[5/4] lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:aspect-[4/5]">
          <Image
            src={photos.neon.src}
            alt={photos.neon.alt}
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover object-[35%_50%]"
          />
        </ImageReveal>

        {/* Op mobiel staan de vier punten onder de foto */}
        <ol className="grid grid-cols-2 gap-px overflow-hidden border border-ink/10 bg-ink/10 lg:hidden">
          {pillars.map((p, i) => (
            <Pillar key={p.title} index={i} {...p} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Pillar({ index, title, text }: { index: number; title: string; text: string }) {
  return (
    <RevealItem delay={index * 0.06} className="bg-ivory-deep p-4 xs:p-5 sm:p-8">
      <span className="font-display text-base tabular-nums text-bronze sm:text-lg">0{index + 1}</span>
      <h3 className="mt-2 font-display text-[1.3rem] font-medium leading-tight text-ink sm:mt-4 sm:text-[1.75rem]">
        {title}
      </h3>
      <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink/65 sm:mt-3 sm:text-[0.9375rem]">{text}</p>
    </RevealItem>
  );
}
