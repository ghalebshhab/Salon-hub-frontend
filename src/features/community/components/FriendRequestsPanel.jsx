import CommunityProfileLink from "./CommunityProfileLink.jsx";

export default function FriendRequestsPanel({
  requests,
  busy,
  onAccept,
  onDecline,
}) {
  if (!requests.length) return null;
  return (
    <section className="community-panel">
      <header>
        <h2>Friend requests</h2>
        <span>{requests.length}</span>
      </header>
      {requests.map((request) => (
        <div className="community-person-row" key={request.id}>
          <CommunityProfileLink user={request.user} size="small" />
          <span className="community-friend-actions">
            <button
              className="community-friend-button is-primary"
              type="button"
              disabled={
                busy === `accept-${request.id}` ||
                busy === `decline-${request.id}`
              }
              onClick={() => onAccept(request.id)}
            >
              Accept
            </button>
            <button
              className="community-friend-button is-secondary"
              type="button"
              disabled={
                busy === `accept-${request.id}` ||
                busy === `decline-${request.id}`
              }
              onClick={() => onDecline(request.id)}
            >
              Decline
            </button>
          </span>
        </div>
      ))}
    </section>
  );
}
