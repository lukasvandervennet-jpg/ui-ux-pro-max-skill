"use client";

import { AnimatePresence, m, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Photo } from "@/config/photos";

const ease = [0.22, 1, 0.36, 1] as const;

export function Lightbox({
  photos,
  index,
  onIndexChange,
}: {
  photos: Photo[];
  index: number | null;
  onIndexChange: (i: number | null) => void;
}) {
  const open = index !== null;
  const [direction, setDirection] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      setDirection(delta);
      onIndexChange((index + delta + photos.length) % photos.length);
    },
    [index, onIndexChange, photos.length],
  );

  const close = useCallback(() => onIndexChange(null), [onIndexChange]);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      returnFocus.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>("button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, close]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
  };

  const photo = index !== null ? photos[index] : null;

  return (
    <AnimatePresence>
      {open && photo && (
        <m.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Fotogalerij"
          className="fixed inset-0 z-[60] flex flex-col bg-ink/[0.97] text-ivory backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="container-luxe flex h-20 shrink-0 items-center justify-between">
            <p className="eyebrow text-ivory/60 tabular-nums" aria-live="polite">
              {String(index! + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="inline-flex size-12 items-center justify-center rounded-full border border-ivory/20 transition-colors hover:border-gold hover:text-gold"
              aria-label="Sluiten"
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <m.div
                key={index}
                custom={direction}
                className="absolute inset-0 touch-pan-y px-4 sm:px-20"
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.5, ease }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={onDragEnd}
              >
                <div className="relative size-full">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="100vw"
                    quality={85}
                    className="pointer-events-none select-none object-contain"
                    draggable={false}
                  />
                </div>
              </m.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/20 bg-ink/50 transition-colors hover:border-gold hover:text-gold sm:inline-flex lg:left-8"
              aria-label="Vorige foto"
            >
              <ChevronLeft className="size-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/20 bg-ink/50 transition-colors hover:border-gold hover:text-gold sm:inline-flex lg:right-8"
              aria-label="Volgende foto"
            >
              <ChevronRight className="size-5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="container-luxe flex min-h-20 shrink-0 items-center justify-between gap-4 pb-[env(safe-area-inset-bottom)]">
            <p className="text-sm text-ivory/80">{photo.caption}</p>
            <div className="flex gap-2 sm:hidden">
              <button
                type="button"
                onClick={() => go(-1)}
                className="inline-flex size-11 items-center justify-center rounded-full border border-ivory/20"
                aria-label="Vorige foto"
              >
                <ChevronLeft className="size-5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="inline-flex size-11 items-center justify-center rounded-full border border-ivory/20"
                aria-label="Volgende foto"
              >
                <ChevronRight className="size-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
