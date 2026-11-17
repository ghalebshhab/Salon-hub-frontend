import { Map as MapIcon, Navigation } from "lucide-react";
import { googleMapsDirectionsLink } from "../model/jordanMapLocation.js";
import GoogleMapEmbed from "./GoogleMapEmbed.jsx";

/** Small map card on the public profile; opens the full location dialog. */
export default function SalonLocationPreview({
  salonName,
  city,
  point,
  onOpen,
}) {
  return (
    <div className="salon-location-preview">
      <button
        className="salon-location-preview-map"
        type="button"
        onClick={onOpen}
        aria-label={`Open the map for ${salonName}`}
      >
        <GoogleMapEmbed
          point={point}
          interactive={false}
          title={`Map preview for ${salonName}`}
        />
        <span className="salon-location-preview-expand" aria-hidden="true">
          <MapIcon size={15} /> View map
        </span>
      </button>
      <div className="salon-location-preview-footer">
        <span>
          <strong>{city || "Salon location"}</strong>
          <small>Pinned on Google Maps</small>
        </span>
        <a
          className="btn btn-secondary btn-small"
          href={googleMapsDirectionsLink(point.lat, point.lng)}
          target="_blank"
          rel="noreferrer"
        >
          <Navigation size={15} aria-hidden="true" /> Directions
        </a>
      </div>
    </div>
  );
}
