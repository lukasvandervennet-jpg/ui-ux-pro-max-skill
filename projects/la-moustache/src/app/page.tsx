import { About } from "@/components/About";
import { Booking } from "@/components/Booking";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { Navbar } from "@/components/Navbar";
import { Reviews } from "@/components/Reviews";
import { Services } from "@/components/Services";
import { StickyBooking } from "@/components/StickyBooking";
import { barberShopSchema } from "@/lib/structured-data";

export default function HomePage() {
  return (
    <>
      <JsonLd data={barberShopSchema()} />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Reviews />
        <Experience />
        <Booking />
        <Contact />
      </main>
      <Footer />
      <StickyBooking />
    </>
  );
}
