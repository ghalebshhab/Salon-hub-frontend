const SALON_CITIES = [
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

export default function SalonFormFields({ form, setForm, onChange }) {
  const setTime = (field, value) =>
    setForm((current) => ({ ...current, [field]: `${value}:00` }));

  return (
    <>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="salon-name">Salon name</label>
          <input
            id="salon-name"
            name="name"
            value={form.name}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="salon-email">Salon email</label>
          <input
            id="salon-email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="salon-description">Description</label>
        <textarea
          id="salon-description"
          name="description"
          value={form.description}
          onChange={onChange}
          rows="4"
          minLength="10"
          required
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="salon-phone">Phone number</label>
          <input
            id="salon-phone"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={onChange}
            placeholder="+962791111111"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="salon-city">City</label>
          <select
            id="salon-city"
            name="city"
            value={form.city}
            onChange={onChange}
            required
          >
            <option value="">Select a city</option>
            {SALON_CITIES.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="salon-opening-time">Opening time</label>
          <input
            id="salon-opening-time"
            type="time"
            value={form.openTime.slice(0, 5)}
            onChange={(event) => setTime("openTime", event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="salon-closing-time">Closing time</label>
          <input
            id="salon-closing-time"
            type="time"
            value={form.closeTime.slice(0, 5)}
            onChange={(event) => setTime("closeTime", event.target.value)}
            required
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="salon-employee-capacity">Maximum employees</label>
          <input
            id="salon-employee-capacity"
            name="maxNumOfEmployees"
            type="number"
            min="1"
            value={form.maxNumOfEmployees}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="salon-profile-picture">Profile picture URL</label>
          <input
            id="salon-profile-picture"
            name="profilePictureUrl"
            type="url"
            value={form.profilePictureUrl}
            onChange={onChange}
            placeholder="https://example.com/salon.jpg"
          />
        </div>
      </div>
    </>
  );
}
