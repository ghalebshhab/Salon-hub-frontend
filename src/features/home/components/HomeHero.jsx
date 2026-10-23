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

export default function HomeHero() {
  return (
    <section className="editorial-hero" id="welcome">
      <div className="container editorial-hero-grid">
        <ScrollReveal className="editorial-hero-copy">
          <span className="editorial-eyebrow">
            <Sparkles size={15} /> Beauty, business, and opportunity
          </span>
          <h1>
            Your next great
            <br />
            <em>salon experience</em> starts here.
          </h1>
          <p>
            Discover trusted salons, book with clarity, build your career, and
            grow your team through one considered platform made for
            Jordan&apos;s beauty community.
          </p>
          <div className="editorial-hero-actions">
            <Link className="btn btn-primary" to="/register">
              Get started <ArrowRight size={17} />
            </Link>
            <Link className="btn btn-secondary" to="/hiring-posts">
              Explore careers
            </Link>
          </div>
          <div className="editorial-trust-row">
            <span>
              <BadgeCheck size={17} /> Approved salons
            </span>
            <span>
              <ShieldCheck size={17} /> Protected accounts
            </span>
            <span>
              <MapPin size={17} /> Made for Jordan
            </span>
          </div>
          <Link
            className="editorial-scroll-cue"
            to="/#discover"
            aria-label="Scroll to discover salons"
          >
            Scroll to explore
            <span aria-hidden="true">
              <ArrowDown size={15} />
            </span>
          </Link>
        </ScrollReveal>

        <ScrollReveal className="editorial-hero-aside" delay={120}>
          <div className="editorial-appointment-card">
            <div className="editorial-card-heading">
              <div>
                <span className="editorial-eyebrow">A simpler visit</span>
                <h2>Everything stays clear.</h2>
              </div>
              <span className="editorial-icon-tile">
                <Scissors size={22} />
              </span>
            </div>
            <div className="editorial-appointment-line">
              <span>
                <CalendarDays size={17} /> Appointment request
              </span>
              <strong>Pending</strong>
            </div>
            <div className="editorial-appointment-line">
              <span>
                <UserCheck size={17} /> Qualified employee
              </span>
              <strong>Matched</strong>
            </div>
            <div className="editorial-progress" aria-hidden="true">
              <span />
            </div>
            <p>
              From service selection to the salon&apos;s decision, every step is
              easy to follow.
            </p>
          </div>
          <div className="editorial-mini-stats">
            <div>
              <span>For customers</span>
              <strong>Book</strong>
              <small>with confidence</small>
            </div>
            <div>
              <span>For professionals</span>
              <strong>Grow</strong>
              <small>with the right team</small>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
