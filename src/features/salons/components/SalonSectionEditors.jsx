import GoogleMapsLocationPicker from "./GoogleMapsLocationPicker.jsx";

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

export function IdentityEditor({ form, onChange }) {
  return (
    <div className="owner-editor-fields">
      <label>
        <span>Salon name</span>
        <input name="name" value={form.name} onChange={onChange} required />
      </label>
      <label className="owner-editor-wide">
        <span>Salon story</span>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          minLength="11"
          rows="5"
          required
        />
        <small>
          Tell guests what makes the salon and its experience distinct.
        </small>
      </label>
    </div>
  );
}

export function ContactEditor({ form, onChange }) {
  return (
    <div className="owner-editor-fields">
      <label>
        <span>Public phone</span>
        <input
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={onChange}
          required
        />
      </label>
      <label>
        <span>Public email</span>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          required
        />
      </label>
    </div>
  );
}

export function AvailabilityEditor({ form, setForm, onChange }) {
  const setTime = (field, value) =>
    setForm((current) => ({ ...current, [field]: `${value}:00` }));

  return (
    <div className="owner-editor-fields">
      <label>
        <span>Opening time</span>
        <input
          type="time"
          value={form.openTime.slice(0, 5)}
          onChange={(event) => setTime("openTime", event.target.value)}
          required
        />
      </label>
      <label>
        <span>Closing time</span>
        <input
          type="time"
          value={form.closeTime.slice(0, 5)}
          onChange={(event) => setTime("closeTime", event.target.value)}
          required
        />
      </label>
      <label>
        <span>Maximum team members</span>
        <input
          name="maxNumOfEmployees"
          type="number"
          min="1"
          value={form.maxNumOfEmployees}
          onChange={onChange}
          required
        />
      </label>
    </div>
  );
}

export function LocationEditor({ form, setForm, onChange }) {
  const applyLocation = ({ latitude, longitude, googleMapsUrl, city }) =>
    setForm((current) => ({
      ...current,
      latitude,
      longitude,
      googleMapsUrl,
      ...(city ? { city } : {}),
    }));

  const setMapUrl = (value) => {
    const coordinateMatch =
      value.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/) ||
      value.match(/[?&](?:q|query)=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
    setForm((current) => ({
      ...current,
      googleMapsUrl: value,
      ...(coordinateMatch
        ? { latitude: coordinateMatch[1], longitude: coordinateMatch[2] }
        : {}),
    }));
  };

  return (
    <div className="owner-location-editor">
      <div className="owner-editor-fields">
        <label>
          <span>City</span>
          <select name="city" value={form.city} onChange={onChange} required>
            <option value="">Select a city</option>
            {SALON_CITIES.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Google Maps URL</span>
          <input
            name="googleMapsUrl"
            type="url"
            value={form.googleMapsUrl}
            onChange={(event) => setMapUrl(event.target.value)}
            placeholder="https://maps.google.com/..."
          />
        </label>
      </div>
      <GoogleMapsLocationPicker
        latitude={form.latitude}
        longitude={form.longitude}
        onLocationChange={applyLocation}
      />
    </div>
  );
}
