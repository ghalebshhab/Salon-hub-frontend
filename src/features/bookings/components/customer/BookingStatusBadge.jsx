import {
  BadgeCheck,
  CircleCheck,
  CircleX,
  Hourglass,
  Scissors,
  TimerOff,
  UserX,
} from "lucide-react";
import { getStatusLook } from "../../model/customerBookings.js";

const STATUS_ICONS = {
  PENDING: Hourglass,
  ACCEPTED: CircleCheck,
  IN_PROGRESS: Scissors,
  COMPLETED: BadgeCheck,
  REJECTED: CircleX,
  CANCELLED: CircleX,
  EXPIRED: TimerOff,
  NO_SHOW: UserX,
};

/** Status pill: icon + text, so the meaning never depends on color only. */
export default function BookingStatusBadge({ status }) {
  const look = getStatusLook(status);
  const Icon = STATUS_ICONS[status] || Hourglass;
  return (
    <span className={`mb-status tone-${look.tone}`}>
      <Icon size={14} aria-hidden="true" />
      {look.label}
    </span>
  );
}
