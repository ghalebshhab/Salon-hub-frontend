import { useEffect, useRef, useState } from "react";
import { BellRing, MapPinned, Navigation, Radio } from "lucide-react";
import useBookingTracking from "../../hooks/useBookingTracking.js";
import useDeparturePlan from "../../hooks/useDeparturePlan.js";
import useTripSharing from "../../hooks/useTripSharing.js";
import { formatDistance, toHourMinute } from "../../model/booking.js";
import {
  TRAFFIC_LABELS,
  formatClockTime,
  formatCountdown,
  liveStep,
  parseLocalTime,
} from "../../model/departurePlan.js";
import { googleMapsDirectionsLink } from "../../../salons/model/jordanMapLocation.js";
import ServiceProgress from "./ServiceProgress.jsx";
import useI18n from "../../../../shared/i18n/useI18n.js";
import i18nT from "../../../../shared/i18n/t.js";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const COUNTDOWN_WINDOW_MS = 11 * MINUTE;

/** The current time on the server's clock; ticks every second only near the leave time. */
function useServerNow(offset, leaveAt) {
  const [now, setNow] = useState(() => Date.now() + offset);
  const everySecond = leaveAt != null && leaveAt - now < COUNTDOWN_WINDOW_MS;
  useEffect(() => {
    const update = () => setNow(Date.now() + offset);
    const first = window.setTimeout(update, 0);
    const timer = window.setInterval(
      update,
      everySecond ? SECOND : 30 * SECOND,
    );
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, [offset, everySecond]);
  return now;
}

/** A browser alert while the page is open, once per booking and step. */
function useLeaveAlert(bookingId, step, plan) {
  const sentRef = useRef(new Set());
  useEffect(() => {
    if (!plan?.alertsOn || (step !== "soon" && step !== "now")) return;
    if (!("Notification" in window) || Notification.permission !== "granted")
      return;
    const key = `leave-alert:${bookingId}:${step}`;
    if (sentRef.current.has(key)) return;
    sentRef.current.add(key);
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      // Storage can be blocked; the in-memory set still stops repeats.
    }
    try {
      new Notification(`${plan.salonName}: time to go`, {
        body:
          step === "now"
            ? i18nT("Leave now to arrive at {clockTime}.", {
                clockTime: formatClockTime(plan.arriveBy),
              })
            : i18nT("Get ready: leave at {clockTime}.", {
                clockTime: formatClockTime(plan.leaveAt),
              }),
        tag: key,
      });
    } catch {
      // Some mobile browsers allow alerts only from a service worker.
    }
  }, [bookingId, step, plan]);
}

/** The one big answer and one short sentence for each step. */
function statusText({ step, plan, tracking, now, t }) {
  const turn =
    formatClockTime(plan?.expectedStartAt) ||
    toHourMinute(tracking.bookingTime);
  const leaveAt = parseLocalTime(plan?.leaveAt);
  switch (step) {
    case "service":
      return { title: t("In the chair"), text: t("Enjoy your visit.") };
    case "arrived":
      return {
        title: t("You're checked in"),
        text: t("The salon knows you are here. Your turn is at about {turn}.", {
          turn,
        }),
      };
    case "on-the-way":
      return {
        title:
          tracking.etaMinutes == null
            ? t("On your way")
            : tracking.etaMinutes === 0
              ? t("Arriving now")
              : t("{minutes} min away", { minutes: tracking.etaMinutes }),
        text: t("The salon sees that you are coming."),
      };
    case "late":
      return {
        title: t("Leave now"),
        text: t(
          "You are {minutes} min late to leave. Tap “I'm on my way” so the salon knows.",
          {
            minutes: Math.max(1, Math.round((now - leaveAt) / MINUTE)),
          },
        ),
      };
    case "now":
      return {
        title: t("Leave now"),
        text: t("You arrive at {time}, in time for your turn.", {
          time: formatClockTime(plan.arriveBy),
        }),
      };
    case "soon":
      return {
        title: t("Leave in {time}", {
          time: formatCountdown(leaveAt - now, t),
        }),
        text: t("Get ready. Leave at {time}.", {
          time: formatClockTime(plan.leaveAt),
        }),
      };
    case "wait":
      return {
        title: t("Leave at {time}", { time: formatClockTime(plan.leaveAt) }),
        text: t("That is in {time}. We will send you an alert.", {
          time: formatCountdown(leaveAt - now, t),
        }),
      };
    default:
      return {
        title: t("Your turn ≈ {time}", { time: turn }),
        text: t(
          "Want an alert when it is time to leave? We check the queue and the traffic for you.",
        ),
      };
  }
}

function Fact({ label, value, note, tone }) {
  return (
    <div className="lt-fact">
      <dt>{i18nT(label)}</dt>
      <dd>
        <strong>{value}</strong>
        {note && (
          <span className={tone ? `is-${tone}` : undefined}>{i18nT(note)}</span>
        )}
      </dd>
    </div>
  );
}

