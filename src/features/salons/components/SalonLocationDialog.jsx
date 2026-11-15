import { Copy, ExternalLink, MapPin, Navigation, X } from "lucide-react";
import { useId } from "react";
import useModalDialog from "../../../shared/hooks/useModalDialog.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";
import {
  googleMapsDirectionsLink,
  googleMapsLink,
} from "../model/jordanMapLocation.js";
import GoogleMapEmbed from "./GoogleMapEmbed.jsx";

/** Shows a salon's saved location to guests, with directions in Google Maps. */
export default function SalonLocationDialog({
  salonName,
  city,
  point,
  onClose,
}) {
  const titleId = useId();
  const dialogRef = useModalDialog(onClose);
  const mapsLink = googleMapsLink(point.lat, point.lng);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(mapsLink);
      showSuccessToast("Location link copied.", "Copied");
    } catch {
      showErrorToast(
        "Your browser did not allow copying. Use Open in Google Maps instead.",
      );
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="location-dialog location-dialog-view"
      aria-labelledby={titleId}
    >
      <header className="location-dialog-header">
        <span className="location-dialog-icon" aria-hidden="true">
          <MapPin />
        </span>
        <div>
          <span className="eyebrow">{city || "Salon location"}</span>
          <h2 id={titleId}>How to find {salonName}</h2>
          <p>Open the pin in Google Maps to get turn-by-turn directions.</p>
        </div>
        <button
          className="location-dialog-close"
          type="button"
          onClick={onClose}
          aria-label="Close salon location"
        >
          <X size={18} />
        </button>
      </header>

      <div className="location-dialog-view-map">
        <GoogleMapEmbed point={point} title={`Map showing ${salonName}`} />
      </div>

      <footer className="location-dialog-footer location-dialog-view-actions">
        <button className="btn btn-secondary" type="button" onClick={copyLink}>
          <Copy size={16} aria-hidden="true" /> Copy link
        </button>
        <a
          className="btn btn-secondary"
          href={mapsLink}
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink size={16} aria-hidden="true" /> Open in Google Maps
        </a>
        <a
          className="btn btn-primary"
          href={googleMapsDirectionsLink(point.lat, point.lng)}
          target="_blank"
          rel="noreferrer"
        >
          <Navigation size={16} aria-hidden="true" /> Get directions
        </a>
      </footer>
    </dialog>
  );
}
