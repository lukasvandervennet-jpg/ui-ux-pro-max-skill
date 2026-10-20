import type { Metadata } from "next";
import Link from "next/link";

import { MoustacheMark } from "@/components/Logo";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Pagina niet gevonden",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <Navbar solid />
      <main id="main" className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-ink pt-20">
        <MoustacheMark className="pointer-events-none absolute -right-20 bottom-0 w-[40rem] max-w-none text-ivory/[0.035]" />
        <div className="container-luxe relative">
          <p className="eyebrow text-gold">Fout 404</p>
          <h1 className="display mt-6 text-[clamp(3rem,10vw,8rem)] text-ivory">
            Iets te kort
            <br />
            <em className="font-normal italic text-gold-light">geknipt.</em>
          </h1>
          <p className="mt-8 max-w-md text-[1.0625rem] leading-relaxed text-ivory/70">
            Deze pagina bestaat niet (meer). Geen zorgen: de weg naar een frisse snit vind je hieronder.
          </p>
          <div className="mt-10 flex flex-col gap-3 xs:flex-row">
            <Link href="/" className="btn btn-primary">
              Naar de homepage
            </Link>
            <Link href="/#afspraak" className="btn btn-ghost">
              Maak een afspraak
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
