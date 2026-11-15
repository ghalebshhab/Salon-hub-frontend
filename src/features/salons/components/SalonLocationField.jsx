import { ExternalLink, MapPin, MapPinned, Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "../../../shared/components/ConfirmDialog.jsx";
import { showErrorToast } from "../../../shared/notifications/toast.jsx";
import { googleMapsLink, toMapPoint } from "../model/jordanMapLocation.js";
import GoogleMapEmbed from "./GoogleMapEmbed.jsx";
import SalonLocationPickerDialog from "./SalonLocationPickerDialog.jsx";

/**
 * Owner-facing summary of the salon map pin with the button that opens the
 * map picker. Used in the create-salon form and on the live profile editor.
 */
export default function SalonLocationField({
  latitude,
  longitude,
  saving = false,
  setLabel = "Map pin saved",
  confirmLabel = "Save location",
  onConfirm,
  onRemove,
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const point = toMapPoint(latitude, longitude);

  const remove = async () => {
    try {
      await onRemove();
      setConfirmRemove(false);
    } catch (error) {
      // Close the overlay first so the toast is not hidden behind it.
      setConfirmRemove(false);
      showErrorToast(error?.message || "Could not remove the map pin.");
    }
  };

  return (
    <div className={`salon-location-field ${point ? "has-point" : ""}`}>
      <button
        className="salon-location-field-preview"
        type="button"
        onClick={() => setPickerOpen(true)}
        aria-label={
          point
            ? "Change the salon location"
            : "Select the salon location on the map"
        }
      >
        {point ? (
          <GoogleMapEmbed
            point={point}
            interactive={false}
            title="Saved salon location"
          />
        ) : (
          <span className="salon-location-field-empty" aria-hidden="true">
            <MapPin />
          </span>
        )}
      </button>

      <div className="salon-location-field-body">
        <strong>{point ? setLabel : "No map pin yet"}</strong>
        <span>
          {point
            ? `${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}`
            : "Add the exact point so guests can open the salon in Google Maps and get directions."}
        </span>
        <div className="salon-location-field-actions">
          <button
            className="btn btn-primary btn-small"
            type="button"
            onClick={() => setPickerOpen(true)}
            disabled={saving}
          >
            <MapPinned size={16} aria-hidden="true" />
            {point ? "Change location" : "Select location on map"}
          </button>
          {point && (
            <a
              className="btn btn-secondary btn-small"
              href={googleMapsLink(point.lat, point.lng)}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={15} aria-hidden="true" /> Open in Google Maps
            </a>
          )}
          {point && onRemove && (
            <button
              className="salon-location-remove"
              type="button"
              onClick={() => setConfirmRemove(true)}
              disabled={saving}
            >
              <Trash2 size={15} aria-hidden="true" /> Remove pin
            </button>
          )}
        </div>
      </div>

      {pickerOpen && (
        <SalonLocationPickerDialog
          latitude={latitude}
          longitude={longitude}
          saving={saving}
          confirmLabel={confirmLabel}
          onConfirm={onConfirm}
          onClose={() => setPickerOpen(false)}
        />
      )}
      <ConfirmDialog
        open={confirmRemove}
        title="Remove the map pin?"
        message="Guests will no longer see the salon on a map or get directions until you add a new pin."
        confirmText="Remove pin"
        danger
        loading={saving}
        onConfirm={remove}
        onCancel={() => setConfirmRemove(false)}
      />
    </div>
  );
}
