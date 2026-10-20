import { cn } from "@/lib/cn";

/**
 * Vectorreconstructie van het La Moustache-beeldmerk (snor + open ring),
 * nagetekend op basis van het profielbeeld op Instagram/Facebook.
 * Vervang door het originele logobestand zodra dat beschikbaar is.
 */
export function MoustacheMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 880 680"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="currentColor"
    >
      <g fill="none" stroke="currentColor" strokeWidth="36" strokeLinecap="round">
        <path d="M139 290 A305 305 0 0 1 741 290" />
        <path d="M181 500 A305 305 0 0 0 699 500" />
      </g>
      <path d="M440 312C470 275 510 258 560 258C630 258 680 300 730 335C775 360 830 355 865 322C850 380 805 440 720 460C660 474 600 470 550 455C500 440 465 420 440 395C415 420 380 440 330 455C280 470 220 474 160 460C75 440 30 380 15 322C50 355 105 360 150 335C200 300 250 258 320 258C370 258 410 275 440 312Z" />
    </svg>
  );
}

export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const s = {
    sm: { mark: "w-9", word: "text-[1.65rem]", sub: "text-[0.5rem]" },
    md: { mark: "w-11", word: "text-[2rem]", sub: "text-[0.55rem]" },
    lg: { mark: "w-16", word: "text-[2.9rem]", sub: "text-[0.7rem]" },
  }[size];

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <MoustacheMark className={cn(s.mark, "shrink-0 text-gold")} />
      <span className="flex flex-col items-start leading-none">
        <span className={cn("font-script leading-[0.8] text-ivory", s.word)}>La Moustache</span>{" "}
        <span className={cn("mt-1 pl-1 font-sans font-bold tracking-[0.32em] text-gold", s.sub)}>
          BARBERSHOP
        </span>
      </span>
    </span>
  );
}
