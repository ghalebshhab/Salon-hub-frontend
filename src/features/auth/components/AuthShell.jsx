import AuthStory from "./AuthStory.jsx";
import t from "../../../shared/i18n/t.js";

export default function AuthShell({ eyebrow, title, intro, children, footer }) {
  return (
    <div className="auth-experience">
      <AuthStory />
      <section className="auth-panel">
        <div className="auth-card auth-card-modern">
          <div className="auth-heading">
            <p className="auth-kicker">{t(eyebrow)}</p>
            <h2>{t(title)}</h2>
            <p className="auth-intro">{intro}</p>
          </div>
          {children}
          {footer && <div className="auth-footer">{footer}</div>}
        </div>
      </section>
    </div>
  );
}
