import { ArrowRight, Check, Users } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "../../../shared/components/ScrollReveal.jsx";
import { ownerSteps } from "../content/homeContent.js";
import t from "../../../shared/i18n/t.js";

export default function OwnerExperienceSection() {
  return (
    <section className="editorial-section container" id="owners">
      <ScrollReveal className="editorial-owner-panel">
        <div className="editorial-owner-copy">
          <span className="editorial-index">{t("04 / For salon owners")}</span>
          <h2>{t("A more considered way to run and grow your salon.")}</h2>
          <p>
            {t(
              "Build a trusted public presence, organize appointments, and make stronger hiring decisions without losing the human context.",
            )}
          </p>
          <div className="editorial-check-list">
            {ownerSteps.map((step) => (
              <span key={step}>
                <Check size={16} /> {t(step)}
              </span>
            ))}
          </div>
          <div className="editorial-inline-actions">
            <Link className="btn btn-primary" to="/owner/create-salon">
              {t("Create your salon")} <ArrowRight size={17} />
            </Link>
            <Link className="editorial-text-link" to="/owner/dashboard">
              {t("Open owner dashboard")}
            </Link>
          </div>
        </div>
        <div className="editorial-candidate-card">
          <div className="editorial-card-heading">
            <div>
              <span className="editorial-eyebrow">{t("Candidate review")}</span>
              <h3>{t("The strongest match, first.")}</h3>
            </div>
            <Users size={22} />
          </div>
          <div className="editorial-candidate">
            <span className="editorial-avatar">{t("RA")}</span>
            <div>
              <strong>{t("Rana Ahmad")}</strong>
              <small>{t("Hair stylist · Amman")}</small>
            </div>
            <span className="editorial-match">{t("92% match")}</span>
          </div>
          <div className="editorial-tags">
            <span>{t("Hair styling")}</span>
            <span>{t("Coloring")}</span>
            <span>{t("4 years")}</span>
            <span>{t("Resume")}</span>
          </div>
          <div className="editorial-ranking">
            <span />
            <span />
            <span />
          </div>
          <div className="editorial-candidate-footer">
            <span>{t("Suggested candidate")}</span>
            <strong>{t("Review application")}</strong>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
