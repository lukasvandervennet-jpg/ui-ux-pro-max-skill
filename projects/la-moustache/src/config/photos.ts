import type { StaticImageData } from "next/image";

import azizPortrait from "@/assets/photos/aziz-portrait.jpg";
import capCut from "@/assets/photos/cap-cut.jpg";
import curlsResult from "@/assets/photos/curls-result.jpg";
import interior from "@/assets/photos/interior.jpg";
import neon from "@/assets/photos/neon.jpg";
import spray from "@/assets/photos/spray.jpg";
import stmntAziz from "@/assets/photos/stmnt-aziz.jpg";
import stmntCape from "@/assets/photos/stmnt-cape.jpg";

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
  azizPortrait: {
    src: azizPortrait,
    alt: "Aziz Güler lacht aan zijn bureau in La Moustache, met een gouden astronautbeeldje en een sfeerlamp",
    caption: "Aziz Güler in zijn eigen zaak",
  },
  interior: {
    src: interior,
    alt: "De lichte zaak van La Moustache: een barber werkt aan de krullen van een klant, met wasstoelen en een groot raam op de achtergrond",
    caption: "De zaak in Sint-Martens-Latem",
  },
  neon: {
    src: neon,
    alt: "Barber en klant poseren voor de groene plantenmuur met het neonlogo van La Moustache",
    caption: "De neonmuur van La Moustache",
  },
  stmntAziz: {
    src: stmntAziz,
    alt: "Lachende barber met bril en handschoenen stylet het haar van een klant",
    caption: "Styling met een glimlach",
  },
  stmntCape: {
    src: stmntCape,
    alt: "Lachende klant met snor onder een zwarte STMNT Grooming Goods-kapmantel, terwijl zijn haar gestyled wordt",
    caption: "Gestyled onder de STMNT-kapmantel",
  },
  spray: {
    src: spray,
    alt: "Barber bevochtigt het haar van een klant met een sproeier voor het knippen",
    caption: "Voorbereiden voor de snit",
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
} satisfies Record<string, Photo>;

/** Volgorde in de galerij. */
export const gallery: Photo[] = [
  photos.stmntAziz,
  photos.spray,
  photos.curlsResult,
  photos.stmntCape,
  photos.capCut,
];
