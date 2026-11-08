import { Camera, Save, X } from "lucide-react";
import { useState } from "react";
import MediaSourcePicker from "../../media/components/MediaSourcePicker.jsx";
import useSalonCoverEditor from "../../media/hooks/useSalonCoverEditor.js";

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
        <Camera size={17} /> Change picture
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
        aria-label="Close picture editor"
      >
        <X size={16} />
      </button>
      <fieldset className="salon-cover-selection" disabled={uploading}>
        <legend className="visually-hidden">Salon picture source</legend>
        <MediaSourcePicker
          key={currentUrl}
          label="Change salon picture"
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
                ? "Picture sent. Waiting for the server to save…"
                : progress === null
                  ? "Sending picture…"
                  : `Sending picture: ${progress}%`
              : "Importing picture from Google Drive…"}
          </p>
          <progress
            aria-label="Picture transfer progress"
            max="100"
            value={progress ?? undefined}
          />
          <button className="btn btn-secondary" type="button" onClick={cancel}>
            Cancel upload
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
        <Save size={17} /> {uploading ? "Uploading…" : "Save picture"}
      </button>
    </div>
  );
}
