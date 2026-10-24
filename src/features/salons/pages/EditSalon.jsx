import Loading from "../../../shared/components/Loading.jsx";
import SalonFormFields from "../components/SalonFormFields.jsx";
import useEditSalon from "../hooks/useEditSalon.js";

export default function EditSalon() {
  const { form, setForm, salon, loading, saving, handleChange, handleSubmit } =
    useEditSalon();

  if (loading) return <Loading />;
  if (!salon) return <div className="empty-state">Salon not found.</div>;

  return (
    <section className="form-page">
      <form className="form-card create-salon-pro-form" onSubmit={handleSubmit}>
        <div className="create-salon-header">
          <span className="eyebrow">Salon settings</span>
          <h1>Edit Salon</h1>
          <p className="muted">
            Keep your public salon and review information accurate.
          </p>
        </div>
        <SalonFormFields
          form={form}
          setForm={setForm}
          onChange={handleChange}
        />
        <button className="btn btn-primary full-width" disabled={saving}>
          {saving ? "Saving…" : "Save Salon Details"}
        </button>
      </form>
    </section>
  );
}
