import ScrollReveal from "../../../shared/components/ScrollReveal.jsx";
import SalonShowcase from "../../salons/components/SalonShowcase.jsx";

export default function SalonDiscoverySection() {
  return (
    <section className="editorial-section container" id="discover">
      <ScrollReveal className="editorial-section-heading">
        <div>
          <span className="editorial-index">01 / Discover</span>
          <h2>Find your next favorite place.</h2>
          <p>
            Browse active salons and open a profile for its location, working
            hours, team, services, reviews, and booking options.
          </p>
        </div>
        <span className="editorial-heading-mark">SH</span>
      </ScrollReveal>
      <ScrollReveal delay={90}>
        <SalonShowcase />
      </ScrollReveal>
    </section>
  );
}
