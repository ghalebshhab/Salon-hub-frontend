import { googleMapsEmbedUrl } from "../model/jordanMapLocation.js";

const apiKey = () => import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() || "";

/** Read-only embedded Google Map centred on one point. */
export default function GoogleMapEmbed({
  point,
  title,
  interactive = true,
  className = "",
}) {
  return (
    <div className={`map-embed ${interactive ? "" : "is-static"} ${className}`}>
      <iframe
        key={`${point.lat},${point.lng}`}
        src={googleMapsEmbedUrl(point.lat, point.lng, apiKey())}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen={interactive}
        tabIndex={interactive ? 0 : -1}
        aria-hidden={interactive ? undefined : "true"}
      />
    </div>
  );
}
