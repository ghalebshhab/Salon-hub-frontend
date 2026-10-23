import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  FileUser,
} from "lucide-react";
import ScrollReveal from "../../../shared/components/ScrollReveal.jsx";
import { platformFeatures } from "../content/homeContent.js";

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
            <span className="editorial-index">02 / One platform</span>
            <h2>Designed for every side of salon life.</h2>
            <p>
              Useful tools meet a calm interface, so customers, professionals,
              and owners can focus on the next decision.
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
                <h3>{title}</h3>
                <p>{text}</p>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
