import { RotateCw } from "lucide-react";
import CommunityProfileLink from "./CommunityProfileLink.jsx";
import FriendshipActions from "./FriendshipActions.jsx";

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
  if (loading) {
    return <p className="community-discovery-message">Finding people in the community…</p>;
  }
  if (error) {
    return (
      <div className="community-discovery-message is-error" role="alert">
        <span>We couldn&apos;t load people right now.</span>
        <button type="button" onClick={onRetry}>
          <RotateCw size={15} aria-hidden="true" /> Try again
        </button>
      </div>
    );
  }
  if (!people.length) {
    return (
      <p className="community-discovery-message">
        {search
          ? "No people found. Try a different name or username."
          : "No suggestions yet. Search by name or username to find your people."}
      </p>
    );
  }

  return (
    <>
      <p className="community-discovery-caption">
        {search ? "Search results" : "Suggested professionals"}
      </p>
      <ul className="community-people-grid">
        {people.map((member) => (
          <li className="community-person-row" key={member.user.id}>
            <CommunityProfileLink user={member.user} size="small" />
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
