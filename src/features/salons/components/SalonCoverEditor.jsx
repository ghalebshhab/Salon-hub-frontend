import { Camera, Save, X } from "lucide-react";
import { useState } from "react";
import MediaSourcePicker from "../../media/components/MediaSourcePicker.jsx";
import useSalonCoverEditor from "../../media/hooks/useSalonCoverEditor.js";
import t from "../../../shared/i18n/t.js";

export default function SalonCoverEditor({ currentUrl, onUploaded }) {
  const [open, setOpen] = useState(false);
  const {
    selection,
    setSelection,
    uploading,
    progress,
    error,
    notice,
    upload,
    cancel,
  } = useSalonCoverEditor((url) => {
    onUploaded?.(url);
    setOpen(false);
  });

  if (!open) {
    return (
      <button
        className="btn btn-secondary salon-cover-open"
        type="button"
        onClick={() => setOpen(true)}
      >
        <Camera size={17} /> {t("Change picture")}
      </button>
    );
  }

  return (
    <div className="salon-cover-editor">
      <button
        className="media-clear-button salon-cover-close"
        type="button"
        disabled={uploading}
        onClick={() => {
          setSelection(null);
          setOpen(false);
        }}
        aria-label={t("Close picture editor")}
      >
        <X size={16} />
      </button>
      <fieldset className="salon-cover-selection" disabled={uploading}>
        <legend className="visually-hidden">{t("Salon picture source")}</legend>
        <MediaSourcePicker
          key={currentUrl}
          label={t("Change salon picture")}
          currentUrl={currentUrl}
          compact
          onChange={setSelection}
        />
      </fieldset>
      {uploading && (
        <div className="salon-cover-progress">
          <p role="status">
            {selection?.file
              ? progress === 100
                ? t("Picture sent. Waiting for the server to save…")
                : progress === null
                  ? t("Sending picture…")
                  : t("Sending picture: {progress}%", { progress })
              : t("Importing picture from Google Drive…")}
          </p>
          <progress
            aria-label={t("Picture transfer progress")}
            max="100"
            value={progress ?? undefined}
          />
          <button className="btn btn-secondary" type="button" onClick={cancel}>
            {t("Cancel upload")}
          </button>
        </div>
      )}
      {error && <p role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}
      <button
        className="btn btn-primary"
        type="button"
        onClick={upload}
        disabled={uploading || (!selection?.file && !selection?.remoteUrl)}
      >
        <Save size={17} /> {uploading ? t("Uploading…") : t("Save picture")}
      </button>
    </div>
  );
}
