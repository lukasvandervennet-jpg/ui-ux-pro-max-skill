import { business, openingHours, seo, social, sponsor } from "@/config/site";

/**
 * Schema.org BarberShop. Bevat uitsluitend geverifieerde gegevens.
 * Bewust géén aggregateRating: Google staat geen zelf-gepubliceerde
 * reviewsterren toe voor LocalBusiness.
 */
export function barberShopSchema() {
  const grouped = new Map<string, string[]>();
  for (const d of openingHours) {
    if (!d.open || !d.close) continue;
    const key = `${d.open}-${d.close}`;
    grouped.set(key, [...(grouped.get(key) ?? []), d.schemaDay]);
  }

  return {
    "@context": "https://schema.org",
    "@type": "BarberShop",
    "@id": `${seo.siteUrl}/#barbershop`,
    name: business.name,
    alternateName: "La Moustache Latem",
    description: seo.description,
    url: seo.siteUrl,
    image: [`${seo.siteUrl}/og.jpg`],
    logo: `${seo.siteUrl}/icon.svg`,
    telephone: business.phone.e164,
    ...(business.email.verified ? { email: business.email.address } : {}),
    founder: { "@type": "Person", name: business.owner },
    foundingDate: String(business.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      postalCode: business.address.postalCode,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      addressCountry: business.address.country,
    },
    areaServed: ["Sint-Martens-Latem", "Gent"],
    openingHoursSpecification: [...grouped.entries()].map(([range, days]) => {
      const [opens, closes] = range.split("-");
      return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes };
    }),
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${business.name}, ${business.address.street}, ${business.address.postalCode} ${business.address.city}`,
    )}`,
    sameAs: [social.instagram.url, ...(social.facebook.isDirectPage ? [social.facebook.url] : [])],
    ...(business.legal.enterpriseNumber ? { vatID: business.legal.enterpriseNumber } : {}),
    ...(sponsor.active ? { sponsor: { "@type": "Organization", name: sponsor.name, url: sponsor.url } } : {}),
  };
}
