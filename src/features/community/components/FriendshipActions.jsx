import { Check, Clock3, LoaderCircle, UserCheck, UserPlus, X } from "lucide-react";
import { isCommunityActionBusy } from "../hooks/useCommunityAction.js";

export default function FriendshipActions({
  member,
  busy,
  onConnect,
  onAccept,
  onDecline,
}) {
  if (member.relationship === "ACCEPTED") {
    return (
      <span className="community-friend-status is-friend">
        <UserCheck size={15} aria-hidden="true" /> Friends
      </span>
    );
  }

  if (member.relationship === "PENDING" && member.incomingRequest) {
    const acceptBusy = isCommunityActionBusy(busy, `accept-${member.friendshipId}`);
    const declineBusy = isCommunityActionBusy(busy, `decline-${member.friendshipId}`);
    return (
      <span className="community-friend-actions">
        <button
          className="community-friend-button is-primary"
          type="button"
          disabled={acceptBusy}
          aria-busy={acceptBusy}
          onClick={() => onAccept(member.friendshipId)}
        >
          {acceptBusy ? <LoaderCircle size={15} className="community-spinning" aria-hidden="true" /> : <Check size={15} aria-hidden="true" />} Accept
        </button>
        <button
          className="community-friend-button is-secondary"
          type="button"
          disabled={declineBusy}
          aria-busy={declineBusy}
          onClick={() => onDecline(member.friendshipId)}
        >
          {declineBusy ? <LoaderCircle size={15} className="community-spinning" aria-hidden="true" /> : <X size={15} aria-hidden="true" />} Decline
        </button>
      </span>
    );
  }

  if (member.relationship === "PENDING") {
    return (
      <span className="community-friend-status">
        <Clock3 size={14} aria-hidden="true" /> Request sent
      </span>
    );
  }

  const connectBusy = isCommunityActionBusy(busy, `connect-${member.user.id}`);
  return (
    <button
      className="community-friend-button is-primary"
      type="button"
      disabled={connectBusy}
      aria-busy={connectBusy}
      onClick={() => onConnect(member.user.id)}
    >
      {connectBusy ? <LoaderCircle size={15} className="community-spinning" aria-hidden="true" /> : <UserPlus size={15} aria-hidden="true" />} Add friend
    </button>
  );
}
