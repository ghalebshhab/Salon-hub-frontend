import AuthAnimatedBackground from "./AuthAnimatedBackground.jsx";
import t from "../../../shared/i18n/t.js";

/** The brand side of every sign-in page (also shown by the page skeleton). */
export default function AuthStory() {
  return (
    <section className="auth-story" aria-label={t("About SalonHub")}>
      <AuthAnimatedBackground variant="silk" />
      <div className="auth-story-shade" aria-hidden="true" />
      <div className="auth-story-copy">
        <p className="auth-kicker">{t("A better way to book")}</p>
        <h1>{t("Trusted places. Simple plans. More room to grow.")}</h1>
        <p>
          {t(
            "Discover approved salons, book with confidence, and build your next chapter in the beauty community.",
          )}
        </p>
      </div>
      <div className="auth-trust-list" aria-label={t("SalonHub commitments")}>
        <span>{t("Approved salons")}</span>
        <span>{t("Protected accounts")}</span>
        <span>{t("Made for Jordan")}</span>
      </div>
      <div className="auth-story-mark" aria-hidden="true">
        <span>{t("SH")}</span>
        <i />
      </div>
    </section>
  );
}
