import { ExternalLink, MapPin } from "lucide-react";
import MediaSourcePicker from "../../media/components/MediaSourcePicker.jsx";
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

export default function SalonFormFields({ form, setForm, onChange }) {
  const setTime = (field, value) =>
    setForm((current) => ({ ...current, [field]: `${value}:00` }));

  const setMedia = ({ file, remoteUrl, previewUrl }) =>
    setForm((current) => ({
      ...current,
      coverFile: file,
      coverDriveUrl: remoteUrl,
      coverPreviewUrl: previewUrl,
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

  const setMapLocation = ({ latitude, longitude, googleMapsUrl, city }) =>
    setForm((current) => ({
      ...current,
      latitude,
      longitude,
      googleMapsUrl,
      ...(city ? { city } : {}),
    }));

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
      </div>
      <div className="salon-location-fields">
        <div className="salon-location-heading">
          <div>
            <MapPin size={19} />
            <div>
              <strong>Google Maps location</strong>
              <small>
                Search, click or move the marker. The location fields are filled
                automatically.
              </small>
            </div>
          </div>
          <a
            className="text-link"
            href="https://www.google.com/maps/search/salon+in+Jordan"
            target="_blank"
            rel="noreferrer"
          >
            Choose on Google Maps <ExternalLink size={14} />
          </a>
        </div>
        <GoogleMapsLocationPicker
          latitude={form.latitude}
          longitude={form.longitude}
          onLocationChange={setMapLocation}
        />
        <div className="form-group">
          <label htmlFor="salon-google-maps">Google Maps URL</label>
          <input
            id="salon-google-maps"
            type="url"
            value={form.googleMapsUrl}
            onChange={(event) => setMapUrl(event.target.value)}
            placeholder="https://www.google.com/maps/place/.../@31.95,35.91,17z"
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="salon-latitude">Latitude</label>
            <input
              id="salon-latitude"
              name="latitude"
              type="number"
              step="any"
              value={form.latitude}
              onChange={onChange}
              placeholder="31.9539"
            />
          </div>
          <div className="form-group">
            <label htmlFor="salon-longitude">Longitude</label>
            <input
              id="salon-longitude"
              name="longitude"
              type="number"
              step="any"
              value={form.longitude}
              onChange={onChange}
              placeholder="35.9106"
            />
          </div>
        </div>
      </div>
      <MediaSourcePicker
        label="Salon profile picture"
        currentUrl={form.coverPreviewUrl || form.profilePictureUrl}
        onChange={setMedia}
      />
    </>
  );
}
