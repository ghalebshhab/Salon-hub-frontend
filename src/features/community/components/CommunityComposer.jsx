import {
  Check,
  ChevronDown,
  Globe2,
  ImagePlus,
  LoaderCircle,
  Store,
} from "lucide-react";
import { useState } from "react";
import CommunityAvatar from "./CommunityAvatar.jsx";
import { isCommunityActionBusy } from "../hooks/useCommunityAction.js";

export default function CommunityComposer({ user, busy, onPublish }) {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaOpen, setMediaOpen] = useState(false);
  const [publishAsSalon, setPublishAsSalon] = useState(false);
  const [publishError, setPublishError] = useState(false);
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const publishing = isCommunityActionBusy(busy, "create-post");

  const submit = async (event) => {
    event.preventDefault();
    setPublishError(false);
    try {
      const created = await onPublish({
        content,
        mediaUrl: mediaUrl.trim() || null,
        salonId: publishAsSalon ? user?.ownedSalonId : null,
      });
      if (created) {
        setContent("");
        setMediaUrl("");
      } else {
        setPublishError(true);
      }
    } catch {
      setPublishError(true);
    }
  };

  return (
    <form className="community-composer" id="community-composer" onSubmit={submit}>
      <header className="community-composer-heading">
        <div>
          <strong>Start a conversation</strong>
          <span className="community-composer-audience">
            {publishAsSalon ? <Store size={13} aria-hidden="true" /> : <Globe2 size={13} aria-hidden="true" />}
            {publishAsSalon ? "Posting as your salon" : "SalonHub community"}
            <ChevronDown size={13} aria-hidden="true" />
          </span>
        </div>
        <span aria-live="polite">{content.length} / 5000</span>
      </header>
      <div className="community-composer-top">
        <CommunityAvatar name={displayName || user?.userName || "SalonHub member"} />
        <textarea
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            if (publishError) setPublishError(false);
          }}
          maxLength={5000}
          placeholder={`What would you like to share${user?.firstName ? `, ${user.firstName}` : ""}?`}
          aria-label="Post content"
          aria-describedby={publishError ? "community-publish-error" : undefined}
        />
      </div>
      <div className="community-media-input" id="community-media-input" hidden={!mediaOpen}>

          <ImagePlus size={18} aria-hidden="true" />
          <input
            type="url"
            value={mediaUrl}
            onChange={(event) => setMediaUrl(event.target.value)}
            placeholder="Paste an image or video URL"
            aria-label="Media URL"
          />
      </div>
      {publishError && (
        <p className="community-composer-error" id="community-publish-error" role="alert">
          Your post couldn&apos;t be published. Please try again.
        </p>
      )}
      <footer>
        <div className="community-composer-tools">
          <button
            className={mediaOpen ? "is-active" : ""}
            type="button"
            aria-expanded={mediaOpen}
            aria-controls="community-media-input"
            onClick={() => setMediaOpen((open) => !open)}
          >
            <ImagePlus size={18} aria-hidden="true" /> Media URL
          </button>
          {user?.ownedSalonId && (
            <label className={publishAsSalon ? "is-active" : ""}>
              <input
                type="checkbox"
                checked={publishAsSalon}
                onChange={(event) => setPublishAsSalon(event.target.checked)}
              />
              <Store size={17} aria-hidden="true" /> Post as salon
            </label>
          )}
        </div>
        <button className="btn btn-primary community-publish-button" type="submit" disabled={!content.trim() || publishing}>
          {publishing ? (
            <><LoaderCircle size={16} className="community-spinning" aria-hidden="true" /> Publishing…</>
          ) : (
            <><Check size={16} aria-hidden="true" /> Publish post</>
          )}
        </button>
      </footer>
    </form>
  );
}
