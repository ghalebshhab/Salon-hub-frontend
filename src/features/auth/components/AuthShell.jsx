import { Link } from "react-router-dom";

export default function AuthShell({ eyebrow, title, intro, children, footer }) {
  return (
    <main className="auth-experience">
      <section className="auth-story" aria-label="About SalonHub">
        <Link to="/" className="auth-story-wordmark" aria-label="Return to SalonHub home">
          SalonHub
        </Link>
        <div className="auth-story-copy">
          <p className="auth-kicker">A better way to book</p>
          <h1>Trusted places. Simple plans. More room to grow.</h1>
          <p>
            Discover approved salons, book with confidence, and build your next
            chapter in the beauty community.
          </p>
        </div>
        <div className="auth-trust-list" aria-label="SalonHub commitments">
          <span>Approved salons</span>
          <span>Protected accounts</span>
          <span>Made for Jordan</span>
        </div>
        <div className="auth-story-mark" aria-hidden="true">
          <span>SH</span>
          <i />
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-card auth-card-modern">
          <div className="auth-heading">
            <p className="auth-kicker">{eyebrow}</p>
            <h2>{title}</h2>
            <p className="auth-intro">{intro}</p>
          </div>
          {children}
          {footer && <div className="auth-footer">{footer}</div>}
        </div>
      </section>
    </main>
  );
}
