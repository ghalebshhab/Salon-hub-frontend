import { ImagePlus } from "lucide-react";
import { useState } from "react";
import CommunityAvatar from "./CommunityAvatar.jsx";

export default function CommunityComposer({ user, busy, onPublish }) {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
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
          <span className="community-card-kicker">Create / Share</span>
          <strong>Start a conversation</strong>
        </div>
        <span>{content.length} / 5000</span>
      </header>
      <div className="community-composer-top">
        <CommunityAvatar name={displayName} />
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={5000}
          placeholder="Share a style, a story, or something useful…"
          aria-label="Post content"
        />
      </div>
      <div className="community-media-input">
        <ImagePlus size={18} />
        <input
          type="url"
          value={mediaUrl}
          onChange={(event) => setMediaUrl(event.target.value)}
          placeholder="Optional image or video URL"
          aria-label="Media URL"
        />
      </div>
      <footer>
        {user?.ownedSalonId ? (
          <label>
            <input
              type="checkbox"
              checked={publishAsSalon}
              onChange={(event) => setPublishAsSalon(event.target.checked)}
            />
            Publish as my salon
          </label>
        ) : (
          <span />
        )}
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
