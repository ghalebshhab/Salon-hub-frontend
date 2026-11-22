import { ArrowRight, BellRing, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { COMMUNITY_ROUTES } from "../model/communityRoutes.js";
import CommunityAvatar from "./CommunityAvatar.jsx";
import CommunityProfileLink from "./CommunityProfileLink.jsx";
import FriendshipActions from "./FriendshipActions.jsx";
import t from "../../../shared/i18n/t.js";

function ProfileCard({ user, network }) {
  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.userName ||
    t("SalonHub member");
  const stat = (value) => (network.loading ? "—" : value);
  return (
    <section
      className="community-aside-card community-me"
      aria-labelledby="community-me-name"
    >
      <div className="community-me-cover" aria-hidden="true" />
      <div className="community-me-body">
        <CommunityAvatar
          name={name}
          size="large"
          imageUrl={user?.profilePictureUrl}
        />
        <h2 id="community-me-name">{name}</h2>
        {user?.userName && <p>@{user.userName}</p>}
        {user?.id && (
          <Link
            className="community-me-link"
            to={`/community/people/${user.id}`}
          >
            {t("View your profile")}
          </Link>
        )}
      </div>
      <dl className="community-me-stats">
        <div>
          <dt>{t("Friends")}</dt>
          <dd>{stat(network.friends.length)}</dd>
        </div>
        <div>
          <dt>{t("Following")}</dt>
          <dd>{stat(network.followedSalons.length)}</dd>
        </div>
        <div>
          <dt>{t("Requests")}</dt>
          <dd>{stat(network.requests.length)}</dd>
        </div>
      </dl>
    </section>
  );
}

function RequestsNudge({ count }) {
  return (
    <Link
      className="community-aside-card community-nudge"
      to={COMMUNITY_ROUTES.requests}
    >
      <span className="community-nudge-icon" aria-hidden="true">
        <BellRing />
      </span>
      <span>
        <strong>
          {t("{count} friend", { count })}{" "}
          {count === 1 ? t("request") : t("requests")}
        </strong>
        <small>{t("Review and respond")}</small>
      </span>
      <ArrowRight className="community-nudge-arrow" aria-hidden="true" />
    </Link>
  );
}

function Suggestions({ network }) {
  const suggestions = network.people
    .filter((member) => member.relationship !== "ACCEPTED")
    .slice(0, 3);
  if (network.peopleLoading || !suggestions.length) return null;
  return (
    <section
      className="community-aside-card"
      aria-labelledby="community-suggestions-title"
    >
      <header className="community-aside-heading">
        <h2 id="community-suggestions-title">
          <UserPlus aria-hidden="true" /> {t("People you may know")}
        </h2>
        <Link to={COMMUNITY_ROUTES.discover}>{t("See all")}</Link>
      </header>
      <ul className="community-suggestion-list">
        {suggestions.map((member) => (
          <li key={member.user.id}>
            <CommunityProfileLink user={member.user} size="small" />
            <FriendshipActions
              member={member}
              busy={network.busyAction}
              onConnect={network.connect}
              onAccept={network.accept}
              onDecline={network.decline}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Context rail beside the active section: who you are, what needs your
 * attention, and who to connect with. It never repeats the active section.
 */
export default function CommunityAside({ user, network, section }) {
  const requestCount = network.loading ? 0 : network.requests.length;
  return (
    <aside className="community-v2-aside" aria-label={t("Your community")}>
      <ProfileCard user={user} network={network} />
      {requestCount > 0 && section !== "requests" && (
        <RequestsNudge count={requestCount} />
      )}
      {section !== "discover" && <Suggestions network={network} />}
    </aside>
  );
}
