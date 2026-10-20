"use client";

import { AnimatePresence, m } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { business, navigation, social } from "@/config/site";
import { cn } from "@/lib/cn";
import { BOOKING_PATH } from "@/config/booking";
import { links, onlineBooking, primaryCta } from "@/lib/links";
import { InstagramIcon, WhatsAppIcon } from "./icons";
import { Logo } from "./Logo";

const ease = [0.22, 1, 0.36, 1] as const;

export function Navbar({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(solid);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(solid ? "" : "top");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (solid) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  // Actieve sectie markeren in de navigatie
  useEffect(() => {
    const ids = navigation.map((n) => n.href.split("#")[1]);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Mobiel menu: scroll lock, Escape, focus
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("a, button");
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
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const toggle = toggleRef.current;
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Naar de inhoud
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || open
            ? "border-b border-ivory/10 bg-ink/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav aria-label="Hoofdnavigatie" className="container-luxe flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
          <Link href="/#top" className="relative z-10 -ml-1 rounded-md p-1">
            <Logo size="sm" />
            <span className="sr-only">, naar de homepage</span>
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => {
              const id = item.href.split("#")[1];
              const isActive = active === id;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative py-2 text-[0.8125rem] font-medium tracking-wide transition-colors duration-300",
                      isActive ? "text-ivory" : "text-ivory/65 hover:text-ivory",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute -bottom-0.5 left-1/2 h-px -translate-x-1/2 bg-gold transition-all duration-500",
                        isActive ? "w-full" : "w-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="relative z-10 flex items-center gap-2">
            <a
              href={links.tel}
              className="hidden h-11 items-center gap-2 rounded-full px-4 text-[0.8125rem] font-medium text-ivory/75 transition-colors hover:text-ivory md:inline-flex"
            >
              <Phone className="size-4 text-gold" aria-hidden="true" strokeWidth={1.6} />
              {business.phone.local}
            </a>
            <Link href={primaryCta} className="btn btn-primary hidden !min-h-11 !px-5 !text-[0.6875rem] sm:inline-flex">
              Maak een afspraak
            </Link>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Menu sluiten" : "Menu openen"}
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-ivory lg:hidden"
            >
              {open ? <X className="size-6" strokeWidth={1.5} /> : <Menu className="size-6" strokeWidth={1.5} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink pt-[4.5rem] lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="container-luxe flex flex-1 flex-col justify-between overflow-y-auto pb-[max(2rem,env(safe-area-inset-bottom))] pt-8">
              <ul className="space-y-1">
                {navigation.map((item, i) => (
                  <m.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease, delay: 0.15 + i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 py-2"
                    >
                      <span className="eyebrow w-6 text-gold/80 tabular-nums">0{i + 1}</span>
                      <span className="display text-[clamp(2rem,9vw,3rem)] text-ivory transition-colors group-hover:text-gold-light">
                        {item.label}
                      </span>
                    </Link>
                  </m.li>
                ))}
              </ul>

              <m.div
                className="mt-10 space-y-6 border-t border-ivory/10 pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="flex flex-col gap-3 xs:flex-row">
                  {onlineBooking ? (
                    <Link href={BOOKING_PATH} onClick={() => setOpen(false)} className="btn btn-primary flex-1">
                      Online afspraak maken
                    </Link>
                  ) : (
                    <a href={links.whatsapp()} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-1">
                      <WhatsAppIcon className="size-4" />
                      Afspraak via WhatsApp
                    </a>
                  )}
                  {onlineBooking ? (
                    <a href={links.whatsapp()} target="_blank" rel="noopener noreferrer" className="btn btn-ghost flex-1">
                      <WhatsAppIcon className="size-4" />
                      WhatsApp
                    </a>
                  ) : (
                    <a href={links.tel} className="btn btn-ghost flex-1">
                      <Phone className="size-4" aria-hidden="true" strokeWidth={1.6} />
                      Bellen
                    </a>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm text-ivory/60">
                  <span>{business.address.streetShort}, Latem</span>
                  <a
                    href={social.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-11 items-center justify-center rounded-full border border-ivory/15 text-ivory"
                    aria-label="La Moustache op Instagram"
                  >
                    <InstagramIcon className="size-5" />
                  </a>
                </div>
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
