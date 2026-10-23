import { ArrowRight, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "../../../shared/components/ScrollReveal.jsx";

export default function HomeCtaSection() {
  return (
    <section className="container editorial-final-wrap" id="get-started">
      <ScrollReveal className="editorial-final-cta">
        <div>
          <span className="editorial-eyebrow">Your place is waiting</span>
          <h2>Book beautifully. Hire thoughtfully. Grow together.</h2>
        </div>
        <div className="editorial-final-actions">
          <Link className="btn editorial-light-button" to="/register">
            <UserPlus size={17} /> Create account
          </Link>
          <Link className="editorial-ghost-link" to="/login">
            Sign in <ArrowRight size={17} />
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
