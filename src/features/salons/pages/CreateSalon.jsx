import useCreateSalon from "../hooks/useCreateSalon.js";
import SalonFormFields from "../components/SalonFormFields.jsx";
import t from "../../../shared/i18n/t.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

function CreateSalon() {
  const { form, setForm, loading, handleChange, handleSubmit } =
    useCreateSalon();
  return (
    <section className="form-page">
      <form className="form-card create-salon-pro-form" onSubmit={handleSubmit}>
        <div className="create-salon-header">
          <span className="eyebrow">{t(PAGE_HEADS.createSalon.eyebrow)}</span>
          <h1>{t(PAGE_HEADS.createSalon.title)}</h1>
          <p className="muted">{t(PAGE_HEADS.createSalon.text)}</p>
        </div>
        <SalonFormFields
          form={form}
          setForm={setForm}
          onChange={handleChange}
        />
        <button className="btn btn-primary full-width" disabled={loading}>
          {loading ? t("Submitting...") : t("Submit Salon for Review")}
        </button>
      </form>
    </section>
  );
}
export default CreateSalon;
