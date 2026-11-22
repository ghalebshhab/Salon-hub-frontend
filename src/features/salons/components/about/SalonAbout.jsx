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
import { Link } from "react-router-dom";
import useNow from "../../../../shared/hooks/useNow.js";
import { memberProfilePath } from "../../../community/model/communityRoutes.js";
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
import t from "../../../../shared/i18n/t.js";
import { salonDescription } from "../../model/salonPage.js";

/** Short stories read better without the large first letter. */
const DROP_CAP_MIN_LENGTH = 120;

/**
 * The person behind the salon, shown like a magazine byline. The whole
 * card opens the owner's profile when the salon sends the owner id.
 */
function OwnerCard({ salon, since }) {
  const owner = titleCase(salon.ownerName);
  if (!owner && !since) return null;
  const content = (
    <>
      <span className="ab-host-avatar" aria-hidden="true">
        <span>{initials(owner || salon.name)}</span>
      </span>
      <span className="ab-host-copy">
        <span className="ab-host-label">{t("Meet the founder")}</span>
        {owner && <strong className="ab-host-name">{owner}</strong>}
        <small>
          {t("Founder and owner")}
          {since && t(" · on SalonHub since {since}", { since })}
        </small>
      </span>
    </>
  );

  if (!salon.ownerId) return <div className="ab-host">{content}</div>;
  return (
    <Link
      className="ab-host is-link"
      to={memberProfilePath(salon.ownerId)}
      aria-label={t("View {value}'s profile", {
        value: owner || t("the owner"),
      })}
    >
      {content}
    </Link>
  );
}

function SalonStory({ salon }) {
  const [expanded, setExpanded] = useState(false);
  const story = salonDescription(salon);
  const paragraphs = storyParagraphs(story);
  const long = String(story || "").length > STORY_PREVIEW_LENGTH;
  const since = memberSince(salon.createdAt);

  if (!paragraphs.length) {
    return (
      <div className="ab-story">
        <p className="ab-story-empty">
          {t(
            "This salon has not written its story yet. Call or email the salon to learn more about it.",
          )}
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
          String(story).length >= DROP_CAP_MIN_LENGTH && "has-drop-cap",
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
          {expanded ? t("Show less") : t("Read the full story")}
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
        <span>{t("Opening hours")}</span>
      </div>
      <p className="ab-hours-status" aria-live="polite">
        <span className="ab-dot" aria-hidden="true" />
        <strong>{t(status.title)}</strong>
      </p>
      <p className="ab-hours-detail">{t(status.detail)}</p>
      {open && close && (
        <p className="ab-hours-range">
          <span>{t("Every day")}</span>
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
      showSuccessToast(t("Phone number copied."));
    } catch {
      showErrorToast(t("Could not copy the number. Select it and copy it."));
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
              {team === 1 ? t("professional") : t("professionals")}
            </span>
          </li>
          {salon.city && (
            <li>
              <MapPin size={16} aria-hidden="true" />
              <span>{t(salon.city)}</span>
            </li>
          )}
          {since && (
            <li>
              <CalendarCheck2 size={16} aria-hidden="true" />
              <span>{t("Since {since}", { since })}</span>
            </li>
          )}
        </ul>
      </div>

      {(salon.phoneNumber || salon.email || directions) && (
        <div
          className="ab-contact"
          role="group"
          aria-label={t("Contact the salon")}
        >
          {salon.phoneNumber && (
            <div className="ab-contact-item">
              <a className="ab-contact-main" href={`tel:${salon.phoneNumber}`}>
                <span className="ab-contact-icon" aria-hidden="true">
                  <Phone size={18} />
                </span>
                <span>
                  <small>{t("Call")}</small>
                  <strong dir="ltr">{salon.phoneNumber}</strong>
                </span>
              </a>
              <button
                type="button"
                className="ab-copy"
                onClick={copyPhone}
                aria-label={t("Copy phone number")}
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
                  <small>{t("Email")}</small>
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
                    <small>{t("Directions")}</small>
                    <strong>
                      {salon.city ? t(salon.city) : t("See on the map")}
                    </strong>
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
                    <small>{t("Directions")}</small>
                    <strong>
                      {salon.city ? t(salon.city) : t("Open Google Maps")}
                    </strong>
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
