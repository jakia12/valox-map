import CTASection from "./components/CTASection";
import Copyright from "./components/Copyright";
import Footer from "./components/Footer";
import ServiceAreasHero from "./components/ServiceAreasHero";
import MapShell from "./components/maps/MapShell";
import "./globals.css";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <ServiceAreasHero />

      {/* Map Section */}
      <section className="bg-[#fff] py-14">
        <div className="max-w-[1400px] mx-auto">
          <MapShell />
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />

      {/* Copyright */}
      <Copyright />
    </div>
  );
}
