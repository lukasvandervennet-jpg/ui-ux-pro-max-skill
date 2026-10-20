import type { ReactNode } from "react";

import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <Navbar solid />
      <main id="main" className="on-light bg-ivory pb-24 pt-36 text-ink sm:pb-32 lg:pt-44">
        <article className="container-luxe max-w-3xl">
          <p className="eyebrow text-bronze">Laatst bijgewerkt: {updated}</p>
          <h1 className="display mt-6 text-[clamp(2.75rem,7vw,5rem)]">{title}</h1>
          <div className="legal mt-12 space-y-6 text-[1.0625rem] leading-[1.75] text-ink/80 [&_a]:underline [&_a]:decoration-ink/30 [&_a]:underline-offset-4 hover:[&_a]:decoration-ink [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-[1.9rem] [&_h2]:font-medium [&_h2]:leading-tight [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_ul]:space-y-2">
            {children}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
