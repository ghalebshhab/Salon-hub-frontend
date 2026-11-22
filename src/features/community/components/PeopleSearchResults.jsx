import { RotateCw } from "lucide-react";
import CommunityProfileLink from "./CommunityProfileLink.jsx";
import FriendshipActions from "./FriendshipActions.jsx";
import HighlightedText from "../../../shared/components/HighlightedText.jsx";
import t from "../../../shared/i18n/t.js";

export default function PeopleSearchResults({
  people,
  search,
  loading,
  error,
  busy,
  onRetry,
  onConnect,
  onAccept,
  onDecline,
}) {
  // Keep the current list visible while the next letter narrows it.
  if (loading && !people.length) {
    return (
      <p className="community-discovery-message">
        {t("Finding people in the community…")}
      </p>
    );
  }
  if (error) {
    return (
      <div className="community-discovery-message is-error" role="alert">
        <span>{t("We couldn't load people right now.")}</span>
        <button type="button" onClick={onRetry}>
          <RotateCw size={15} aria-hidden="true" /> {t("Try again")}
        </button>
      </div>
    );
  }
  if (!people.length) {
    return (
      <p className="community-discovery-message">
        {search
          ? t("No people found. Try a different name or username.")
          : t(
              "No suggestions yet. Search by name or username to find your people.",
            )}
      </p>
    );
  }

  return (
    <>
      <p className="community-discovery-caption">
        {search ? (
          <>
            {t("People starting with")} <strong>“{search}”</strong>
          </>
        ) : (
          t("Suggested professionals")
        )}
      </p>
      <ul className="community-people-grid" aria-busy={loading || undefined}>
        {people.map((member) => (
          <li className="community-person-row" key={member.user.id}>
            <CommunityProfileLink user={member.user} size="small">
              {search ? (
                <>
                  <span className="community-profile-link-copy">
                    <strong>
                      <HighlightedText
                        text={member.user.displayName || member.user.userName}
                        query={search}
                      />
                    </strong>
                    <small>
                      @
                      <HighlightedText
                        text={member.user.userName}
                        query={search}
                      />
                    </small>
                  </span>
                </>
              ) : undefined}
            </CommunityProfileLink>
            <FriendshipActions
              member={member}
              busy={busy}
              onConnect={onConnect}
              onAccept={onAccept}
              onDecline={onDecline}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
