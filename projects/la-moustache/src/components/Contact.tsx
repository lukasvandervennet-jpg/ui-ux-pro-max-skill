import { ArrowUpRight, Mail, MapPin, Navigation, Phone } from "lucide-react";
import type { ReactNode } from "react";

import { business, social } from "@/config/site";
import { groupedHours } from "@/lib/hours";
import { links } from "@/lib/links";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "./icons";
import { MapConsent } from "./MapConsent";
import { Reveal } from "./motion";
import { OpenStatusBadge } from "./OpenStatus";
import { SectionHeading } from "./SectionHeading";

function ContactRow({
  icon,
  label,
  children,
  href,
  external,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <span className="mt-0.5 text-bronze">{icon}</span>
      <span className="flex-1">
        <span className="eyebrow block text-stone">{label}</span>
        <span className="mt-1.5 block text-[1.0625rem] text-ink">{children}</span>
      </span>
      {href && (
        <ArrowUpRight
          className="size-4 self-center text-ink/30 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
          aria-hidden="true"
          strokeWidth={1.6}
        />
      )}
    </>
  );
  const cls = "group flex items-start gap-4 border-b border-ink/12 py-4";
  return (
    <li>
      {href ? (
        <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {content}
        </a>
      ) : (
        <div className={cls}>{content}</div>
      )}
    </li>
  );
}

export function Contact() {
  const iconCls = "size-[1.125rem]";
  return (
    <section id="contact" aria-labelledby="contact-title" className="on-light relative bg-ivory py-16 text-ink sm:py-24 lg:py-36">
      <div className="container-luxe grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <SectionHeading index="07" label="Contact & locatie" title={["Find your", "barber."]} tone="light" id="contact-title" />

          <Reveal className="mt-6 sm:mt-8">
            <OpenStatusBadge />
          </Reveal>

          <Reveal className="mt-8 sm:mt-10">
            <p className="font-display text-[1.75rem] leading-tight text-ink">{business.name}</p>
            <ul className="mt-4 border-t border-ink/12">
              <ContactRow
                icon={<MapPin className={iconCls} strokeWidth={1.5} aria-hidden="true" />}
                label="Adres"
                href={links.mapsDirections}
                external
              >
                <address className="not-italic">
                  {business.address.street}, {business.address.postalCode} {business.address.city}
                </address>
              </ContactRow>
              <ContactRow
                icon={<Phone className={iconCls} strokeWidth={1.5} aria-hidden="true" />}
                label="Telefoon"
                href={links.tel}
              >
                {business.phone.display}
              </ContactRow>
              <ContactRow icon={<WhatsAppIcon className={iconCls} />} label="WhatsApp" href={links.whatsapp()} external>
                Stuur een bericht voor een afspraak
              </ContactRow>
              {business.email.verified && (
                <ContactRow
                  icon={<Mail className={iconCls} strokeWidth={1.5} aria-hidden="true" />}
                  label="E-mail"
                  href={`mailto:${business.email.address}`}
                >
                  {business.email.address}
                </ContactRow>
              )}
              <ContactRow icon={<InstagramIcon className={iconCls} />} label="Instagram" href={social.instagram.url} external>
                {social.instagram.handle}
              </ContactRow>
              <ContactRow icon={<FacebookIcon className={iconCls} />} label="Facebook" href={social.facebook.url} external>
                {social.facebook.name}
              </ContactRow>
            </ul>
          </Reveal>

          <Reveal className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="eyebrow text-stone">Openingsuren</h3>
              <dl className="mt-3 space-y-1.5 text-[0.9375rem] text-ink/80">
                {groupedHours().map((g) => (
                  <div key={g.days} className="flex justify-between gap-8">
                    <dt>{g.days}</dt>
                    <dd className="tabular-nums">{g.range}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-[0.875rem] font-semibold text-ink">Enkel op afspraak</p>
            </div>
            <a href={links.mapsDirections} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
              <Navigation className="size-4" aria-hidden="true" strokeWidth={1.6} />
              Routebeschrijving
            </a>
          </Reveal>
        </div>

        <Reveal className="relative h-[22rem] overflow-hidden sm:h-[26rem] lg:col-span-6 lg:h-auto" delay={0.1}>
          <div className="absolute inset-0">
            <MapConsent />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
