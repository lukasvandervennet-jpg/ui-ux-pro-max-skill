import type { StaticImageData } from "next/image";

import azizStyling from "@/assets/photos/aziz-styling.jpg";
import curlsKenzo from "@/assets/photos/curls-kenzo.jpg";
import capCut from "@/assets/photos/cap-cut.jpg";
import clipperCut from "@/assets/photos/clipper-cut.jpg";
import interiorWindow from "@/assets/photos/interior-window.jpg";
import interiorLounge from "@/assets/photos/interior-lounge.jpg";
import shelfDetail from "@/assets/photos/shelf-detail.jpg";

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
  curlsKenzo: {
    src: curlsKenzo,
    alt: "Klant met een verzorgde krullende coupe en een frisse fade bij La Moustache in Sint-Martens-Latem",
    caption: "Krullen met een zachte fade",
  },
  capCut: {
    src: capCut,
    alt: "Aziz Güler, met pet en bril, knipt een klant met de schaar",
    caption: "Precisiewerk met de schaar",
  },
  clipperCut: {
    src: clipperCut,
    alt: "Aziz werkt met de tondeuse aan de fade van een klant in de barberstoel",
    caption: "Fade met de tondeuse",
  },
  interiorWindow: {
    src: interiorWindow,
    alt: "Interieur van La Moustache met wasstoelen, spiegelwand en groot raam met daglicht",
    caption: "Het interieur",
  },
  interiorLounge: {
    src: interiorLounge,
    alt: "Groene fluwelen fauteuil en planten bij het raam in de wachtruimte van La Moustache",
    caption: "Even zitten, even rust",
  },
  shelfDetail: {
    src: shelfDetail,
    alt: "Detail van het interieur: decoratieve basketbal op een houten rek",
    caption: "Details die het maken",
  },
} satisfies Record<string, Photo>;

/** Volgorde in de galerij (de layout van het raster volgt deze volgorde). */
export const gallery: Photo[] = [
  photos.curlsKenzo,
  photos.capCut,
  photos.clipperCut,
  photos.interiorLounge,
  photos.azizStyling,
];
