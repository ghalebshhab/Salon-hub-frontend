import { ArrowRight, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "../../../shared/components/ScrollReveal.jsx";
import t from "../../../shared/i18n/t.js";

export default function HomeCtaSection() {
  return (
    <section className="container editorial-final-wrap" id="get-started">
      <ScrollReveal className="editorial-final-cta">
        <div>
          <span className="editorial-eyebrow">
            {t("Your place is waiting")}
          </span>
          <h2>{t("Book beautifully. Hire thoughtfully. Grow together.")}</h2>
        </div>
        <div className="editorial-final-actions">
          <Link className="btn editorial-light-button" to="/register">
            <UserPlus size={17} /> {t("Create account")}
          </Link>
          <Link className="editorial-ghost-link" to="/login">
            {t("Sign in")} <ArrowRight size={17} />
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
