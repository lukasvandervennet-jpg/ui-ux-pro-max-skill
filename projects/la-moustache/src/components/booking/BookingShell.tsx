import type { ReactNode } from "react";

import { Footer } from "../Footer";
import { Navbar } from "../Navbar";

/** Gedeelde opmaak voor de afspraakpagina's. */
export function BookingShell({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <>
      <Navbar solid />
      <main id="main" className="on-light min-h-[100svh] bg-ivory pb-20 pt-28 text-ink sm:pb-28 lg:pt-36">
        <div className="container-luxe">
          <header className="max-w-3xl">
            <p className="eyebrow flex items-center gap-3 text-bronze">
              <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
              {eyebrow}
            </p>
            <h1 className="display mt-5 text-[clamp(2.6rem,7vw,5rem)]">{title}</h1>
            {intro && <div className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-ink/75">{intro}</div>}
          </header>
          <div className="mt-10 sm:mt-14">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
