import {
  CheckCircle2,
  Clock3,
  MapPinned,
  Navigation,
  Phone,
  Play,
  Plus,
  Radio,
} from "lucide-react";
import { useState } from "react";
import useBookingTracking from "../../hooks/useBookingTracking.js";
import {
  completeServiceApi,
  extendServiceApi,
  startServiceApi,
} from "../../api/bookingApi.js";
import {
  formatClock,
  formatDistance,
  toHourMinute,
} from "../../model/booking.js";
import { googleMapsRouteLink } from "../../../salons/model/jordanMapLocation.js";
import ConfirmDialog from "../../../../shared/components/ConfirmDialog.jsx";
import { showSuccessToast } from "../../../../shared/notifications/toast.jsx";
import LiveTimeline from "./LiveTimeline.jsx";
import ServiceProgress from "./ServiceProgress.jsx";

function secondsAgo(from, now) {
  if (!from || !now) return null;
  return Math.max(0, Math.round((new Date(now) - new Date(from)) / 1000));
}

function agoLabel(seconds) {
  if (seconds == null) return "";
  if (seconds < 60) return `${seconds} s ago`;
  return `${Math.round(seconds / 60)} min ago`;
}

function CustomerJourney({ tracking }) {
  if (tracking.journeyStatus === "ARRIVED") {
    return (
      <div className="live-journey is-arrived">
        <MapPinned size={18} aria-hidden="true" />
        <div>
          <strong>Customer arrived</strong>
          <span>Checked in at {formatClock(tracking.arrivedAt)}</span>
        </div>
      </div>
    );
  }
  if (tracking.journeyStatus === "ON_THE_WAY") {
    const ago = secondsAgo(tracking.locationUpdatedAt, tracking.serverTime);
    const route =
      tracking.customerLatitude != null && tracking.salonLatitude != null
        ? googleMapsRouteLink(
            { lat: tracking.customerLatitude, lng: tracking.customerLongitude },
            { lat: tracking.salonLatitude, lng: tracking.salonLongitude },
          )
        : null;
    return (
      <div className="live-journey is-active">
        <div className="live-eta">
          <strong>
            {tracking.etaMinutes != null
              ? `${tracking.etaMinutes} min away`
              : "On the way"}
          </strong>
          <span>
            {[
              tracking.distanceMeters != null &&
                formatDistance(tracking.distanceMeters),
              tracking.expectedArrivalAt &&
                `arrives about ${formatClock(tracking.expectedArrivalAt)}`,
              ago != null && `updated ${agoLabel(ago)}`,
            ]
              .filter(Boolean)
              .join(" · ") || "Location not shared"}
          </span>
        </div>
        {route && (
          <a
            className="live-link"
            href={route}
            target="_blank"
            rel="noreferrer"
          >
            <Navigation size={14} aria-hidden="true" /> Live route and traffic
            in Google Maps
          </a>
        )}
        <small className="live-hint">
          ETA is estimated from distance. Google Maps shows the exact drive
          time.
        </small>
      </div>
    );
  }
  return (
    <div className="live-journey">
      <Clock3 size={18} aria-hidden="true" />
      <div>
        <strong>Not on the way yet</strong>
        <span>You will see the ETA when the customer starts the trip.</span>
      </div>
    </div>
  );
}

/** Live panel for the assigned employee and the salon owner. */
export default function StaffLiveCard({ booking, onStatusChange }) {
  const { tracking, error, busy, run } = useBookingTracking(booking.id);
  const [confirmComplete, setConfirmComplete] = useState(false);

  if (!tracking) {
    return (
      <div className="live-card is-loading" aria-busy="true">
        <span className="skeleton-block" />
      </div>
    );
  }

  const act = async (apiCall, success) => {
    const result = await run(apiCall);
    if (result.ok) {
      if (success) showSuccessToast(success);
      onStatusChange?.();
    }
    return result;
  };

  const complete = async () => {
    await act(
      () => completeServiceApi(booking.id),
      "Service completed. The customer was notified.",
    );
    setConfirmComplete(false);
  };

  return (
    <section
      className="live-card is-staff"
      aria-label="Live appointment status"
    >
      <header className="live-card-head">
        <span className="live-pill">
          <Radio size={13} aria-hidden="true" /> Live today ·{" "}
          {toHourMinute(tracking.bookingTime)}
        </span>
        {tracking.customerPhoneNumber && (
          <a className="live-call" href={`tel:${tracking.customerPhoneNumber}`}>
            <Phone size={14} aria-hidden="true" /> Call {tracking.customerName}
          </a>
        )}
      </header>

      <LiveTimeline tracking={tracking} />

      {tracking.status === "ACCEPTED" && (
        <CustomerJourney tracking={tracking} />
      )}

      {tracking.status === "IN_PROGRESS" && (
        <>
          <ServiceProgress tracking={tracking} who={tracking.customerName} />
          <div className="live-actions">
            <button
              className="btn btn-secondary btn-small"
              type="button"
              disabled={busy}
              onClick={() => run(() => extendServiceApi(booking.id, 10))}
            >
              <Plus size={15} aria-hidden="true" /> 10 min
            </button>
            <button
              className="btn btn-primary btn-small"
              type="button"
              disabled={busy}
              onClick={() => setConfirmComplete(true)}
            >
              <CheckCircle2 size={15} aria-hidden="true" /> Complete service
            </button>
          </div>
        </>
      )}

      {tracking.status === "ACCEPTED" && (
        <div className="live-actions">
          <button
            className="btn btn-primary btn-small"
            type="button"
            disabled={busy || !tracking.canStartService}
            onClick={() =>
              act(
                () => startServiceApi(booking.id),
                "Service started. The customer can follow it live.",
              )
            }
          >
            <Play size={15} aria-hidden="true" /> Start service
          </button>
          {!tracking.canStartService && (
            <small className="live-hint">
              You can start up to 1 hour before{" "}
              {toHourMinute(tracking.bookingTime)}.
            </small>
          )}
        </div>
      )}

      {tracking.status === "COMPLETED" && (
        <p className="live-line is-done">
          <CheckCircle2 size={16} aria-hidden="true" /> Completed at{" "}
          {formatClock(tracking.completedAt)}
        </p>
      )}

      {error && (
        <p className="live-note" role="alert">
          {error}
        </p>
      )}

      <ConfirmDialog
        open={confirmComplete}
        title="Complete this service?"
        message={`${tracking.customerName} will be asked to leave a review.`}
        confirmText="Complete"
        loading={busy}
        onConfirm={complete}
        onCancel={() => setConfirmComplete(false)}
      />
    </section>
  );
}
