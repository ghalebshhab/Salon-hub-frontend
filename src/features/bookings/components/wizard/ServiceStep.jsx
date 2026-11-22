import { Check, Clock3, Scissors } from "lucide-react";
import { formatDuration } from "../../model/booking.js";
import t from "../../../../shared/i18n/t.js";
import {
  serviceDescription,
  serviceName,
} from "../../../services/model/serviceText.js";

export default function ServiceStep({ services, selectedIds, onToggle }) {
  if (services.length === 0) {
    return (
      <div className="bk-empty">
        <Scissors aria-hidden="true" />
        <strong>{t("No services to book yet")}</strong>
        <span>{t("This salon has not published any active service.")}</span>
      </div>
    );
  }

  return (
    <fieldset className="bk-fieldset">
      <legend className="bk-step-title">
        <span className="eyebrow">{t("Step 1")}</span>
        {t("What would you like to book?")}
        <small>
          {t("Choose one or more services. You can combine them in one visit.")}
        </small>
      </legend>
      <div className="bk-service-grid">
        {services.map((service) => {
          const selected = selectedIds.includes(Number(service.id));
          return (
            <label
              key={service.id}
              className={`bk-service ${selected ? "is-selected" : ""}`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={selected}
                onChange={() => onToggle(service.id)}
              />
              <span className="bk-service-check" aria-hidden="true">
                {selected && <Check size={14} />}
              </span>
              <span className="bk-service-body">
                <strong>{serviceName(service)}</strong>
                {service.description && (
                  <small>{serviceDescription(service)}</small>
                )}
                <span className="bk-service-meta">
                  <span>
                    <Clock3 size={13} aria-hidden="true" />
                    {formatDuration(service.durationMinutes)}
                  </span>
                  <b>
                    {Number(service.price)} {t("JD")}
                  </b>
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
