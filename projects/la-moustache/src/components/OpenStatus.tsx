"use client";

import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { getOpenStatus, type OpenStatus as Status } from "@/lib/hours";

/** Status pas na mount berekenen: de server kent de tijd van de bezoeker niet. */
function useOpenStatus() {
  const [status, setStatus] = useState<Status | null>(null);
  useEffect(() => {
    const update = () => setStatus(getOpenStatus());
    update();
    const t = window.setInterval(update, 60_000);
    return () => window.clearInterval(t);
  }, []);
  return status;
}

export function OpenStatusBadge({ tone = "light" }: { tone?: "light" | "dark" }) {
  const status = useOpenStatus();
  return (
    <p
      className={cn(
        "inline-flex min-h-8 items-center gap-2.5 rounded-full border px-3.5 text-[0.8125rem] font-medium transition-opacity duration-500",
        tone === "light" ? "border-ink/15 text-ink/80" : "border-ivory/15 text-ivory/80",
        status ? "opacity-100" : "opacity-0",
      )}
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className={cn("relative size-2 rounded-full", status?.open ? "bg-emerald-600" : "bg-stone")}
      >
        {status?.open && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-600/60 motion-reduce:animate-none" />}
      </span>
      {status?.label ?? "Openingsuren laden"}
    </p>
  );
}

export function TodayHighlight({
  day,
  className,
  children,
}: {
  day: number;
  className?: string;
  children: ReactNode;
}) {
  const status = useOpenStatus();
  const isToday = status?.today === day;
  return (
    <tr className={cn(className, isToday && "text-ink [&>*]:font-semibold")} aria-current={isToday ? "date" : undefined}>
      {children}
    </tr>
  );
}
