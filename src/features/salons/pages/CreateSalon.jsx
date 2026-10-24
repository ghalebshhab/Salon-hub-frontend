import useCreateSalon from "../hooks/useCreateSalon.js";
import SalonFormFields from "../components/SalonFormFields.jsx";

function CreateSalon() {
  const { form, setForm, loading, handleChange, handleSubmit } =
    useCreateSalon();
  return (
    <section className="form-page">
      <form className="form-card create-salon-pro-form" onSubmit={handleSubmit}>
        <div className="create-salon-header">
          <span className="eyebrow">Owner setup</span>
          <h1>Create Salon</h1>
          <p className="muted">
            Submit your salon profile for administrator review.
          </p>
        </div>
        <SalonFormFields
          form={form}
          setForm={setForm}
          onChange={handleChange}
        />
        <button className="btn btn-primary full-width" disabled={loading}>
          {loading ? "Submitting..." : "Submit Salon for Review"}
        </button>
      </form>
    </section>
  );
}
export default CreateSalon;
