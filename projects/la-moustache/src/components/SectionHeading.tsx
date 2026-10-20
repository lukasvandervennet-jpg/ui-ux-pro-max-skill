import { cn } from "@/lib/cn";
import { LineReveal, Reveal } from "./motion";

export function SectionHeading({
  index,
  label,
  title,
  tone = "dark",
  className,
  id,
  size = "lg",
}: {
  index: string;
  label: string;
  title: string[];
  tone?: "dark" | "light";
  className?: string;
  id?: string;
  size?: "lg" | "md";
}) {
  return (
    <div className={className}>
      <Reveal y={12}>
        <p className={cn("eyebrow flex items-center gap-3", tone === "dark" ? "text-gold" : "text-bronze")}>
          <span className="tabular-nums">{index}</span>
          <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
          <span>{label}</span>
        </p>
      </Reveal>
      <h2
        id={id}
        className={cn(
          "display mt-4 sm:mt-6",
          size === "lg" ? "text-[clamp(2.5rem,7vw,6rem)]" : "text-[clamp(2.5rem,5vw,4.5rem)]",
          tone === "dark" ? "text-ivory" : "text-ink",
        )}
      >
        {title.map((line, i) => (
          <LineReveal key={line} delay={0.08 * i}>
            {line}
          </LineReveal>
        ))}
      </h2>
    </div>
  );
}
