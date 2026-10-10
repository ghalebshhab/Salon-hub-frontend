import useCreateSalon from "../hooks/useCreateSalon.js";

const cities = [
  "Amman",
  "Zarqa",
  "Irbid",
  "Aqaba",
  "Jerash",
  "Madaba",
  "Ajloun",
  "As-Salt",
  "Al-Karak",
  "Ma'an",
  "Tafilah",
  "Mafraq",
];

function CreateSalon() {
  const { form, setForm, loading, handleChange, handleSubmit } =
    useCreateSalon();
  const setTime = (field, value) =>
    setForm((current) => ({ ...current, [field]: `${value}:00` }));
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
        <div className="form-row">
          <div className="form-group">
            <label>Salon name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Salon email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            minLength="10"
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Phone number</label>
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="+962791111111"
              required
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Opening time</label>
            <input
              type="time"
              value={form.openTime.slice(0, 5)}
              onChange={(event) => setTime("openTime", event.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Closing time</label>
            <input
              type="time"
              value={form.closeTime.slice(0, 5)}
              onChange={(event) => setTime("closeTime", event.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Maximum employees</label>
            <input
              name="maxNumOfEmployees"
              type="number"
              min="1"
              value={form.maxNumOfEmployees}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Profile picture URL</label>
            <input
              name="profilePictureUrl"
              type="url"
              value={form.profilePictureUrl}
              onChange={handleChange}
              placeholder="https://example.com/salon.jpg"
            />
          </div>
        </div>
        <button className="btn btn-primary full-width" disabled={loading}>
          {loading ? "Submitting..." : "Submit Salon for Review"}
        </button>
      </form>
    </section>
  );
}
export default CreateSalon;
