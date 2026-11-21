import { useState } from "react";
import {
  CalendarCheck2,
  Clock3,
  Copy,
  Mail,
  MapPin,
  Navigation,
  Phone,
  UsersRound,
} from "lucide-react";
import useNow from "../../../../shared/hooks/useNow.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../shared/notifications/toast.jsx";
import {
  STORY_PREVIEW_LENGTH,
  displayTime,
  hoursStatus,
  initials,
  memberSince,
  storyParagraphs,
  titleCase,
} from "../../model/salonAbout.js";

/** Short stories read better without the large first letter. */
const DROP_CAP_MIN_LENGTH = 120;

/** The person behind the salon, shown like a magazine byline. */
function OwnerCard({ salon, since }) {
  const owner = titleCase(salon.ownerName);
  if (!owner && !since) return null;
  return (
    <div className="ab-host">
      <span className="ab-host-avatar" aria-hidden="true">
        <span>{initials(owner || salon.name)}</span>
      </span>
      <div className="ab-host-copy">
        <span className="ab-host-label">Meet the owner</span>
        {owner && <strong className="ab-host-name">{owner}</strong>}
        <small>
          {owner ? "Founder and owner" : "Salon owner"}
          {since && ` · on SalonHub since ${since}`}
        </small>
      </div>
    </div>
  );
}

function SalonStory({ salon }) {
  const [expanded, setExpanded] = useState(false);
  const paragraphs = storyParagraphs(salon.description);
  const long = String(salon.description || "").length > STORY_PREVIEW_LENGTH;
  const since = memberSince(salon.createdAt);

  if (!paragraphs.length) {
    return (
      <div className="ab-story">
        <p className="ab-story-empty">
          This salon has not written its story yet. Call or email the salon to
          learn more about it.
        </p>
        <OwnerCard salon={salon} since={since} />
      </div>
    );
  }

  return (
    <div className="ab-story">
      <div
        className={[
          "ab-story-text",
          String(salon.description).length >= DROP_CAP_MIN_LENGTH &&
            "has-drop-cap",
          long && !expanded && "is-clamped",
        ]
          .filter(Boolean)
          .join(" ")}
        id="salon-story"
      >
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {long && (
        <button
          type="button"
          className="ab-link"
          aria-expanded={expanded}
          aria-controls="salon-story"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Show less" : "Read the full story"}
        </button>
      )}
      <OwnerCard salon={salon} since={since} />
    </div>
  );
}

function HoursCard({ salon }) {
  const now = useNow();
  const status = hoursStatus(salon, now);
  const open = displayTime(salon.openTime);
  const close = displayTime(salon.closeTime);

  return (
    <div className={`ab-hours tone-${status.tone}`}>
      <div className="ab-hours-head">
        <Clock3 size={18} aria-hidden="true" />
        <span>Opening hours</span>
      </div>
      <p className="ab-hours-status" aria-live="polite">
        <span className="ab-dot" aria-hidden="true" />
        <strong>{status.title}</strong>
      </p>
      <p className="ab-hours-detail">{status.detail}</p>
      {open && close && (
        <p className="ab-hours-range">
          <span>Every day</span>
          <strong>
            {open} – {close}
          </strong>
        </p>
      )}
    </div>
  );
}

/**
 * "About" on the salon page: the owner's story, live opening hours,
 * a few facts and direct ways to reach the salon.
 */
export default function SalonAbout({ salon, onOpenMap = null }) {
  const since = memberSince(salon.createdAt);
  const team = Number(salon.currentNumOfEmployees) || 0;
  const directions = onOpenMap
    ? { onClick: onOpenMap }
    : salon.googleMapsUrl
      ? { href: salon.googleMapsUrl }
      : null;

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(salon.phoneNumber);
      showSuccessToast("Phone number copied.");
    } catch {
      showErrorToast("Could not copy the number. Select it and copy it.");
    }
  };

  return (
    <div className="ab">
      <SalonStory salon={salon} />

      <div className="ab-side">
        <HoursCard salon={salon} />

        <ul className="ab-facts">
          <li>
            <UsersRound size={16} aria-hidden="true" />
            <span>
              <strong>{team}</strong>{" "}
              {team === 1 ? "professional" : "professionals"}
            </span>
          </li>
          {salon.city && (
            <li>
              <MapPin size={16} aria-hidden="true" />
              <span>{salon.city}</span>
            </li>
          )}
          {since && (
            <li>
              <CalendarCheck2 size={16} aria-hidden="true" />
              <span>Since {since}</span>
            </li>
          )}
        </ul>
      </div>

      {(salon.phoneNumber || salon.email || directions) && (
        <div className="ab-contact" role="group" aria-label="Contact the salon">
          {salon.phoneNumber && (
            <div className="ab-contact-item">
              <a className="ab-contact-main" href={`tel:${salon.phoneNumber}`}>
                <span className="ab-contact-icon" aria-hidden="true">
                  <Phone size={18} />
                </span>
                <span>
                  <small>Call</small>
                  <strong dir="ltr">{salon.phoneNumber}</strong>
                </span>
              </a>
              <button
                type="button"
                className="ab-copy"
                onClick={copyPhone}
                aria-label="Copy phone number"
              >
                <Copy size={16} aria-hidden="true" />
              </button>
            </div>
          )}
          {salon.email && (
            <div className="ab-contact-item">
              <a className="ab-contact-main" href={`mailto:${salon.email}`}>
                <span className="ab-contact-icon" aria-hidden="true">
                  <Mail size={18} />
                </span>
                <span>
                  <small>Email</small>
                  <strong>{salon.email}</strong>
                </span>
              </a>
            </div>
          )}
          {directions && (
            <div className="ab-contact-item">
              {directions.onClick ? (
                <button
                  type="button"
                  className="ab-contact-main"
                  onClick={directions.onClick}
                >
                  <span className="ab-contact-icon" aria-hidden="true">
                    <Navigation size={18} />
                  </span>
                  <span>
                    <small>Directions</small>
                    <strong>{salon.city || "See on the map"}</strong>
                  </span>
                </button>
              ) : (
                <a
                  className="ab-contact-main"
                  href={directions.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="ab-contact-icon" aria-hidden="true">
                    <Navigation size={18} />
                  </span>
                  <span>
                    <small>Directions</small>
                    <strong>{salon.city || "Open Google Maps"}</strong>
                  </span>
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
