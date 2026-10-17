import { ArrowUpRight } from "lucide-react";

import { reviewSummary, reviews } from "@/config/site";
import { links } from "@/lib/links";
import { GoogleIcon } from "./icons";
import { MoustacheMark } from "./Logo";
import { Reveal } from "./motion";
import { ReviewSlider } from "./ReviewSlider";
import { SectionHeading } from "./SectionHeading";

/**
 * Toont uitsluitend reviews met `verified: true` uit config/site.ts.
 * Zolang er geen geverifieerde reviews zijn, verwijst de sectie naar Google.
 */
export function Reviews() {
  const verified = reviews.filter((r) => r.verified && r.author);
  const hasSummary = reviewSummary.rating !== null && reviewSummary.count !== null;

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="grain relative overflow-hidden bg-ink py-24 sm:py-32 lg:py-44">
      <MoustacheMark className="pointer-events-none absolute -right-24 top-16 w-[38rem] max-w-none text-ivory/[0.03] lg:-right-10" />

      <div className="container-luxe relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            index="04"
            label="Reviews"
            title={["The word", "on the street."]}
            className="lg:col-span-8"
            id="reviews-title"
          />
          {hasSummary && (
            <Reveal className="lg:col-span-4 lg:justify-self-end">
              <p className="flex items-baseline gap-3">
                <span className="font-display text-6xl text-ivory">{reviewSummary.rating?.toFixed(1)}</span>
                <span className="text-sm text-ivory/60">
                  / 5 · {reviewSummary.count} reviews op Google
                </span>
              </p>
            </Reveal>
          )}
        </div>

        {verified.length > 0 ? (
          <ReviewSlider reviews={verified} />
        ) : (
          <Reveal className="mt-16 grid gap-10 border-t border-ivory/12 pt-12 lg:mt-24 lg:grid-cols-12 lg:pt-16">
            <p className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.15] text-ivory lg:col-span-7">
              Wat klanten over La Moustache zeggen, lees je het best bij de bron:{" "}
              <em className="italic text-gold-light">ongefilterd, in hun eigen woorden.</em>
            </p>
            <div className="flex flex-col justify-end gap-6 lg:col-span-4 lg:col-start-9">
              <p className="text-[0.975rem] leading-relaxed text-ivory/65">
                Op deze website verschijnen enkel echte reviews, letterlijk overgenomen van Google. Ook langs geweest?
                Een paar woorden op Google helpen Aziz enorm.
              </p>
              <div className="flex flex-col gap-3 xs:flex-row">
                <a href={links.googleReviews} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <GoogleIcon className="size-4" />
                  Lees de reviews op Google
                </a>
                {links.googleWriteReview && (
                  <a href={links.googleWriteReview} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    Schrijf een review
                    <ArrowUpRight className="size-4" aria-hidden="true" strokeWidth={1.8} />
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
