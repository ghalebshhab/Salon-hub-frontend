import { ChevronDown, Globe2, ImagePlus, Store } from "lucide-react";
import { useState } from "react";
import CommunityAvatar from "./CommunityAvatar.jsx";

export default function CommunityComposer({ user, busy, onPublish }) {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaOpen, setMediaOpen] = useState(false);
  const [publishAsSalon, setPublishAsSalon] = useState(false);
  const displayName = `${user?.firstName || ""} ${user?.lastName || ""}`;

  const submit = async (event) => {
    event.preventDefault();
    const created = await onPublish({
      content,
      mediaUrl: mediaUrl.trim() || null,
      salonId: publishAsSalon ? user?.ownedSalonId : null,
    });
    if (created) {
      setContent("");
      setMediaUrl("");
    }
  };

  return (
    <form className="community-composer" onSubmit={submit}>
      <header className="community-composer-heading">
        <div>
          <strong>Create a post</strong>
          <span className="community-composer-audience">
            <Globe2 size={13} /> SalonHub community <ChevronDown size={13} />
          </span>
        </div>
        <span>{content.length} / 5000</span>
      </header>
      <div className="community-composer-top">
        <CommunityAvatar name={displayName} />
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={5000}
          placeholder={`What would you like to share, ${user?.firstName || "today"}?`}
          aria-label="Post content"
        />
      </div>
      {mediaOpen && (
        <div className="community-media-input">
          <ImagePlus size={18} />
          <input
            type="url"
            value={mediaUrl}
            onChange={(event) => setMediaUrl(event.target.value)}
            placeholder="Paste an image or video URL"
            aria-label="Media URL"
            autoFocus
          />
        </div>
      )}
      <footer>
        <div className="community-composer-tools">
          <button
            className={mediaOpen ? "is-active" : ""}
            type="button"
            onClick={() => setMediaOpen((open) => !open)}
          >
            <ImagePlus size={18} /> Media
          </button>
          {user?.ownedSalonId && (
            <label className={publishAsSalon ? "is-active" : ""}>
              <input
                type="checkbox"
                checked={publishAsSalon}
                onChange={(event) => setPublishAsSalon(event.target.checked)}
              />
              <Store size={17} /> Post as salon
            </label>
          )}
        </div>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={!content.trim() || busy === "create-post"}
        >
          Publish post
        </button>
      </footer>
    </form>
  );
}
