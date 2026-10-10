import useSalonServicesList from "../hooks/useSalonServicesList.js";

import { CalendarDays } from "lucide-react";

function SalonServicesList({ salonId }) {
  const { services, loading, handleBookNow } = useSalonServicesList({
    salonId,
  });
  if (loading) {
    return <div className="loading">Loading services...</div>;
  }

  if (services.length === 0) {
    return (
      <div className="empty-state">
        <h3>No services yet</h3>
        <p>This salon has not added services yet.</p>
      </div>
    );
  }

  return (
    <div className="services-grid">
      {services.map((service) => (
        <div className="service-card" key={service.id}>
          <div>
            <h3>{service.name}</h3>
            <p>{service.description || "No description provided."}</p>
          </div>

          <div className="service-meta">
            <span>{service.price} JD</span>
            <span>{service.durationMinutes} min</span>
          </div>

          <button
            className="btn btn-primary btn-small"
            onClick={() => handleBookNow(service)}
          >
            <CalendarDays size={16} />
            Book Now
          </button>
        </div>
      ))}
    </div>
  );
}

export default SalonServicesList;
