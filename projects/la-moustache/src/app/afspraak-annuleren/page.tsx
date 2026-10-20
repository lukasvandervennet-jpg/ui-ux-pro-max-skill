import type { Metadata } from "next";

import { BookingShell } from "@/components/booking/BookingShell";
import { CancelPanel } from "@/components/booking/CancelPanel";

export const metadata: Metadata = {
  title: "Afspraak annuleren",
  robots: { index: false, follow: false },
};

export default function CancelPage() {
  return (
    <BookingShell eyebrow="Afspraak" title="Afspraak annuleren" intro="Toch verhinderd? Annuleer hieronder, zodat iemand anders je plaats kan krijgen.">
      <CancelPanel />
    </BookingShell>
  );
}
