import t from "../../../shared/i18n/t.js";
export default function CommunityProfilePostSkeleton() {
  return (
    <div
      className="community-profile-post-skeletons"
      aria-label={t("Loading member posts")}
      role="status"
    >
      {[0, 1].map((item) => (
        <div
          className="community-profile-post-skeleton"
          key={item}
          aria-hidden="true"
        >
          <span />
          <i />
          <i />
          <b />
        </div>
      ))}
      <span className="sr-only">{t("Loading member posts…")}</span>
    </div>
  );
}