function Facts({ step, plan, tracking }) {
  const { t } = useI18n();
  const awaiting = tracking.employeeState === "AWAITING_EMPLOYEE";
  const late = plan?.delayMinutes > 0;
  const turn =
    formatClockTime(plan?.expectedStartAt) ||
    toHourMinute(tracking.bookingTime);

  let drive = { value: "—", note: t("Alerts off") };
  if (step === "on-the-way") {
    drive = {
      value:
        tracking.etaMinutes == null
          ? "—"
          : t("{minutes} min", { minutes: tracking.etaMinutes }),
      note:
        tracking.distanceMeters == null
          ? t("Sharing")
          : formatDistance(tracking.distanceMeters),
    };
  } else if (plan?.travelMinutes != null) {
    drive = {
      value: t("{minutes} min", { minutes: plan.travelMinutes }),
      note:
        plan.travelSource === "GOOGLE_TRAFFIC" && plan.trafficLevel
          ? t(TRAFFIC_LABELS[plan.trafficLevel])
          : t("No live traffic"),
      tone: plan.trafficLevel === "HEAVY" ? "late" : undefined,
    };
  }

  return (
    <dl className="lt-facts">
      <Fact
        label={t("Your turn")}
        value={turn}
        note={
          awaiting
            ? t("Choosing your pro")
            : late
              ? t("{minutes} min late", { minutes: plan.delayMinutes })
              : t("On time")
        }
        tone={late ? "late" : "ok"}
      />
      <Fact
        label={t("Drive")}
        value={drive.value}
        note={drive.note}
        tone={drive.tone}
      />
      <Fact
        label={t("Before you")}
        value={
          awaiting || plan?.confidence === "SCHEDULED"
            ? "—"
            : (plan?.clientsAhead ?? "—")
        }
        note={t(plan?.clientsAhead === 1 ? "client" : "clients")}
      />
    </dl>
  );
}

/**
 * Live panel on the customer's booking for today. One status, three facts
 * (your turn, drive, clients before you) and one main button for the next step.
 */
export default function CustomerLiveCard({ booking }) {
  const { tracking, error, busy, run } = useBookingTracking(booking.id);
  const trip = useTripSharing(booking.id, tracking, run);
  const departure = useDeparturePlan(booking.id);
  const { t } = useI18n();
  const { plan } = departure;

  const now = useServerNow(
    departure.clockOffset,
    parseLocalTime(plan?.leaveAt),
  );
  const step = liveStep(tracking, plan, now);
  useLeaveAlert(booking.id, step, plan);

  if (!tracking) {
    return (
      <div className="live-card is-loading" aria-busy="true">
        <span className="skeleton-block" />
      </div>
    );
  }
  if (step === "done") {
    return null;
  }

  const { title, text } = statusText({ step, plan, tracking, now, t });
  const directions =
    booking.salonLatitude != null && booking.salonLongitude != null
      ? googleMapsDirectionsLink(booking.salonLatitude, booking.salonLongitude)
      : null;
  const beforeTrip = ["off", "wait", "soon", "now", "late"].includes(step);
  const working = busy || departure.busy;
  const message = trip.locationNote || error || departure.error;

  return (
    <section
      className={`live-card lt is-${step}`}
      aria-label={t("Live appointment status")}
    >
      <header className="lt-head">
        <span className="lt-live">
          <Radio size={12} aria-hidden="true" />{" "}
          {t("Live · booked for {time}", {
            time: toHourMinute(tracking.bookingTime),
          })}
        </span>
        {plan?.alertsOn && beforeTrip && (
          <span className="lt-alerts">
            <BellRing size={12} aria-hidden="true" /> {t("Alerts on")}
          </span>
        )}
      </header>

      <div className="lt-status">
        <p className="lt-title" aria-hidden={step === "soon" || undefined}>
          {i18nT(title)}
        </p>
        <p className="lt-text" aria-live="polite">
          {step === "soon" && (
            <span className="sr-only">
              {t("Leave at {time}", { time: formatClockTime(plan.leaveAt) })}
              .{" "}
            </span>
          )}
          {i18nT(text)}
        </p>
      </div>

      {step === "service" ? (
        <ServiceProgress tracking={tracking} who={i18nT("Your")} />
      ) : (
        <Facts step={step} plan={plan} tracking={tracking} />
      )}

      {beforeTrip && (
        <div className="lt-actions">
          {step === "off" ? (
            <button
              className="btn btn-primary"
              type="button"
              disabled={working}
              onClick={departure.turnOn}
            >
              <BellRing size={17} aria-hidden="true" />{" "}
              {t("Tell me when to leave")}
            </button>
          ) : (
            <button
              className="btn btn-primary"
              type="button"
              disabled={working || !tracking.canShareJourney}
              onClick={trip.startTrip}
            >
              <Navigation size={17} aria-hidden="true" /> {t("I'm on my way")}
            </button>
          )}
          {step === "off" && tracking.canShareJourney && (
            <button
              className="lt-link"
              type="button"
              disabled={working}
              onClick={trip.startTrip}
            >
              {t("I'm already on my way")}
            </button>
          )}
          {step !== "off" && (
            <button
              className="lt-link"
              type="button"
              disabled={working}
              onClick={departure.turnOff}
            >
              {t("Turn off alerts")}
            </button>
          )}
        </div>
      )}

      {step === "on-the-way" && (
        <div className="lt-actions">
          <button
            className="btn btn-primary"
            type="button"
            disabled={working}
            onClick={trip.arrived}
          >
            <MapPinned size={17} aria-hidden="true" /> {t("I've arrived")}
          </button>
          <button
            className="lt-link"
            type="button"
            disabled={working}
            onClick={trip.stopTrip}
          >
            {t("Stop sharing")}
          </button>
        </div>
      )}

      {message && (
        <p className="live-note" role="status">
          {message}
        </p>
      )}

      {(beforeTrip || step === "on-the-way") && (
        <footer className="lt-foot">
          {step === "off" ? (
            <small>
              {t("We use your place only for the drive time. Only you see it.")}
            </small>
          ) : (
            <small>
              {t("Times update every minute with the queue and the traffic.")}
            </small>
          )}
          {directions && (
            <a
              className="lt-link"
              href={directions}
              target="_blank"
              rel="noreferrer"
            >
              <Navigation size={13} aria-hidden="true" /> {t("Directions")}
            </a>
          )}
        </footer>
      )}
    </section>
  );
}
