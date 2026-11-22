import useSalonShowcase from "../hooks/useSalonShowcase.js";

import { Link } from "react-router-dom";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import SalonCoverPlaceholder from "./SalonCoverPlaceholder.jsx";
import SalonPlanBadge from "./SalonPlanBadge.jsx";
import SalonShowcaseSkeleton from "./SalonShowcaseSkeleton.jsx";
import t from "../../../shared/i18n/t.js";

function SalonShowcase() {
  const { getImages, formatTime, salons, loading } = useSalonShowcase();
  if (loading) {
    return (
      <div role="status" aria-label={t("Loading salons")}>
        <div aria-hidden="true">
          <SalonShowcaseSkeleton />
        </div>
      </div>
    );
  }

  if (salons.length === 0) {
    return (
      <div className="empty-state">
        <h3>{t("No salons yet")}</h3>
        <p>{t("Salon profiles will appear here when owners create them.")}</p>
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
                <SalonCoverPlaceholder name={salon.name} />
              )}

              <span
                className={
                  salon.state === "OPEN"
                    ? "salon-state-badge open"
                    : "salon-state-badge closed"
                }
              >
                {t(salon.state)}
              </span>
              <SalonPlanBadge
                badge={salon.planBadge}
                className="salon-plan-badge-overlay"
              />
            </div>

            <div className="salon-showcase-body">
              <h3>{salon.name}</h3>

              <p className="salon-location">
                <MapPin size={16} />
                {t(salon.city)} • {salon.address}
              </p>

              <p className="salon-time">
                <Clock size={16} />
                {formatTime(salon.openTime)} - {formatTime(salon.closeTime)}
              </p>

              <div className="salon-showcase-footer">
                <span>{t("View profile")}</span>
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
