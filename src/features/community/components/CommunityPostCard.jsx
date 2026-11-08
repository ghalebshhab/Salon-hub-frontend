import { Heart, MessageCircle, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  formatPostDate,
  getPostAuthorName,
  isVideoMedia,
} from "../model/communityPresentation.js";
import CommunityAvatar from "./CommunityAvatar.jsx";
import CommunityComments from "./CommunityComments.jsx";

export default function CommunityPostCard({
  post,
  comments,
  busy,
  onLike,
  onLoadComments,
  onAddComment,
  onDelete,
}) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const authorName = getPostAuthorName(post);

  const toggleComments = () => {
    const next = !commentsOpen;
    setCommentsOpen(next);
    if (next && comments === undefined) onLoadComments(post.id);
  };

  return (
    <article className="community-post-card">
      <header className="community-post-header">
        <CommunityAvatar name={authorName} salon={Boolean(post.salon)} />
        <div>
          <strong>{authorName}</strong>
          <span>
            @{post.author.userName} · {formatPostDate(post.createdAt)}
          </span>
        </div>
        {post.ownedByMe ? (
          <button
            className="community-icon-button danger"
            type="button"
            aria-label="Delete post"
            disabled={busy === `delete-${post.id}`}
            onClick={() => onDelete(post.id)}
          >
            <Trash2 size={17} />
          </button>
        ) : (
          <MoreHorizontal
            size={20}
            className="community-post-more"
            aria-hidden="true"
          />
        )}
      </header>

      <p className="community-post-copy">{post.content}</p>
      {post.mediaUrl && (
        <div className="community-post-media">
          {isVideoMedia(post.mediaUrl) ? (
            <video controls preload="metadata" src={post.mediaUrl} />
          ) : (
            <img src={post.mediaUrl} alt="Shared community media" />
          )}
        </div>
      )}

      <footer className="community-post-actions">
        <button
          className={
            post.likedByMe ? "community-action active" : "community-action"
          }
          type="button"
          disabled={busy === `like-${post.id}`}
          onClick={() => onLike(post)}
        >
          <Heart size={19} fill={post.likedByMe ? "currentColor" : "none"} />{" "}
          {post.likeCount}
        </button>
        <button
          className="community-action"
          type="button"
          onClick={toggleComments}
        >
          <MessageCircle size={19} /> {post.commentCount}
        </button>
      </footer>

      {commentsOpen && (
        <CommunityComments
          postId={post.id}
          comments={comments}
          busy={busy}
          onAddComment={onAddComment}
        />
      )}
    </article>
  );
}
