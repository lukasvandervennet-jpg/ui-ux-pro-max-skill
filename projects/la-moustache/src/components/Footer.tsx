import { ArrowUp } from "lucide-react";
import Link from "next/link";

import { business, navigation, social } from "@/config/site";
import { groupedHours } from "@/lib/hours";
import { links, primaryCta } from "@/lib/links";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "./icons";
import { Logo } from "./Logo";
import { SponsorBadge } from "./Sponsor";

export function Footer() {
  const year = new Date().getFullYear();
  const legal = [business.legal.companyName, business.legal.enterpriseNumber && `Ond.nr. ${business.legal.enterpriseNumber}`]
    .filter(Boolean)
    .join(" · ");

  return (
    <footer className="relative border-t border-ivory/10 bg-[#0b0b0b] text-ivory">
      <div className="container-luxe py-14 lg:py-28">
        <div className="flex flex-col gap-8 border-b border-ivory/10 pb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:pb-16">
          <div>
            <Logo size="lg" />
            <p className="display mt-8 max-w-xl text-[clamp(1.75rem,4vw,3.25rem)] text-ivory lg:mt-10">
              The art of a <em className="font-normal italic text-gold-light">perfect</em> cut.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <SponsorBadge tone="dark" />
            <Link href={primaryCta} className="btn btn-primary">
              Maak een afspraak
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 pt-10 lg:grid-cols-4 lg:gap-12 lg:pt-14">
          <nav aria-label="Footernavigatie">
            <h2 className="eyebrow text-gold">Navigatie</h2>
            <ul className="mt-5 space-y-3 text-[0.9375rem] text-ivory/70">
              {navigation.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="link-underline hover:text-ivory">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow text-gold">Contact</h2>
            <address className="mt-5 space-y-3 text-[0.9375rem] not-italic leading-relaxed text-ivory/70">
              <p>
                {business.address.street}
                <br />
                {business.address.postalCode} {business.address.city}
              </p>
              <p>
                <a href={links.tel} className="link-underline hover:text-ivory">
                  {business.phone.display}
                </a>
              </p>
              {business.email.verified && (
                <p>
                  <a href={`mailto:${business.email.address}`} className="link-underline hover:text-ivory">
                    {business.email.address}
                  </a>
                </p>
              )}
            </address>
          </div>

          <div>
            <h2 className="eyebrow text-gold">Openingsuren</h2>
            <dl className="mt-5 space-y-3 text-[0.9375rem] text-ivory/70">
              {groupedHours().map((g) => (
                <div key={g.days} className="flex flex-col lg:flex-row lg:justify-between lg:gap-4">
                  <dt>{g.days}</dt>
                  <dd className="tabular-nums text-ivory/85">{g.range}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[0.8125rem] text-gold-light">Enkel op afspraak</p>
          </div>

          <div>
            <h2 className="eyebrow text-gold">Volg ons</h2>
            <ul className="mt-5 flex gap-3">
              <li>
                <a
                  href={social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="inline-flex size-12 items-center justify-center rounded-full border border-ivory/15 text-ivory/80 transition-colors hover:border-gold hover:text-gold"
                >
                  <InstagramIcon className="size-5" />
                </a>
              </li>
              <li>
                <a
                  href={social.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="inline-flex size-12 items-center justify-center rounded-full border border-ivory/15 text-ivory/80 transition-colors hover:border-gold hover:text-gold"
                >
                  <FacebookIcon className="size-5" />
                </a>
              </li>
              <li>
                <a
                  href={links.whatsapp()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="inline-flex size-12 items-center justify-center rounded-full border border-ivory/15 text-ivory/80 transition-colors hover:border-gold hover:text-gold"
                >
                  <WhatsAppIcon className="size-5" />
                </a>
              </li>
            </ul>
            <p className="mt-5 text-[0.9375rem] text-ivory/70">{social.instagram.handle}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-luxe flex flex-col gap-4 py-7 pb-28 text-[0.8125rem] text-ivory/60 md:flex-row md:items-center md:justify-between md:pb-7">
          <p>
            © {year} {business.name}
            {legal && <span> · {legal}</span>}
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li>
              <Link href="/privacy" className="link-underline hover:text-ivory">
                Privacyverklaring
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="link-underline hover:text-ivory">
                Cookies
              </Link>
            </li>
            <li>
              <Link href="/#top" className="group inline-flex items-center gap-2 hover:text-ivory">
                Naar boven
                <ArrowUp className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
