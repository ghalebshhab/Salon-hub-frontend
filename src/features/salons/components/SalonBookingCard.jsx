import { Clock3, Expand, MapPin, Navigation, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import GoogleMapEmbed from "./GoogleMapEmbed.jsx";
import { googleMapsDirectionsLink } from "../model/jordanMapLocation.js";
import { dayTimeline, displayTime } from "../model/salonAbout.js";
import t from "../../../shared/i18n/t.js";

/** Today on a 24-hour bar: the open hours and a marker for now. */
function DayBar({ salon, now }) {
  const timeline = dayTimeline(salon, now);
  if (!timeline) return null;
  return (
    <div className="sb-day" aria-hidden="true">
      <div className="sb-day-track">
        {timeline.segments.map((segment) => (
          <span
            key={segment.left}
            className="sb-day-open"
            style={{ left: `${segment.left}%`, width: `${segment.width}%` }}
          />
        ))}
        <span className="sb-day-now" style={{ left: `${timeline.now}%` }} />
      </div>
      <div className="sb-day-scale">
        <span>{t("12 AM")}</span>
        <span>{t("12 PM")}</span>
        <span>{t("12 AM")}</span>
      </div>
    </div>
  );
}

/**
 * The sticky side card: today's status at a glance, one booking button,
 * quick call and directions, and the map.
 */
export default function SalonBookingCard({
  salon,
  status,
  now,
  primary,
  mapPoint,
  onOpenMap,
}) {
  const PrimaryIcon = primary.icon;
  const open = displayTime(salon.openTime);
  const close = displayTime(salon.closeTime);
  const directionsUrl = mapPoint
    ? googleMapsDirectionsLink(mapPoint.lat, mapPoint.lng)
    : salon.googleMapsUrl || "";

  return (
    <div className="sb">
      <div className={`sb-today tone-${status.tone}`}>
        <div className="sb-today-row">
          <span className="sb-pill">
            <span className="sh-dot" aria-hidden="true" />
            {t(status.title)}
          </span>
          {open && close && (
            <span className="sb-today-hours">
              <Clock3 size={14} aria-hidden="true" />
              {open} – {close}
            </span>
          )}
        </div>
        <p className="sb-detail">{t(status.detail)}</p>
        <DayBar salon={salon} now={now} />
      </div>

      <div className="sb-body">
        <Link
          className="btn btn-primary full-width sb-book"
          to={primary.to}
          state={primary.state}
        >
          <PrimaryIcon size={18} aria-hidden="true" />
          {t(primary.label)}
        </Link>

        {(salon.phoneNumber || directionsUrl) && (
          <div className="sb-quick">
            {salon.phoneNumber && (
              <a className="sb-quick-item" href={`tel:${salon.phoneNumber}`}>
                <Phone size={18} aria-hidden="true" />
                <span>{t("Call")}</span>
              </a>
            )}
            {directionsUrl && (
              <a
                className="sb-quick-item"
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Navigation size={18} aria-hidden="true" />
                <span>{t("Directions")}</span>
              </a>
            )}
          </div>
        )}
      </div>

      {mapPoint && (
        <button
          type="button"
          className="sb-map"
          onClick={onOpenMap}
          aria-label={t("Open the map for {name}", { name: salon.name })}
        >
          <GoogleMapEmbed
            point={mapPoint}
            interactive={false}
            title={t("Map of {name}", { name: salon.name })}
          />
          <span className="sb-map-pin" aria-hidden="true">
            <MapPin size={18} fill="currentColor" />
          </span>
          <span className="sb-map-label" aria-hidden="true">
            <span>
              <strong>
                {salon.city ? t(salon.city) : t("Salon location")}
              </strong>
              <small>{t("Tap to open the map")}</small>
            </span>
            <Expand size={16} />
          </span>
        </button>
      )}
    </div>
  );
}
