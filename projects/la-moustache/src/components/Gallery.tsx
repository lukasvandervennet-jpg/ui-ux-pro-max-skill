"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { gallery } from "@/config/photos";
import { social } from "@/config/site";
import { InstagramIcon } from "./icons";
import { Lightbox } from "./Lightbox";
import { Reveal } from "./motion";
import { SectionHeading } from "./SectionHeading";

/**
 * Compact raster: twee kolommen op mobiel, drie op desktop (foto's + Instagram-tegel).
 * Volgorde = config/photos.ts. Bij meer foto's loopt het raster gewoon door.
 */
export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="on-light relative bg-ivory py-16 text-ink sm:py-24 lg:py-36">
      <div className="container-luxe">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <SectionHeading index="03" label="Gallery" title={["Our", "work."]} tone="light" className="lg:col-span-7" id="gallery-title" />
          <Reveal className="max-w-md text-[1.0625rem] leading-relaxed text-ink/70 lg:col-span-5 lg:justify-self-end">
            Fades, krullen en styling, rechtstreeks uit de stoel bij La Moustache. Alle foto's komen van het eigen
            Instagramaccount. Klik op een beeld om het groter te bekijken.
          </Reveal>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-16 lg:grid-cols-3">
          {gallery.map((photo, i) => (
            <li key={photo.caption} className="relative aspect-[4/5]">
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
                    sizes="(min-width: 1024px) 32vw, 50vw"
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
          <li className="relative aspect-[4/5]">
            <Reveal className="h-full">
              <a
                href={social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex size-full flex-col justify-between bg-ink p-5 text-ivory transition-colors duration-700 hover:bg-graphite sm:p-8"
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
                  <span className="display block text-[1.3rem] xs:text-[1.4rem] sm:text-[clamp(1.5rem,2.4vw,2.1rem)]">More on Instagram</span>
                  <span className="mt-2 block text-[0.6875rem] text-ivory/60 sm:text-[0.8125rem]">{social.instagram.handle}</span>
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
