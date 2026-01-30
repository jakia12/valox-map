import Copyright from "../components/Copyright";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import ServiceAreasHero from "../components/ServiceAreasHero";

export default function ServiceAreasDemoPage() {
  return (
    <div>
      <ServiceAreasHero />

      {/* Additional content can go here */}
      <div
        style={{ padding: "3rem 2rem", maxWidth: "1200px", margin: "0 auto" }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Our Service Areas
        </h2>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#666" }}>
          VeloX Valuations provides professional appraisal services across
          multiple regions. Browse our service areas to find coverage in your
          location.
        </p>
      </div>

      {/* Footer Components */}
      <CTASection />
      <Footer />
      <Copyright />
    </div>
  );
}
