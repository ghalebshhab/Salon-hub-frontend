import ScrollReveal from "../../../shared/components/ScrollReveal.jsx";
import SalonShowcase from "../../salons/components/SalonShowcase.jsx";
import t from "../../../shared/i18n/t.js";

export default function SalonDiscoverySection() {
  return (
    <section className="editorial-section container" id="discover">
      <ScrollReveal className="editorial-section-heading">
        <div>
          <span className="editorial-index">{t("01 / Discover")}</span>
          <h2>{t("Find your next favorite place.")}</h2>
          <p>
            {t(
              "Browse active salons and open a profile for its location, working hours, team, services, reviews, and booking options.",
            )}
          </p>
        </div>
        <span className="editorial-heading-mark">{t("SH")}</span>
      </ScrollReveal>
      <ScrollReveal delay={90}>
        <SalonShowcase />
      </ScrollReveal>
    </section>
  );
}
