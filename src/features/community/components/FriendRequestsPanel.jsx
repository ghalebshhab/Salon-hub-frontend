import { Check, LoaderCircle, UserRoundPlus, X } from "lucide-react";
import CommunityProfileLink from "./CommunityProfileLink.jsx";
import { isCommunityActionBusy } from "../hooks/useCommunityAction.js";

export default function FriendRequestsPanel({ requests, busy, loading = false, onAccept, onDecline }) {
  return (
    <section
      className="community-panel community-requests-panel"
      id="friend-requests"
      tabIndex={-1}
      aria-labelledby="friend-requests-title"
    >
      <header className="community-panel-heading">
        <h2 id="friend-requests-title">Friend requests</h2>
        <span
          className={requests.length ? "community-request-count is-active" : "community-request-count"}
          role="status"
          aria-label={loading ? "Checking pending requests" : `${requests.length} pending requests`}
        >
          {loading ? "—" : requests.length}
        </span>
      </header>
      {loading ? (
        <p className="community-network-loading" role="status">Checking for new requests…</p>
      ) : requests.length ? (
        <ul className="community-request-list">
          {requests.map((request) => {
            const acceptBusy = isCommunityActionBusy(busy, `accept-${request.id}`);
            const declineBusy = isCommunityActionBusy(busy, `decline-${request.id}`);
            return (
              <li className="community-request-row" key={request.id}>
                <CommunityProfileLink user={request.user} size="small" />
                <span className="community-friend-actions">
                  <button
                    className="community-friend-button is-primary"
                    type="button"
                    disabled={acceptBusy}
                    aria-busy={acceptBusy}
                    onClick={() => onAccept(request.id)}
                  >
                    {acceptBusy ? <LoaderCircle size={15} className="community-spinning" aria-hidden="true" /> : <Check size={15} aria-hidden="true" />} Accept
                  </button>
                  <button
                    className="community-friend-button is-secondary"
                    type="button"
                    disabled={declineBusy}
                    aria-busy={declineBusy}
                    onClick={() => onDecline(request.id)}
                  >
                    {declineBusy ? <LoaderCircle size={15} className="community-spinning" aria-hidden="true" /> : <X size={15} aria-hidden="true" />} Decline
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="community-request-empty">
          <UserRoundPlus size={18} aria-hidden="true" />
          <p>You&apos;re all caught up. New requests will appear here.</p>
        </div>
      )}
    </section>
  );
}
