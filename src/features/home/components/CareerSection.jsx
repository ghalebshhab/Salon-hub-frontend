import { Link } from "react-router-dom";
import ScrollReveal from "../../../shared/components/ScrollReveal.jsx";

export default function CareerSection() {
  return (
    <section className="editorial-career-band" id="careers">
      <div className="container editorial-career-grid">
        <ScrollReveal>
          <span className="editorial-index">04 / For professionals</span>
          <h2>Your experience deserves a thoughtful introduction.</h2>
        </ScrollReveal>
        <ScrollReveal className="editorial-career-copy" delay={80}>
          <p>
            Start with your normal profile, then switch on career mode when you
            are ready. Your details power suggested jobs and reusable,
            consistent applications.
          </p>
          <div className="editorial-inline-actions">
            <Link className="btn btn-primary" to="/profile/career">
              Build career profile
            </Link>
            <Link className="btn btn-secondary" to="/hiring-posts">
              View hiring posts
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
