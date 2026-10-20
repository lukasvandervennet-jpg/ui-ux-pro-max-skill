import { BOOKING_PATH, bookingMode } from "@/config/booking";
import { business } from "@/config/site";

const fullAddress = `${business.address.street}, ${business.address.postalCode} ${business.address.city}`;

export const links = {
  tel: `tel:${business.phone.e164}`,
  whatsapp: (message: string = business.whatsapp.message) =>
    `https://wa.me/${business.whatsapp.number}?text=${encodeURIComponent(message)}`,
  mapsSearch: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name}, ${fullAddress}`)}`,
  mapsDirections: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`,
  mapsEmbed: `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&z=16&output=embed`,
  googleReviews: business.googlePlaceId
    ? `https://search.google.com/local/reviews?placeid=${business.googlePlaceId}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${business.address.city}`)}`,
  googleWriteReview: business.googlePlaceId
    ? `https://search.google.com/local/writereview?placeid=${business.googlePlaceId}`
    : null,
  fullAddress,
};

export function serviceMessage(serviceName: string) {
  return `Dag Aziz, ik zou graag een afspraak maken bij La Moustache voor: ${serviceName}. Wanneer heb je nog plaats?`;
}

/** Staat online boeken aan (NEXT_PUBLIC_BOOKING_MODE = "demo" of "live")? */
export const onlineBooking = bookingMode !== "off";

/** Boekingslink voor een dienst: eigen boekingspagina, anders een externe boekingslink, anders niets. */
export function bookingHref(serviceId?: string): string | null {
  if (onlineBooking) return serviceId ? `${BOOKING_PATH}?dienst=${encodeURIComponent(serviceId)}` : BOOKING_PATH;
  return business.bookingUrl;
}

/** Doel van de algemene "Maak een afspraak"-knoppen. */
export const primaryCta = onlineBooking ? BOOKING_PATH : "/#afspraak";
