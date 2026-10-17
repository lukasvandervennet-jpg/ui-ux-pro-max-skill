"use client";

import { LazyMotion, MotionConfig, m, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/**
 * Animatiefuncties worden pas na de eerste render geladen (kleinere bundel),
 * en prefers-reduced-motion wordt overal gerespecteerd.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

type RevealProps = HTMLMotionProps<"div"> & { delay?: number; y?: number };

/** Zachte fade + lift wanneer een element in beeld komt. Eén keer. */
export function Reveal({ delay = 0, y = 28, children, ...rest }: RevealProps) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1, ease, delay }}
      {...rest}
    >
      {children}
    </m.div>
  );
}

/**
 * Tekstregel die van onder uit een masker schuift (voor grote titels).
 * De observer zit op de buitenste (niet-geklipte) span; de binnenste volgt via variants.
 */
export function LineReveal({
  children,
  delay = 0,
  className,
  immediate = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  immediate?: boolean;
}) {
  const trigger = immediate
    ? { animate: "show" }
    : { whileInView: "show", viewport: { once: true, margin: "0px 0px -8% 0px" } };
  return (
    <m.span initial="hidden" {...trigger} className={`block overflow-hidden pb-[0.08em] ${className ?? ""}`}>
      <m.span
        className="block will-change-transform"
        variants={{ hidden: { y: "105%" }, show: { y: "0%" } }}
        transition={{ duration: 1.1, ease, delay }}
      >
        {children}
      </m.span>
    </m.span>
  );
}

/** Beeld dat subtiel uitzoomt bij binnenkomst. */
export function ImageReveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      className={className}
      initial={{ clipPath: "inset(8% 8% 8% 8%)", opacity: 0.4 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.4, ease }}
    >
      {children}
    </m.div>
  );
}

/** Zelfde als Reveal, maar als <li> zodat lijsten geldige HTML blijven. */
export function RevealItem({
  delay = 0,
  y = 16,
  children,
  ...rest
}: HTMLMotionProps<"li"> & { delay?: number; y?: number }) {
  return (
    <m.li
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
      {...rest}
    >
      {children}
    </m.li>
  );
}
