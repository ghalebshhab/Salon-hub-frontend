import {
  AlertCircle,
  Check,
  ClipboardPaste,
  ExternalLink,
  LocateFixed,
  MapPin,
  MapPinned,
  X,
} from "lucide-react";
import { useCallback, useId, useState } from "react";
import useModalDialog from "../../../shared/hooks/useModalDialog.js";
import {
  coordinatesFromMapsInput,
  DEFAULT_MAP_CENTER,
  googleMapsLink,
  isInsideJordan,
  toLocationFields,
  toMapPoint,
} from "../model/jordanMapLocation.js";
import GoogleMapEmbed from "./GoogleMapEmbed.jsx";
import GoogleMapsLocationPicker from "./GoogleMapsLocationPicker.jsx";

const OUTSIDE_JORDAN = "Choose a point inside Jordan.";
const GEOLOCATION_TIMEOUT_MS = 12000;

function describeLinkProblem(text) {
  if (/goo\.gl|maps\.app/i.test(text)) {
    return "Short links do not include the pin. Open the link, then copy the full address from the browser bar, or copy the coordinates.";
  }
  return "We could not find a point in Jordan in this text. Paste a Google Maps link or coordinates such as 31.9539, 35.9106.";
}

function formatPoint({ lat, lng }) {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

/**
 * Lets the owner pin the salon on a map and confirm it.
 * `onConfirm` receives `{ latitude, longitude, googleMapsUrl, city }` and
 * should resolve to true when the location was stored.
 */
export default function SalonLocationPickerDialog({
  latitude,
  longitude,
  saving = false,
  confirmLabel = "Save location",
  onConfirm,
  onClose,
}) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() || "";
  const titleId = useId();
  const linkId = useId();
  const dialogRef = useModalDialog(onClose, { locked: saving });

  const [interactive, setInteractive] = useState(Boolean(apiKey));
  const [selection, setSelection] = useState(() => ({
    point: toMapPoint(latitude, longitude),
    address: "",
    city: "",
  }));
  const [linkText, setLinkText] = useState("");
  const [notice, setNotice] = useState("");
  const [locating, setLocating] = useState(false);
  const [saveError, setSaveError] = useState("");

  const { point } = selection;
  const linkProblem =
    linkText.trim() && !coordinatesFromMapsInput(linkText)
      ? describeLinkProblem(linkText)
      : "";

  const handlePick = useCallback(({ point: picked, address, city }) => {
    setNotice("");
    setSelection({ point: picked, address, city });
  }, []);
  const handleUnavailable = useCallback(() => {
    setInteractive(false);
    setNotice(
      "Google Maps search is not available right now. Use your current location or paste a Google Maps link instead.",
    );
  }, []);
  const handleOutside = useCallback(() => setNotice(OUTSIDE_JORDAN), []);

  const locateDevice = () => {
    if (!navigator.geolocation) {
      setNotice("This browser cannot share its location.");
      return;
    }
    setLocating(true);
    setNotice("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        const picked = { lat: coords.latitude, lng: coords.longitude };
        if (!isInsideJordan(picked.lat, picked.lng)) {
          setNotice(`Your device is outside Jordan. ${OUTSIDE_JORDAN}`);
          return;
        }
        setSelection({ point: picked, address: "", city: "" });
      },
      (error) => {
        setLocating(false);
        setNotice(
          error.code === error.PERMISSION_DENIED
            ? "Location access was blocked. Allow it in the browser, or choose the point another way."
            : "We could not read your location. Try again or choose the point another way.",
        );
      },
      { enableHighAccuracy: true, timeout: GEOLOCATION_TIMEOUT_MS },
    );
  };

  const changeLinkText = (value) => {
    setLinkText(value);
    const parsed = coordinatesFromMapsInput(value);
    if (parsed) {
      setNotice("");
      setSelection({ point: parsed, address: "", city: "" });
    }
  };

  const pasteFromClipboard = async () => {
    try {
      changeLinkText(await navigator.clipboard.readText());
    } catch {
      document.getElementById(linkId)?.focus();
    }
  };

  const confirm = async () => {
    if (!point || saving) return;
    setSaveError("");
    try {
      await onConfirm({ ...toLocationFields(point), city: selection.city });
      onClose();
    } catch (error) {
      setSaveError(error?.message || "Could not save the location.");
    }
  };

  const findOnGoogleMaps = point
    ? `https://www.google.com/maps/@${point.lat},${point.lng},17z`
    : `https://www.google.com/maps/@${DEFAULT_MAP_CENTER.lat},${DEFAULT_MAP_CENTER.lng},12z`;

  return (
    <dialog
      ref={dialogRef}
      className="location-dialog"
      aria-labelledby={titleId}
    >
      <header className="location-dialog-header">
        <span className="location-dialog-icon" aria-hidden="true">
          <MapPinned />
        </span>
        <div>
          <span className="eyebrow">Salon location</span>
          <h2 id={titleId}>Pin your salon on the map</h2>
          <p>
            Guests use this pin to find the salon and get directions in Google
            Maps.
          </p>
        </div>
        <button
          className="location-dialog-close"
          type="button"
          onClick={onClose}
          disabled={saving}
          aria-label="Close location picker"
        >
          <X size={18} />
        </button>
      </header>

      <div className="location-dialog-body">
        <div className="location-dialog-map">
          {interactive ? (
            <GoogleMapsLocationPicker
              apiKey={apiKey}
              point={point}
              onPick={handlePick}
              onUnavailable={handleUnavailable}
              onOutsideJordan={handleOutside}
            />
          ) : point ? (
            <GoogleMapEmbed
              point={point}
              title="Preview of the selected salon location"
            />
          ) : (
            <div className="location-dialog-empty-map">
              <MapPin aria-hidden="true" />
              <strong>No pin yet</strong>
              <span>
                Use your current location or paste a Google Maps link to place
                the pin.
              </span>
            </div>
          )}
        </div>

        <aside className="location-dialog-panel">
          <button
            className="location-method location-method-primary"
            type="button"
            onClick={locateDevice}
            disabled={locating || saving}
          >
            <LocateFixed aria-hidden="true" />
            <span>
              <strong>
                {locating
                  ? "Finding your location…"
                  : "Use my current location"}
              </strong>
              <small>Best when you are inside the salon now.</small>
            </span>
          </button>

          {interactive ? (
            <p className="location-dialog-hint">
              Or search above the map, click the map, or drag the pin to the
              salon entrance.
            </p>
          ) : (
            <div className="location-link-method">
              <ol className="location-steps">
                <li>
                  <a href={findOnGoogleMaps} target="_blank" rel="noreferrer">
                    Open Google Maps <ExternalLink size={13} />
                  </a>{" "}
                  and find the salon.
                </li>
                <li>
                  Click the salon, or right-click the entrance to drop a pin.
                </li>
                <li>Copy the link or the coordinates and paste them here.</li>
              </ol>
              <label className="location-link-label" htmlFor={linkId}>
                Google Maps link or coordinates
              </label>
              <div className="location-link-input">
                <input
                  id={linkId}
                  type="text"
                  inputMode="url"
                  autoComplete="off"
                  value={linkText}
                  onChange={(event) => changeLinkText(event.target.value)}
                  placeholder="https://www.google.com/maps/… or 31.95, 35.91"
                  aria-invalid={Boolean(linkProblem)}
                  aria-describedby={linkProblem ? `${linkId}-error` : undefined}
                />
                <button
                  className="btn btn-secondary btn-small"
                  type="button"
                  onClick={pasteFromClipboard}
                >
                  <ClipboardPaste size={15} /> Paste
                </button>
              </div>
              {linkProblem && (
                <p className="location-field-error" id={`${linkId}-error`}>
                  {linkProblem}
                </p>
              )}
            </div>
          )}

          {notice && (
            <p className="location-dialog-notice" role="alert">
              <AlertCircle size={16} aria-hidden="true" />
              {notice}
            </p>
          )}

          <div
            className={`location-selection ${point ? "is-set" : ""}`}
            aria-live="polite"
          >
            <span className="location-selection-label">Selected point</span>
            {point ? (
              <>
                <strong>{selection.address || formatPoint(point)}</strong>
                {selection.address && <small>{formatPoint(point)}</small>}
                {selection.city && (
                  <small>City detected: {selection.city}</small>
                )}
                <a
                  href={googleMapsLink(point.lat, point.lng)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Check it in Google Maps <ExternalLink size={13} />
                </a>
              </>
            ) : (
              <strong className="is-empty">Nothing selected yet</strong>
            )}
          </div>
        </aside>
      </div>

      <footer className="location-dialog-footer">
        {saveError && (
          <p className="location-dialog-save-error" role="alert">
            <AlertCircle size={16} aria-hidden="true" />
            {saveError}
          </p>
        )}
        <button
          className="btn btn-secondary"
          type="button"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={confirm}
          disabled={!point || saving}
        >
          <Check size={17} aria-hidden="true" />
          {saving ? "Saving…" : confirmLabel}
        </button>
      </footer>
    </dialog>
  );
}
