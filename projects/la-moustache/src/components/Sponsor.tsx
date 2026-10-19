import { ArrowUpRight } from "lucide-react";

import { sponsor } from "@/config/site";
import { cn } from "@/lib/cn";

/** Vermelding "Gesponsord door STMNT". Verdwijnt als `sponsor.active` false is. */
export function SponsorBadge({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  if (!sponsor.active) return null;
  const light = tone === "light";
  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={cn(
        "group inline-flex items-center gap-4 border px-5 py-3.5 transition-colors duration-500",
        light ? "border-ink/15 hover:border-ink/40" : "border-ivory/15 hover:border-gold/60",
        className,
      )}
    >
      <span className={cn("eyebrow leading-tight", light ? "text-stone" : "text-ivory/55")}>
        Gesponsord
        <br />
        door
      </span>
      <span aria-hidden="true" className={cn("h-8 w-px", light ? "bg-ink/15" : "bg-ivory/15")} />
      <span className="flex flex-col leading-none">
        <span className={cn("font-sans text-[1.35rem] font-extrabold tracking-[0.2em]", light ? "text-ink" : "text-ivory")}>
          {sponsor.short}
        </span>
        <span className={cn("mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.28em]", light ? "text-bronze" : "text-gold")}>
          Grooming Goods
        </span>
      </span>
      <ArrowUpRight
        className={cn(
          "size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
          light ? "text-ink/40" : "text-ivory/40",
        )}
        aria-hidden="true"
        strokeWidth={1.6}
      />
      <span className="sr-only">(opent de website van {sponsor.name})</span>
    </a>
  );
}
