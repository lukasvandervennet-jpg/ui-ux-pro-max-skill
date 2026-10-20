import type { MetadataRoute } from "next";

import { BOOKING_PATH, bookingMode } from "@/config/booking";
import { seo } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${seo.siteUrl}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...(bookingMode !== "off"
      ? [{ url: `${seo.siteUrl}${BOOKING_PATH}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 }]
      : []),
    { url: `${seo.siteUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${seo.siteUrl}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
