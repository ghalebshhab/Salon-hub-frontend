import { Newspaper, Store, UserRoundPlus, UserRoundSearch } from "lucide-react";
import { Link } from "react-router-dom";
import { COMMUNITY_ROUTES } from "../model/communityRoutes.js";
import t from "../../../shared/i18n/t.js";

const TABS = [
  {
    key: "feed",
    to: COMMUNITY_ROUTES.feed,
    label: t("Feed"),
    shortLabel: t("Feed"),
    icon: Newspaper,
  },
  {
    key: "discover",
    to: COMMUNITY_ROUTES.discover,
    label: t("Discover people"),
    shortLabel: t("Discover"),
    icon: UserRoundSearch,
  },
  {
    key: "requests",
    to: COMMUNITY_ROUTES.requests,
    label: t("Requests"),
    shortLabel: t("Requests"),
    icon: UserRoundPlus,
    countKey: "requests",
  },
  {
    key: "following",
    to: COMMUNITY_ROUTES.following,
    label: t("Following"),
    shortLabel: t("Following"),
    icon: Store,
    countKey: "following",
  },
];

/**
 * Section switcher for the community workspace. Each tab is a real route
 * that shows only its own section, so the page never mixes unrelated tasks.
 */
export default function CommunityTabs({ active, counts }) {
  return (
    <nav className="community-tabs" aria-label={t("Community sections")}>
      {TABS.map(({ key, to, label, shortLabel, icon: Icon, countKey }) => {
        const count = countKey ? counts[countKey] : null;
        const highlight = countKey === "requests" && count > 0;
        return (
          <Link
            key={key}
            to={to}
            className={`community-tab ${active === key ? "is-active" : ""}`.trim()}
            aria-current={active === key ? "page" : undefined}
            aria-label={count != null ? `${label}, ${count}` : label}
          >
            <Icon aria-hidden="true" />
            <span className="community-tab-label">{t(label)}</span>
            {shortLabel && (
              <span className="community-tab-short" aria-hidden="true">
                {t(shortLabel)}
              </span>
            )}
            {count != null && (
              <span
                className={`community-tab-count ${highlight ? "is-alert" : ""}`.trim()}
                aria-hidden="true"
              >
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
