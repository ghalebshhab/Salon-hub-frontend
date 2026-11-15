import { MapPin } from "lucide-react";
import MediaSourcePicker from "../../media/components/MediaSourcePicker.jsx";
import { SALON_CITIES } from "../model/salonCities.js";
import SalonLocationField from "./SalonLocationField.jsx";

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

  const setMapLocation = ({ latitude, longitude, googleMapsUrl, city }) =>
    setForm((current) => ({
      ...current,
      latitude: latitude ?? "",
      longitude: longitude ?? "",
      googleMapsUrl: googleMapsUrl ?? "",
      ...(SALON_CITIES.includes(city) ? { city } : {}),
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
              <strong>Salon location on Google Maps</strong>
              <small>
                Optional, but guests find you faster with a map pin and
                directions.
              </small>
            </div>
          </div>
        </div>
        <SalonLocationField
          latitude={form.latitude}
          longitude={form.longitude}
          setLabel="Map pin selected"
          confirmLabel="Use this location"
          onConfirm={setMapLocation}
          onRemove={() =>
            setMapLocation({
              latitude: null,
              longitude: null,
              googleMapsUrl: null,
            })
          }
        />
      </div>
      <MediaSourcePicker
        label="Salon profile picture"
        currentUrl={form.coverPreviewUrl || form.profilePictureUrl}
        onChange={setMedia}
      />
    </>
  );
}
