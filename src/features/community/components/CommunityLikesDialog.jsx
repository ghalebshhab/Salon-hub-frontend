import { Heart, X } from "lucide-react";
import { useEffect } from "react";
import useCommunityPostLikes from "../hooks/useCommunityPostLikes.js";
import CommunityProfileLink from "./CommunityProfileLink.jsx";

export default function CommunityLikesDialog({ postId, onClose }) {
  const { likes, loading, error } = useCommunityPostLikes(postId);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div
      className="community-modal-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className="community-likes-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`likes-title-${postId}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <span className="community-likes-mark">
              <Heart size={15} fill="currentColor" />
            </span>
            <div>
              <h2 id={`likes-title-${postId}`}>People who liked this</h2>
              <p>Discover the people engaging with this post.</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close likes"
            onClick={onClose}
            autoFocus
          >
            <X size={19} />
          </button>
        </header>
        <div className="community-likes-list">
          {loading && <p className="community-muted">Loading likes…</p>}
          {error && <p className="community-likes-error">{error}</p>}
          {!loading && !error && !likes.length && (
            <div className="community-likes-empty">
              <Heart size={24} />
              <p>No likes yet. Be the first to show some love.</p>
            </div>
          )}
          {likes.map((like) => (
            <CommunityProfileLink
              className="community-liker"
              key={like.user.id}
              user={like.user}
              onClick={onClose}
            >
              <span className="community-profile-link-copy">
                <strong>{like.user.displayName || like.user.userName}</strong>
                <small>@{like.user.userName}</small>
              </span>
              <span className="community-view-profile">View profile</span>
            </CommunityProfileLink>
          ))}
        </div>
      </section>
    </div>
  );
}
