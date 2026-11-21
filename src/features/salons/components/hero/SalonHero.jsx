import { ExternalLink, Heart, MapPin, Phone, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import SalonCoverPlaceholder from "../SalonCoverPlaceholder.jsx";
import SalonPlanBadge from "../SalonPlanBadge.jsx";
import SalonMoreMenu from "./SalonMoreMenu.jsx";
import StarRating from "../../../reviews/components/StarRating.jsx";
import { optimizedCloudinaryImage } from "../../../media/model/cloudinaryMedia.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../../shared/notifications/toast.jsx";
import { tagline } from "../../model/salonPage.js";
import useSectionJump from "../../hooks/useSectionJump.js";

async function shareSalon(name) {
  const url = window.location.href;
  try {
    if (navigator.share) {
      await navigator.share({ title: name, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    showSuccessToast("Link copied. Share it with a friend.");
  } catch (error) {
    // The visitor closed the share sheet: nothing to report.
    if (error?.name === "AbortError") return;
    showErrorToast("Could not share this page. Copy the address instead.");
  }
}

function HeroRating({ rating, onJump }) {
  if (rating.loading) return <span className="sh-fact is-placeholder" />;
  if (!rating.total) {
    return <span className="sh-fact sh-new">New on SalonHub</span>;
  }
  return (
    <a className="sh-fact sh-rating" href="#reviews" onClick={onJump}>
      <StarRating value={rating.average} size={15} />
      <strong>{rating.average.toFixed(1)}</strong>
      <span>
        ({rating.total} {rating.total === 1 ? "review" : "reviews"})
      </span>
    </a>
  );
}

function HeroLocation({ salon, location }) {
  const label = salon.city || "Salon location";
  if (location?.onOpenMap) {
    return (
      <button
        type="button"
        className="sh-fact sh-link"
        onClick={location.onOpenMap}
      >
        <MapPin size={15} aria-hidden="true" />
        {label}
      </button>
    );
  }
  if (location?.href) {
    return (
      <a
        className="sh-fact sh-link"
        href={location.href}
        target="_blank"
        rel="noreferrer"
      >
        <MapPin size={15} aria-hidden="true" />
        {label}
        <ExternalLink size={12} aria-hidden="true" />
      </a>
    );
  }
  return (
    <span className="sh-fact">
      <MapPin size={15} aria-hidden="true" />
      {salon.city || "Location not listed"}
    </span>
  );
}

/**
 * The top of the salon page: a wide cover with the name on it, one line of
 * proof (rating, place, open now), then one main action and a few quiet ones.
 */
export default function SalonHero({
  salon,
  rating,
  status,
  location,
  primary,
  follow = null,
  moreActions = [],
  children,
}) {
  const image = salon.images?.[0];
  const line = tagline(salon.description);
  const PrimaryIcon = primary.icon;
  const jump = useSectionJump();

  return (
    <header className="sh">
      <div className={`sh-cover${image ? "" : " is-placeholder"}`}>
        {image ? (
          <img
            src={optimizedCloudinaryImage(image, { width: 1800, height: 820 })}
            alt=""
            fetchPriority="high"
          />
        ) : (
          <SalonCoverPlaceholder name={salon.name} variant="hero" />
        )}
        <div className="sh-cover-content">
          {salon.planBadge && (
            <span className="sh-badges">
              <SalonPlanBadge badge={salon.planBadge} />
            </span>
          )}
          <h1>{salon.name}</h1>
          <div className="sh-facts">
            <HeroRating rating={rating} onJump={jump("reviews")} />
            <HeroLocation salon={salon} location={location} />
            <span className={`sh-fact sh-status tone-${status.tone}`}>
              <span className="sh-dot" aria-hidden="true" />
              {status.title}
            </span>
          </div>
        </div>
      </div>

      <div className="sh-bar">
        {line ? (
          <figure className="sh-note">
            <span className="sh-note-mark" aria-hidden="true">
              &ldquo;
            </span>
            <blockquote className="sh-note-text">
              <p>{line}</p>
            </blockquote>
            <figcaption className="sh-note-caption">
              <span>In the salon&apos;s words</span>
              <a href="#about" onClick={jump("about")}>
                Read the story
              </a>
            </figcaption>
          </figure>
        ) : (
          <p className="sh-note-empty">
            Book a visit, meet the team and see their work.
          </p>
        )}

        <div className="sh-actions">
          <Link
            className="btn btn-primary sh-primary"
            to={primary.to}
            state={primary.state}
          >
            <PrimaryIcon size={18} aria-hidden="true" />
            {primary.label}
          </Link>
          {salon.phoneNumber && (
            <a className="btn btn-secondary" href={`tel:${salon.phoneNumber}`}>
              <Phone size={17} aria-hidden="true" />
              Call
            </a>
          )}
          {follow && (
            <button
              type="button"
              className={`sh-icon-button${follow.followed ? " is-on" : ""}`}
              aria-pressed={follow.followed}
              aria-label={follow.followed ? "Following salon" : "Follow salon"}
              title={follow.followed ? "Following" : "Follow"}
              disabled={follow.busy}
              onClick={follow.toggle}
            >
              <Heart
                size={19}
                aria-hidden="true"
                fill={follow.followed ? "currentColor" : "none"}
              />
            </button>
          )}
          <button
            type="button"
            className="sh-icon-button"
            aria-label="Share salon"
            title="Share"
            onClick={() => shareSalon(salon.name)}
          >
            <Share2 size={18} aria-hidden="true" />
          </button>
          <SalonMoreMenu actions={moreActions} />
        </div>
      </div>

      {children}
    </header>
  );
}
