import { Check, LoaderCircle, UserRoundPlus, X } from "lucide-react";
import CommunityProfileLink from "./CommunityProfileLink.jsx";
import { isCommunityActionBusy } from "../hooks/useCommunityAction.js";
import t from "../../../shared/i18n/t.js";

export default function FriendRequestsPanel({
  requests,
  busy,
  loading = false,
  onAccept,
  onDecline,
}) {
  return (
    <section
      className="community-panel community-requests-panel"
      id="friend-requests"
      tabIndex={-1}
      aria-labelledby="friend-requests-title"
    >
      <header className="community-panel-heading">
        <h2 id="friend-requests-title">{t("Friend requests")}</h2>
        <span
          className={
            requests.length
              ? "community-request-count is-active"
              : "community-request-count"
          }
          role="status"
          aria-label={
            loading
              ? t("Checking pending requests")
              : t("{length} pending requests", { length: requests.length })
          }
        >
          {loading ? "—" : requests.length}
        </span>
      </header>
      {loading ? (
        <p className="community-network-loading" role="status">
          {t("Checking for new requests…")}
        </p>
      ) : requests.length ? (
        <ul className="community-request-list">
          {requests.map((request) => {
            const acceptBusy = isCommunityActionBusy(
              busy,
              `accept-${request.id}`,
            );
            const declineBusy = isCommunityActionBusy(
              busy,
              `decline-${request.id}`,
            );
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
                    {acceptBusy ? (
                      <LoaderCircle
                        size={15}
                        className="community-spinning"
                        aria-hidden="true"
                      />
                    ) : (
                      <Check size={15} aria-hidden="true" />
                    )}{" "}
                    {t("Accept")}
                  </button>
                  <button
                    className="community-friend-button is-secondary"
                    type="button"
                    disabled={declineBusy}
                    aria-busy={declineBusy}
                    onClick={() => onDecline(request.id)}
                  >
                    {declineBusy ? (
                      <LoaderCircle
                        size={15}
                        className="community-spinning"
                        aria-hidden="true"
                      />
                    ) : (
                      <X size={15} aria-hidden="true" />
                    )}{" "}
                    {t("Decline")}
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="community-request-empty">
          <UserRoundPlus size={18} aria-hidden="true" />
          <p>{t("You're all caught up. New requests will appear here.")}</p>
        </div>
      )}
    </section>
  );
}
