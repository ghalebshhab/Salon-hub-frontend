import t from "../../../shared/i18n/t.js";
export default function CommunityFeedHeading({ postCount }) {
  return (
    <header className="community-feed-heading">
      <div>
        <span className="community-card-kicker">
          {t("Latest conversations")}
        </span>
        <h2 id="community-feed-title">{t("Community feed")}</h2>
        <p>{t("Fresh stories, ideas, and work from across SalonHub.")}</p>
      </div>
      <small className="community-feed-count" aria-live="polite">
        {postCount} {postCount === 1 ? t("post") : t("posts")}
      </small>
    </header>
  );
}
