import type { StaticImageData } from "next/image";

import azizDetail from "@/assets/photos/aziz-detail.jpg";
import azizStyling from "@/assets/photos/aziz-styling.jpg";
import capCut from "@/assets/photos/cap-cut.jpg";
import curlsResult from "@/assets/photos/curls-result.jpg";
import products from "@/assets/photos/products.jpg";

/**
 * Alle foto's komen van het eigen Instagram- en Facebookaccount van La Moustache.
 * Vervang een bestand in src/assets/photos/ door een originele (scherpere) versie
 * met dezelfde naam en de website gebruikt die automatisch.
 */
export type Photo = {
  src: StaticImageData;
  alt: string;
  caption: string;
};

export const photos = {
  azizStyling: {
    src: azizStyling,
    alt: "Aziz Güler brengt de krullen van een klant in vorm in de lichte zaak van La Moustache",
    caption: "Krullen in vorm brengen",
  },
  azizDetail: {
    src: azizDetail,
    alt: "Aziz Güler werkt met handschoenen product in de krullen van een klant",
    caption: "Styling met de hand",
  },
  curlsResult: {
    src: curlsResult,
    alt: "Klant met een verzorgde krullende coupe en een frisse fade bij La Moustache in Sint-Martens-Latem",
    caption: "Krullen met een zachte fade",
  },
  capCut: {
    src: capCut,
    alt: "Aziz Güler, met pet en bril, knipt een klant met de schaar",
    caption: "Precisiewerk met de schaar",
  },
  products: {
    src: products,
    alt: "Potten STMNT-stylingproducten op een houten rek in de zaak",
    caption: "Afgewerkt met STMNT",
  },
} satisfies Record<string, Photo>;

/** Volgorde in de galerij (de layout van het raster volgt deze volgorde). */
export const gallery: Photo[] = [photos.curlsResult, photos.azizDetail, photos.capCut];
