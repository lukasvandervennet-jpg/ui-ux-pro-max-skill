import type { Metadata } from "next";

import { BookingShell } from "@/components/booking/BookingShell";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { WhatsAppIcon } from "@/components/icons";
import { bookingMode, bookingSettings, serviceDuration } from "@/config/booking";
import { business, openingHours, services } from "@/config/site";
import { links } from "@/lib/links";

export const metadata: Metadata = {
  title: "Afspraak maken",
  description: "Kies online een vrij moment bij La Moustache Barbershop in Sint-Martens-Latem en ontvang meteen een bevestiging.",
  alternates: { canonical: "/afspraak-maken" },
  robots: bookingMode === "off" ? { index: false } : undefined,
};

export default function BookingPage() {
  const address = `${business.address.street}, ${business.address.postalCode} ${business.address.city}`;

  if (bookingMode === "off") {
    return (
      <BookingShell
        eyebrow="Afspraak"
        title="Afspraak maken"
        intro="Online boeken is nog niet beschikbaar. Maak je afspraak via WhatsApp of telefoon."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={links.whatsapp()} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
            <WhatsAppIcon className="size-4" />
            Afspraak via WhatsApp
          </a>
          <a href={links.tel} className="btn btn-outline-dark">
            Bel {business.phone.display}
          </a>
        </div>
      </BookingShell>
    );
  }

  const bookable = services
    .filter((s) => s.published)
    .map((s) => ({ id: s.id, title: s.title, titleNl: s.titleNl, duration: serviceDuration(s.id) }));

  const rules = {
    timeZone: bookingSettings.timeZone,
    slotInterval: bookingSettings.slotInterval,
    leadMinutes: bookingSettings.leadMinutes,
    maxDaysAhead: bookingSettings.maxDaysAhead,
    closedDates: [...bookingSettings.closedDates],
    hours: Object.fromEntries(openingHours.map((d) => [d.day, { open: d.open, close: d.close }])),
  };

  return (
    <BookingShell
      eyebrow="Online afspraak"
      title="Reserveer je stoel."
      intro={
        <>
          Kies je dienst, een dag en een vrij moment. Je krijgt meteen een bevestiging per e-mail.
          {bookingMode === "demo" && (
            <span className="mt-4 block border-l-2 border-bronze bg-ivory-deep px-4 py-3 text-[0.9375rem] text-ink">
              <strong>Demo-modus:</strong> deze pagina werkt, maar er wordt niets echt geboekt en er worden geen e-mails
              verstuurd.
            </span>
          )}
        </>
      }
    >
      <BookingWizard
        services={bookable}
        rules={rules}
        demo={bookingMode === "demo"}
        address={address}
        whatsappHref={links.whatsapp()}
        phoneHref={links.tel}
        phoneDisplay={business.phone.display}
      />
    </BookingShell>
  );
}
