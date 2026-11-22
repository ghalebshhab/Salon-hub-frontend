import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  MapPin,
  Scissors,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "../../../shared/components/ScrollReveal.jsx";
import t from "../../../shared/i18n/t.js";

export default function HomeHero() {
  return (
    <section className="editorial-hero" id="welcome">
      <div className="container editorial-hero-grid">
        <ScrollReveal className="editorial-hero-copy">
          <span className="editorial-eyebrow">
            <Sparkles size={15} /> {t("Beauty, business, and opportunity")}
          </span>
          <h1>
            {t("Your next great")}
            <br />
            <em>{t("salon experience")}</em> {t("starts here.")}
          </h1>
          <p>
            {t(
              "Discover trusted salons, book with clarity, build your career, and grow your team through one considered platform made for Jordan's beauty community.",
            )}
          </p>
          <div className="editorial-hero-actions">
            <Link className="btn btn-primary" to="/register">
              {t("Get started")} <ArrowRight size={17} />
            </Link>
            <Link className="btn btn-secondary" to="/hiring-posts">
              {t("Explore careers")}
            </Link>
          </div>
          <div className="editorial-trust-row">
            <span>
              <BadgeCheck size={17} /> {t("Approved salons")}
            </span>
            <span>
              <ShieldCheck size={17} /> {t("Protected accounts")}
            </span>
            <span>
              <MapPin size={17} /> {t("Made for Jordan")}
            </span>
          </div>
          <Link
            className="editorial-scroll-cue"
            to="/#discover"
            aria-label={t("Scroll to discover salons")}
          >
            {t("Scroll to explore")}
            <span aria-hidden="true">
              <ArrowDown size={15} />
            </span>
          </Link>
        </ScrollReveal>

        <ScrollReveal className="editorial-hero-aside" delay={120}>
          <div className="editorial-appointment-card">
            <div className="editorial-card-heading">
              <div>
                <span className="editorial-eyebrow">
                  {t("A simpler visit")}
                </span>
                <h2>{t("Everything stays clear.")}</h2>
              </div>
              <span className="editorial-icon-tile">
                <Scissors size={22} />
              </span>
            </div>
            <div className="editorial-appointment-line">
              <span>
                <CalendarDays size={17} /> {t("Appointment request")}
              </span>
              <strong>{t("Pending")}</strong>
            </div>
            <div className="editorial-appointment-line">
              <span>
                <UserCheck size={17} /> {t("Qualified employee")}
              </span>
              <strong>{t("Matched")}</strong>
            </div>
            <div className="editorial-progress" aria-hidden="true">
              <span />
            </div>
            <p>
              {t(
                "From service selection to the salon's decision, every step is easy to follow.",
              )}
            </p>
          </div>
          <div className="editorial-mini-stats">
            <div>
              <span>{t("For customers")}</span>
              <strong>{t("Book")}</strong>
              <small>{t("with confidence")}</small>
            </div>
            <div>
              <span>{t("For professionals")}</span>
              <strong>{t("Grow")}</strong>
              <small>{t("with the right team")}</small>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
