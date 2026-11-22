import useMySalonServices from "../hooks/useMySalonServices.js";
import Button from "../../../shared/components/Button.jsx";

import { Edit, Trash2, Plus } from "lucide-react";
import t from "../../../shared/i18n/t.js";
import { serviceDescription, serviceName } from "../model/serviceText.js";
import { SalonServicesSkeleton } from "../components/ServicesPageSkeletons.jsx";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

function MySalonServices() {
  const { services, loading, handleDelete } = useMySalonServices();

  if (loading) return <SalonServicesSkeleton />;

  return (
    <section className="container section">
      <div className="profile-header">
        <div>
          <span className="eyebrow">{t(PAGE_HEADS.services.eyebrow)}</span>
          <h1>{t(PAGE_HEADS.services.title)}</h1>
          <p>{t(PAGE_HEADS.services.text)}</p>
        </div>

        <Button to="/owner/create-service">
          <Plus size={18} />
          {t("Add Service")}
        </Button>
      </div>

      {services.length === 0 ? (
        <div className="empty-state">
          <h3>{t("No services found")}</h3>
          <p>{t("You have not added any salon services yet.")}</p>

          <Button to="/owner/create-service">{t("Add First Service")}</Button>
        </div>
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <div className="service-card" key={service.id}>
              <div>
                <h3>{serviceName(service)}</h3>
                <p>
                  {serviceDescription(service) || t("No description provided.")}
                </p>
              </div>

              <div className="service-meta">
                <span>{t("{price} JD", { price: service.price })}</span>
                <span>
                  {t("{durationMinutes} min", {
                    durationMinutes: service.durationMinutes,
                  })}
                </span>
                <span
                  className={service.isActive ? "active-tag" : "inactive-tag"}
                >
                  {service.isActive ? t("Active") : t("Inactive")}
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
                  {t("Edit")}
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(service.id)}
                >
                  <Trash2 size={16} />
                  {t("Disable")}
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
