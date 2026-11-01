import { Camera, Save, X } from "lucide-react";
import { useState } from "react";
import MediaSourcePicker from "../../media/components/MediaSourcePicker.jsx";
import useSalonCoverEditor from "../../media/hooks/useSalonCoverEditor.js";

export default function SalonCoverEditor({ currentUrl, onUploaded }) {
  const [open, setOpen] = useState(false);
  const { selection, setSelection, uploading, upload } = useSalonCoverEditor((url) => {
    onUploaded?.(url);
    setOpen(false);
  });

  if (!open) {
    return <button className="btn btn-secondary salon-cover-open" type="button" onClick={() => setOpen(true)}><Camera size={17} /> Change picture</button>;
  }

  return (
    <div className="salon-cover-editor">
      <button className="media-clear-button salon-cover-close" type="button" onClick={() => setOpen(false)} aria-label="Close picture editor"><X size={16} /></button>
      <MediaSourcePicker key={currentUrl} label="Change salon picture" currentUrl={currentUrl} compact onChange={setSelection} />
      <button className="btn btn-primary" type="button" onClick={upload} disabled={uploading || !selection}>
        <Save size={17} /> {uploading ? "Uploading…" : "Save picture"}
      </button>
    </div>
  );
}
