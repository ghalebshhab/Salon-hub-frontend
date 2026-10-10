import useSalonShowcase from "../hooks/useSalonShowcase.js";

import { Link } from "react-router-dom";
import { MapPin, Clock, ArrowRight } from "lucide-react";

function SalonShowcase() {
  const { getImages, formatTime, salons, loading } = useSalonShowcase();
  if (loading) {
    return (
      <div
        className="salon-showcase-grid"
        role="status"
        aria-label="Loading salons"
      >
        {[0, 1, 2].map((item) => (
          <div className="salon-showcase-card salon-skeleton" key={item}>
            <div className="salon-skeleton-image" />
            <div className="salon-skeleton-body">
              <span className="skeleton-line skeleton-title" />
              <span className="skeleton-line" />
              <span className="skeleton-line skeleton-short" />
            </div>
          </div>
        ))}
        <span className="sr-only">Loading salons...</span>
      </div>
    );
  }

  if (salons.length === 0) {
    return (
      <div className="empty-state">
        <h3>No salons yet</h3>
        <p>Salon profiles will appear here when owners create them.</p>
      </div>
    );
  }

  return (
    <div className="salon-showcase-grid">
      {salons.map((salon) => {
        const images = getImages(salon);
        const coverImage = images[0];

        return (
          <Link
            to={`/salons/${salon.salonId}`}
            className="salon-showcase-card"
            key={salon.salonId}
          >
            <div className="salon-showcase-image">
              {coverImage ? (
                <img src={coverImage} alt={salon.name} />
              ) : (
                <div className="salon-showcase-placeholder">
                  {salon.name?.charAt(0)?.toUpperCase() || "S"}
                </div>
              )}

              <span
                className={
                  salon.state === "OPEN"
                    ? "salon-state-badge open"
                    : "salon-state-badge closed"
                }
              >
                {salon.state}
              </span>
            </div>

            <div className="salon-showcase-body">
              <h3>{salon.name}</h3>

              <p className="salon-location">
                <MapPin size={16} />
                {salon.city} • {salon.address}
              </p>

              <p className="salon-time">
                <Clock size={16} />
                {formatTime(salon.openTime)} - {formatTime(salon.closeTime)}
              </p>

              <div className="salon-showcase-footer">
                <span>View profile</span>
                <ArrowRight size={18} />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default SalonShowcase;
