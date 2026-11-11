import {
  Check,
  Clock3,
  LoaderCircle,
  UserCheck,
  UserPlus,
  UserRoundX,
  X,
} from "lucide-react";
import { isCommunityActionBusy } from "../hooks/useCommunityAction.js";

const BusyIcon = () => (
  <LoaderCircle className="community-spinning" size={16} aria-hidden="true" />
);

export default function CommunityProfileActions({
  member,
  busy,
  onConnect,
  onAccept,
  onDecline,
  onRemove,
}) {
  if (member.relationship === "ACCEPTED") {
    const removing = isCommunityActionBusy(
      busy,
      `remove-${member.friendshipId}`,
    );
    return (
      <div className="community-profile-actions">
        <span className="community-profile-connection is-connected">
          <UserCheck size={17} aria-hidden="true" /> Friends
        </span>
        <button
          className="community-profile-secondary-action"
          type="button"
          disabled={removing}
          onClick={() => onRemove(member.friendshipId)}
        >
          {removing ? <BusyIcon /> : <UserRoundX size={16} />}
          Remove
        </button>
      </div>
    );
  }

  if (member.relationship === "PENDING" && member.incomingRequest) {
    const accepting = isCommunityActionBusy(
      busy,
      `accept-${member.friendshipId}`,
    );
    const declining = isCommunityActionBusy(
      busy,
      `decline-${member.friendshipId}`,
    );
    return (
      <div className="community-profile-actions">
        <button
          className="community-profile-primary-action"
          type="button"
          disabled={accepting}
          onClick={() => onAccept(member.friendshipId)}
        >
          {accepting ? <BusyIcon /> : <Check size={16} />}
          Accept request
        </button>
        <button
          className="community-profile-secondary-action"
          type="button"
          disabled={declining}
          onClick={() => onDecline(member.friendshipId)}
        >
          {declining ? <BusyIcon /> : <X size={16} />}
          Decline
        </button>
      </div>
    );
  }

  if (member.relationship === "PENDING") {
    const canceling = isCommunityActionBusy(
      busy,
      `remove-${member.friendshipId}`,
    );
    return (
      <div className="community-profile-actions">
        <span className="community-profile-connection">
          <Clock3 size={16} aria-hidden="true" /> Request sent
        </span>
        <button
          className="community-profile-secondary-action"
          type="button"
          disabled={canceling}
          onClick={() => onRemove(member.friendshipId)}
        >
          {canceling ? <BusyIcon /> : <X size={16} />}
          Cancel
        </button>
      </div>
    );
  }

  const connecting = isCommunityActionBusy(
    busy,
    `connect-${member.user.id}`,
  );
  return (
    <div className="community-profile-actions">
      <button
        className="community-profile-primary-action"
        type="button"
        disabled={connecting}
        onClick={() => onConnect(member.user.id)}
      >
        {connecting ? <BusyIcon /> : <UserPlus size={16} />}
        Add friend
      </button>
    </div>
  );
}
