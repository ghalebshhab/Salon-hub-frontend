import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  FileUser,
} from "lucide-react";
import ScrollReveal from "../../../shared/components/ScrollReveal.jsx";
import { platformFeatures } from "../content/homeContent.js";
import t from "../../../shared/i18n/t.js";

const featureIcons = {
  salon: Building2,
  booking: CalendarDays,
  profile: FileUser,
  career: BriefcaseBusiness,
};

export default function PlatformFeaturesSection() {
  return (
    <section className="editorial-band" id="platform">
      <div className="container editorial-section">
        <ScrollReveal className="editorial-section-heading centered">
          <div>
            <span className="editorial-index">{t("03 / One platform")}</span>
            <h2>{t("Designed for every side of salon life.")}</h2>
            <p>
              {t(
                "Useful tools meet a calm interface, so customers, professionals, and owners can focus on the next decision.",
              )}
            </p>
          </div>
        </ScrollReveal>
        <div className="editorial-feature-grid">
          {platformFeatures.map(({ number, icon, title, text }, index) => {
            const Icon = featureIcons[icon];
            return (
              <ScrollReveal
                className="editorial-feature-card"
                delay={(index % 4) * 75}
                key={number}
              >
                <div className="editorial-feature-top">
                  <span>{number}</span>
                  <Icon size={21} />
                </div>
                <h3>{t(title)}</h3>
                <p>{t(text)}</p>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
