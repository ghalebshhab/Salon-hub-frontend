import useMySalonServices from "../hooks/useMySalonServices.js";
import Button from "../../../shared/components/Button.jsx";

import { Edit, Trash2, Plus } from "lucide-react";

function MySalonServices() {
  const { services, loading, handleDelete } = useMySalonServices();

  if (loading) {
    return <div className="loading">Loading services...</div>;
  }

  return (
    <section className="container section">
      <div className="profile-header">
        <div>
          <span className="eyebrow">Salon services</span>
          <h1>Manage Services</h1>
          <p>Add, update, or disable the services that your salon provides.</p>
        </div>

        <Button to="/owner/create-service">
          <Plus size={18} />
          Add Service
        </Button>
      </div>

      {services.length === 0 ? (
        <div className="empty-state">
          <h3>No services found</h3>
          <p>You have not added any salon services yet.</p>

          <Button to="/owner/create-service">Add First Service</Button>
        </div>
      ) : (
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
                <span
                  className={service.isActive ? "active-tag" : "inactive-tag"}
                >
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="service-actions">
                <Button
                  variant="secondary"
                  size="sm"
                  to={`/owner/services/${service.id}/edit`}
                  state={{ service }}
                >
                  <Edit size={16} />
                  Edit
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(service.id)}
                >
                  <Trash2 size={16} />
                  Disable
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MySalonServices;
