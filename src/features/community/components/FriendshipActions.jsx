import { Check, Clock3, UserCheck, UserPlus, X } from "lucide-react";

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
        <UserCheck size={15} /> Friends
      </span>
    );
  }

  if (member.relationship === "PENDING" && member.incomingRequest) {
    const requestBusy =
      busy === `accept-${member.friendshipId}` ||
      busy === `decline-${member.friendshipId}`;
    return (
      <span className="community-friend-actions">
        <button
          className="community-friend-button is-primary"
          type="button"
          disabled={requestBusy}
          onClick={() => onAccept(member.friendshipId)}
        >
          <Check size={15} /> Accept
        </button>
        <button
          className="community-friend-button is-secondary"
          type="button"
          disabled={requestBusy}
          onClick={() => onDecline(member.friendshipId)}
        >
          <X size={15} /> Decline
        </button>
      </span>
    );
  }

  if (member.relationship === "PENDING") {
    return (
      <span className="community-friend-status">
        <Clock3 size={14} /> Request sent
      </span>
    );
  }

  return (
    <button
      className="community-friend-button is-primary"
      type="button"
      disabled={busy === `connect-${member.user.id}`}
      onClick={() => onConnect(member.user.id)}
    >
      <UserPlus size={15} /> Add friend
    </button>
  );
}
