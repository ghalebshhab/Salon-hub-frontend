import {
  CheckCircle2,
  Clock3,
  MapPinned,
  Navigation,
  Radio,
  Sparkles,
  UserRound,
} from "lucide-react";
import useBookingTracking from "../../hooks/useBookingTracking.js";
import useTripSharing from "../../hooks/useTripSharing.js";
import {
  formatClock,
  formatDistance,
  toHourMinute,
} from "../../model/booking.js";
import { googleMapsDirectionsLink } from "../../../salons/model/jordanMapLocation.js";
import LiveTimeline from "./LiveTimeline.jsx";
import ServiceProgress from "./ServiceProgress.jsx";

function EmployeeLine({ tracking }) {
  const name = tracking.employeeName || "Your professional";
  switch (tracking.employeeState) {
    case "AWAITING_EMPLOYEE":
      return (
        <p className="live-line">
          <Sparkles size={16} aria-hidden="true" />
          The salon is choosing your professional.
        </p>
      );
    case "BUSY_WITH_ANOTHER_CLIENT":
      return (
        <p className="live-line is-wait">
          <Clock3 size={16} aria-hidden="true" />
          <span>
            <strong>{name}</strong> is finishing another client
            {tracking.employeeBusyUntil
              ? ` and should be free around ${formatClock(tracking.employeeBusyUntil)}.`
              : "."}
          </span>
        </p>
      );
    case "SERVING_YOU":
      return null;
    case "FINISHED":
      return (
        <p className="live-line is-done">
          <CheckCircle2 size={16} aria-hidden="true" />
          All done. Thank you for visiting!
        </p>
      );
    default:
      return (
        <p className="live-line is-ready">
          <UserRound size={16} aria-hidden="true" />
          <span>
            <strong>{name}</strong> is ready for you.
          </span>
        </p>
      );
  }
}

/** Live panel on the customer's booking for today. */
export default function CustomerLiveCard({ booking }) {
  const { tracking, error, busy, run } = useBookingTracking(booking.id);
  const trip = useTripSharing(booking.id, tracking, run);

  if (!tracking) {
    return (
      <div className="live-card is-loading" aria-busy="true">
        <span className="skeleton-block" />
      </div>
    );
  }

  const directions =
    booking.salonLatitude != null && booking.salonLongitude != null
      ? googleMapsDirectionsLink(booking.salonLatitude, booking.salonLongitude)
      : null;
  const journey = tracking.journeyStatus;
  const accepted = tracking.status === "ACCEPTED";

  const act = (action) => action();

  return (
    <section className="live-card" aria-label="Live appointment status">
      <header className="live-card-head">
        <span className="live-pill">
          <Radio size={13} aria-hidden="true" /> Live today ·{" "}
          {toHourMinute(tracking.bookingTime)}
        </span>
      </header>

      <LiveTimeline tracking={tracking} />
      <EmployeeLine tracking={tracking} />

      {tracking.status === "IN_PROGRESS" && (
        <ServiceProgress tracking={tracking} who="Your" />
      )}

      {accepted && journey === "NOT_STARTED" && (
        <div className="live-journey">
          {tracking.canShareJourney ? (
            <>
              <button
                className="btn btn-primary"
                type="button"
                disabled={busy}
                onClick={() => act(trip.startTrip)}
              >
                <Navigation size={17} aria-hidden="true" /> I'm on my way
              </button>
              <small>
                Your live location goes only to {tracking.salonName}, and only
                until you arrive.
              </small>
            </>
          ) : (
            <small>
              You can share your trip from 3 hours before your appointment.
            </small>
          )}
        </div>
      )}

      {accepted && journey === "ON_THE_WAY" && (
        <div className="live-journey is-active">
          <div className="live-eta">
            <strong>
              {tracking.etaMinutes != null
                ? tracking.etaMinutes === 0
                  ? "Arriving now"
                  : `About ${tracking.etaMinutes} min away`
                : "On the way"}
            </strong>
            {tracking.distanceMeters != null && (
              <span>
                {formatDistance(tracking.distanceMeters)} from the salon
              </span>
            )}
          </div>
          <div className="live-actions">
            <button
              className="btn btn-primary btn-small"
              type="button"
              disabled={busy}
              onClick={() => act(trip.arrived)}
            >
              <MapPinned size={15} aria-hidden="true" /> I've arrived
            </button>
            <button
              className="btn btn-secondary btn-small"
              type="button"
              disabled={busy}
              onClick={() => act(trip.stopTrip)}
            >
              Stop sharing
            </button>
          </div>
        </div>
      )}

      {accepted && journey === "ARRIVED" && (
        <p className="live-line is-done">
          <MapPinned size={16} aria-hidden="true" />
          You're checked in. The salon knows you're here.
        </p>
      )}

      {(trip.locationNote || error) && (
        <p className="live-note" role="status">
          {trip.locationNote || error}
        </p>
      )}

      {directions && accepted && journey !== "ARRIVED" && (
        <a
          className="live-link"
          href={directions}
          target="_blank"
          rel="noreferrer"
        >
          <Navigation size={14} aria-hidden="true" /> Directions in Google Maps
        </a>
      )}
    </section>
  );
}
