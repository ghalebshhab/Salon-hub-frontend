import { useId, useState } from "react";
import { ChevronDown, UploadCloud } from "lucide-react";
import MediaSourcePicker from "../MediaSourcePicker.jsx";

const CAPTION_MAX = 300;

/**
 * For employees of this salon: a closed panel that opens to publish a
 * photo or a short video. It closes again after a publish.
 */
export default function WorkPublisher({
  selection,
  setSelection,
  caption,
  setCaption,
  publishing,
  publish,
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const submit = async () => {
    if (await publish()) setOpen(false);
  };

  return (
    <div className={`wk-publisher${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="wk-publisher-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="wk-publisher-icon" aria-hidden="true">
          <UploadCloud size={20} />
        </span>
        <span className="wk-publisher-title">
          <strong>Share your latest work</strong>
          <span>
            A photo or a short video, from your device or Google Drive.
          </span>
        </span>
        <ChevronDown
          size={18}
          className="wk-publisher-chevron"
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="wk-publisher-panel" id={panelId}>
          <MediaSourcePicker
            label="Work photo or video"
            allowVideo
            compact
            onChange={setSelection}
          />
          <label className="form-group">
            <span>Caption</span>
            <textarea
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              maxLength={CAPTION_MAX}
              rows="3"
              placeholder="Describe the style, technique or result…"
            />
            <small className="wk-publisher-count">
              {caption.length} / {CAPTION_MAX}
            </small>
          </label>
          <button
            className="btn btn-primary"
            type="button"
            disabled={publishing || !selection}
            onClick={submit}
          >
            {publishing ? "Publishing…" : "Publish work"}
          </button>
        </div>
      )}
    </div>
  );
}
