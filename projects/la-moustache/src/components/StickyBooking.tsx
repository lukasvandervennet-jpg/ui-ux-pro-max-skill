"use client";

import { AnimatePresence, m } from "framer-motion";
import { Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { BOOKING_PATH } from "@/config/booking";
import { links, onlineBooking } from "@/lib/links";
import { WhatsAppIcon } from "./icons";

/**
 * Subtiele afspraakbalk op mobiel. Verschijnt na de hero en verdwijnt
 * zodra de afspraak-, contactsectie of footer in beeld is.
 */
export function StickyBooking() {
  const [pastHero, setPastHero] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const targets = ["afspraak", "contact"]
      .map((id) => document.getElementById(id))
      .concat(document.querySelector("footer"))
      .filter(Boolean) as Element[];
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      setHidden(visible.size > 0);
    });
    targets.forEach((t) => io.observe(t));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const show = pastHero && !hidden;

  return (
    <AnimatePresence>
      {show && (
        <m.div
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.875rem,env(safe-area-inset-bottom))] md:hidden"
          initial={{ y: "120%" }}
          animate={{ y: 0 }}
          exit={{ y: "120%" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex gap-2 rounded-full border border-ivory/10 bg-ink/90 p-1.5 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl">
            {onlineBooking ? (
              <Link href={BOOKING_PATH} className="btn btn-primary !min-h-12 flex-1 !px-4">
                Maak een afspraak
              </Link>
            ) : (
              <a
                href={links.whatsapp()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary !min-h-12 flex-1 !px-4"
              >
                <WhatsAppIcon className="size-4" />
                Maak een afspraak
              </a>
            )}
            <a
              href={links.tel}
              aria-label="Bel La Moustache"
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-ivory/15 text-ivory"
            >
              <Phone className="size-[1.125rem]" strokeWidth={1.6} />
            </a>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
