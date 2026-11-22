import { PenLine } from "lucide-react";
import { Link } from "react-router-dom";
import { COMMUNITY_ROUTES } from "../model/communityRoutes.js";
import t from "../../../shared/i18n/t.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

// Compact page header: what this place is, and the one main action.
export default function CommunityHeader() {
  return (
    <header className="community-header">
      <div className="community-header-copy">
        <span className="community-header-eyebrow">
          {t(PAGE_HEADS.community.eyebrow)}
        </span>
        <h1>
          {t(PAGE_HEADS.community.title)}{" "}
          <em>{t(PAGE_HEADS.community.titleEm)}</em>
        </h1>
        <p>{t(PAGE_HEADS.community.text)}</p>
      </div>
      <Link className="community-header-action" to={COMMUNITY_ROUTES.create}>
        <PenLine aria-hidden="true" />
        {t("Create post")}
      </Link>
    </header>
  );
}
