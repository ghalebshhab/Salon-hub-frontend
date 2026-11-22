import { Link } from "react-router-dom";
import ScrollReveal from "../../../shared/components/ScrollReveal.jsx";
import t from "../../../shared/i18n/t.js";

export default function CareerSection() {
  return (
    <section className="editorial-career-band" id="careers">
      <div className="container editorial-career-grid">
        <ScrollReveal>
          <span className="editorial-index">{t("05 / For professionals")}</span>
          <h2>{t("Your experience deserves a thoughtful introduction.")}</h2>
        </ScrollReveal>
        <ScrollReveal className="editorial-career-copy" delay={80}>
          <p>
            {t(
              "Start with your normal profile, then switch on career mode when you are ready. Your details power suggested jobs and reusable, consistent applications.",
            )}
          </p>
          <div className="editorial-inline-actions">
            <Link className="btn btn-primary" to="/profile/career">
              {t("Build career profile")}
            </Link>
            <Link className="btn btn-secondary" to="/hiring-posts">
              {t("View hiring posts")}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
