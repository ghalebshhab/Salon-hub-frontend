import useCreateSalonService from "../hooks/useCreateSalonService.js";
import Button from "../../../shared/components/Button.jsx";
import t from "../../../shared/i18n/t.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

function CreateSalonService() {
  const { formData, submitting, handleChange, handleSubmit } =
    useCreateSalonService();

  return (
    <section className="container section">
      <div className="profile-header">
        <div>
          <span className="eyebrow">{t(PAGE_HEADS.addService.eyebrow)}</span>
          <h1>{t(PAGE_HEADS.addService.title)}</h1>
          <p>{t(PAGE_HEADS.addService.text)}</p>
        </div>

        <Button variant="secondary" to="/owner/services">
          {t("Back to Services")}
        </Button>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t("Service Name")}</label>
          <input
            type="text"
            name="name"
            placeholder={t("Example: Haircut")}
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>{t("Description")}</label>
          <textarea
            name="description"
            placeholder={t("Describe this service...")}
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="service-name-ar">{t("Service name in Arabic")}</label>
          <input
            id="service-name-ar"
            type="text"
            name="nameAr"
            dir="rtl"
            lang="ar"
            value={formData.nameAr}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="service-description-ar">
            {t("Description in Arabic")}
          </label>
          <textarea
            id="service-description-ar"
            name="descriptionAr"
            dir="rtl"
            lang="ar"
            value={formData.descriptionAr}
            onChange={handleChange}
            rows="3"
          />
          <small className="form-hint">
            {t(
              "Optional. Leave the Arabic empty and SalonHub translates your English for you.",
            )}
          </small>
        </div>

        <div className="form-grid-two">
          <div className="form-group">
            <label>{t("Price JD")}</label>
            <input
              type="number"
              name="price"
              placeholder="5"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>{t("Duration Minutes")}</label>
            <input
              type="number"
              name="durationMinutes"
              placeholder="30"
              value={formData.durationMinutes}
              onChange={handleChange}
              min="1"
            />
          </div>
        </div>

        <Button type="submit" disabled={submitting}>
          {submitting ? t("Creating...") : t("Create Service")}
        </Button>
      </form>
    </section>
  );
}

export default CreateSalonService;
