"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { gallery } from "@/config/photos";
import { social } from "@/config/site";
import { cn } from "@/lib/cn";
import { InstagramIcon } from "./icons";
import { Lightbox } from "./Lightbox";
import { Reveal } from "./motion";
import { SectionHeading } from "./SectionHeading";

/**
 * Redactioneel raster. Op mobiel: natuurlijke verhoudingen in twee kolommen.
 * Op desktop: vaste plaatsing in 12 kolommen. Volgorde = config/photos.ts.
 */
const cells = [
  "col-span-2 aspect-[4/5] lg:col-span-5 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:aspect-auto",
  "aspect-[4/5] lg:col-span-4 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:aspect-auto",
  "aspect-[4/5] lg:col-span-3 lg:col-start-10 lg:row-span-2 lg:row-start-1 lg:aspect-auto",
  "aspect-[3/4] lg:col-span-3 lg:col-start-6 lg:row-span-2 lg:row-start-3 lg:aspect-auto",
  "aspect-[3/4] lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-3 lg:aspect-auto",
];

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="on-light relative bg-ivory py-24 text-ink sm:py-32 lg:py-44">
      <div className="container-luxe">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading index="03" label="Gallery" title={["Our", "work."]} tone="light" className="lg:col-span-7" id="gallery-title" />
          <Reveal className="max-w-md text-[1.0625rem] leading-relaxed text-ink/70 lg:col-span-5 lg:justify-self-end">
            Fades, krullen, klassieke snitten en styling — rechtstreeks uit de stoel bij La Moustache. Klik op een
            beeld om het groter te bekijken.
          </Reveal>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-20 lg:grid-cols-12 lg:grid-rows-[repeat(4,minmax(0,13.5rem))] xl:grid-rows-[repeat(4,minmax(0,15rem))]">
          {gallery.map((photo, i) => (
            <li key={photo.caption} className={cn("relative", cells[i] ?? "aspect-[4/5] lg:col-span-4")}>
              <Reveal delay={(i % 3) * 0.08} className="h-full">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className="group relative block size-full overflow-hidden bg-ivory-deep text-left"
                  aria-label={`Bekijk foto: ${photo.caption}`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    placeholder="blur"
                    sizes={i === 0 ? "(min-width: 1024px) 42vw, 100vw" : "(min-width: 1024px) 34vw, 50vw"}
                    className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100" />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-ivory opacity-0 transition-all duration-700 group-hover:opacity-100 group-focus-visible:opacity-100 sm:p-5">
                    <span className="text-sm font-medium">{photo.caption}</span>
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-ivory/40">
                      <Plus className="size-4" aria-hidden="true" strokeWidth={1.6} />
                    </span>
                  </span>
                </button>
              </Reveal>
            </li>
          ))}

          {/* Instagram-tegel */}
          <li className="col-span-2 lg:col-span-5 lg:col-start-1 lg:row-start-4">
            <Reveal className="h-full">
              <a
                href={social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex size-full min-h-56 flex-col justify-between bg-ink p-7 text-ivory transition-colors duration-700 hover:bg-graphite sm:p-9"
              >
                <span className="flex items-center justify-between">
                  <InstagramIcon className="size-6 text-gold" />
                  <ArrowUpRight
                    className="size-6 text-ivory/60 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ivory"
                    aria-hidden="true"
                    strokeWidth={1.4}
                  />
                </span>
                <span>
                  <span className="display block text-[clamp(2rem,3.4vw,2.9rem)]">More on Instagram</span>
                  <span className="mt-2 block text-sm text-ivory/60">{social.instagram.handle}</span>
                </span>
              </a>
            </Reveal>
          </li>
        </ul>
      </div>

      <Lightbox photos={gallery} index={index} onIndexChange={setIndex} />
    </section>
  );
}
