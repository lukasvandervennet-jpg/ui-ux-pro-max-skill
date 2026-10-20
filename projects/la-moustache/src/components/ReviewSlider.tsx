"use client";

import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useRef } from "react";

import type { Review } from "@/config/site";
import { links } from "@/lib/links";
import { GoogleIcon } from "./icons";
import { Reveal } from "./motion";

export function ReviewSlider({ reviews }: { reviews: Review[] }) {
  const track = useRef<HTMLUListElement>(null);

  const scroll = (dir: number) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 320) + 16), behavior: "smooth" });
  };

  return (
    <Reveal className="mt-16 lg:mt-24">
      <ul
        ref={track}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 sm:-mx-10 sm:px-10 xl:-mx-16 xl:px-16"
        aria-label="Google reviews"
      >
        {reviews.map((r, i) => (
          <li
            key={i}
            className="flex w-[85%] shrink-0 snap-start flex-col justify-between border border-ivory/12 bg-ivory/[0.02] p-8 sm:w-[60%] lg:w-[calc((100%-2rem)/3)]"
          >
            <figure>
              {r.rating !== null && (
                <div className="flex gap-1 text-gold" aria-label={`${r.rating} op 5 sterren`} role="img">
                  {Array.from({ length: 5 }, (_, s) => (
                    <Star
                      key={s}
                      className="size-4"
                      strokeWidth={1.2}
                      fill={s < (r.rating ?? 0) ? "currentColor" : "none"}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              )}
              <blockquote className="mt-6 font-display text-[1.6rem] leading-snug text-ivory">“{r.text}”</blockquote>
              <figcaption className="mt-8 flex items-center justify-between text-sm">
                <span className="font-medium text-ivory/85">{r.author}</span>
                <span className="inline-flex items-center gap-2 text-ivory/50">
                  <GoogleIcon className="size-3.5" />
                  Google{r.date ? ` · ${r.date}` : ""}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between gap-4">
        <a href={links.googleReviews} target="_blank" rel="noopener noreferrer" className="link-underline text-sm text-ivory/80">
          Alle reviews op Google
        </a>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="inline-flex size-12 items-center justify-center rounded-full border border-ivory/20 transition-colors hover:border-gold hover:text-gold"
            aria-label="Vorige review"
          >
            <ArrowLeft className="size-4" strokeWidth={1.6} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="inline-flex size-12 items-center justify-center rounded-full border border-ivory/20 transition-colors hover:border-gold hover:text-gold"
            aria-label="Volgende review"
          >
            <ArrowRight className="size-4" strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </Reveal>
  );
}
