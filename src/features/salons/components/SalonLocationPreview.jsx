import { Map as MapIcon, Navigation } from "lucide-react";
import { googleMapsDirectionsLink } from "../model/jordanMapLocation.js";
import GoogleMapEmbed from "./GoogleMapEmbed.jsx";
import t from "../../../shared/i18n/t.js";

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
        aria-label={t("Open the map for {salonName}", { salonName })}
      >
        <GoogleMapEmbed
          point={point}
          interactive={false}
          title={t("Map preview for {salonName}", { salonName })}
        />
        <span className="salon-location-preview-expand" aria-hidden="true">
          <MapIcon size={15} /> {t("View map")}
        </span>
      </button>
      <div className="salon-location-preview-footer">
        <span>
          <strong>{city ? t(city) : t("Salon location")}</strong>
          <small>{t("Pinned on Google Maps")}</small>
        </span>
        <a
          className="btn btn-secondary btn-small"
          href={googleMapsDirectionsLink(point.lat, point.lng)}
          target="_blank"
          rel="noreferrer"
        >
          <Navigation size={15} aria-hidden="true" /> {t("Directions")}
        </a>
      </div>
    </div>
  );
}
