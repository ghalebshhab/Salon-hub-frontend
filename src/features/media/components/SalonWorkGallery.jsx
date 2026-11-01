import { Image as ImageIcon, Play, Trash2, UploadCloud } from "lucide-react";
import MediaSourcePicker from "./MediaSourcePicker.jsx";
import useSalonWorkGallery from "../hooks/useSalonWorkGallery.js";
import { optimizedCloudinaryImage } from "../model/cloudinaryMedia.js";

export default function SalonWorkGallery({ salonId }) {
  const {
    user,
    items,
    loading,
    canPublish,
    selection,
    setSelection,
    caption,
    setCaption,
    publishing,
    publish,
    remove,
  } = useSalonWorkGallery(salonId);

  return (
    <div className="salon-work-gallery-wrap">
      {canPublish && (
        <div className="salon-work-publisher">
          <div><UploadCloud size={22} /><div><strong>Share your latest work</strong><p>Publish a salon work photo or short video from your device or Google Drive.</p></div></div>
          <MediaSourcePicker label="Work photo or video" allowVideo compact onChange={setSelection} />
          <label className="form-group"><span>Caption</span><textarea value={caption} onChange={(event) => setCaption(event.target.value)} maxLength="300" rows="3" placeholder="Describe the style, technique, or result…" /></label>
          <button className="btn btn-primary" type="button" disabled={publishing || !selection} onClick={publish}>{publishing ? "Publishing…" : "Publish work"}</button>
        </div>
      )}
      {loading ? <div className="salon-gallery-loading">Loading salon work…</div> : !items.length ? (
        <div className="salon-team-empty"><ImageIcon size={30} /><h3>No work published yet</h3><p>The team&apos;s photos and videos will appear here.</p></div>
      ) : (
        <div className="salon-work-grid">
          {items.map((item) => (
            <article className="salon-work-card" key={item.id}>
              <div className="salon-work-media">
                {item.resourceType === "VIDEO" ? <video src={item.secureUrl} controls preload="metadata" aria-label={item.caption || `Video by ${item.employeeName}`} /> : <img src={optimizedCloudinaryImage(item.secureUrl, { width: 900, height: 675 })} alt={item.caption || `Work by ${item.employeeName}`} loading="lazy" />}
                <span>{item.resourceType === "VIDEO" ? <Play size={13} /> : <ImageIcon size={13} />} {item.resourceType.toLowerCase()}</span>
              </div>
              <div className="salon-work-copy">
                <div><strong>{item.employeeName}</strong><small>{item.employeeSpecialty || "Salon professional"}</small></div>
                {item.caption && <p>{item.caption}</p>}
                {Number(user?.id) === Number(item.employeeId) && <button type="button" className="media-delete-button" onClick={() => remove(item.id)}><Trash2 size={15} /> Delete</button>}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
