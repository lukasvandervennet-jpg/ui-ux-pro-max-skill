import { ArrowUpRight, Mail, MapPin, Navigation, Phone } from "lucide-react";
import type { ReactNode } from "react";

import { business, openingHours, social } from "@/config/site";
import { formatRange } from "@/lib/hours";
import { links } from "@/lib/links";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "./icons";
import { MapConsent } from "./MapConsent";
import { Reveal } from "./motion";
import { OpenStatusBadge, TodayHighlight } from "./OpenStatus";
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
  const cls = "group flex items-start gap-4 border-b border-ink/12 py-5";
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
    <section id="contact" aria-labelledby="contact-title" className="on-light relative bg-ivory py-24 text-ink sm:py-32 lg:py-44">
      <div className="container-luxe grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <SectionHeading index="07" label="Contact & locatie" title={["Find your", "barber."]} tone="light" id="contact-title" />

          <Reveal className="mt-8">
            <OpenStatusBadge />
          </Reveal>

          <Reveal className="mt-10">
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

          <Reveal className="mt-12 grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="eyebrow text-stone">Openingsuren</h3>
              <table className="mt-4 w-full text-[0.9375rem] text-ink/75">
                <caption className="sr-only">Openingsuren per dag</caption>
                <tbody>
                  {openingHours.map((d) => (
                    <TodayHighlight key={d.day} day={d.day}>
                      <th scope="row" className="py-1.5 text-left font-normal">
                        {d.label}
                      </th>
                      <td className="py-1.5 text-right tabular-nums">{formatRange(d)}</td>
                    </TodayHighlight>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col justify-between gap-6">
              <p className="text-[0.9375rem] leading-relaxed text-ink/70">
                <strong className="font-semibold text-ink">Enkel op afspraak.</strong> Maak vooraf een afspraak via
                WhatsApp of telefoon, zo ben je zeker van je plaats.
              </p>
              <div className="flex flex-col gap-3">
                <a href={links.mapsDirections} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
                  <Navigation className="size-4" aria-hidden="true" strokeWidth={1.6} />
                  Routebeschrijving
                </a>
                <a href={links.tel} className="btn btn-outline-dark">
                  <Phone className="size-4" aria-hidden="true" strokeWidth={1.6} />
                  Bel nu
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal className="relative min-h-[28rem] overflow-hidden lg:col-span-6 lg:min-h-0" delay={0.1}>
          <div className="absolute inset-0">
            <MapConsent />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
