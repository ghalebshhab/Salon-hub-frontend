import { Heart, Flag, MessageCircle, Send, Trash2 } from "lucide-react";
import {
  formatPostDate,
  getPostAuthorName,
  isVideoMedia,
} from "../model/communityPresentation.js";
import CommunityComments from "./CommunityComments.jsx";
import CommunityLikesDialog from "./CommunityLikesDialog.jsx";
import CommunityProfileLink from "./CommunityProfileLink.jsx";
import ReportDialog from "../../moderation/components/ReportDialog.jsx";
import { isCommunityActionBusy } from "../hooks/useCommunityAction.js";
import useCommunityPostCard from "../hooks/useCommunityPostCard.js";

export default function CommunityPostCard({
  post,
  comments,
  busy,
  onLike,
  onLoadComments,
  onAddComment,
  onDelete,
}) {
  const authorName = getPostAuthorName(post);
  const interactions = useCommunityPostCard({
    post,
    authorName,
    comments,
    onLoadComments,
  });

  return (
    <article className="community-post-card">
      <header className="community-post-header">
        <CommunityProfileLink user={post.author} salon={Boolean(post.salon)}>
          <span className="community-profile-link-copy">
            <span className="community-post-author-line">
              <strong>{authorName}</strong>
              {post.salon && <small>Salon</small>}
            </span>
            <small>
              @{post.author.userName} · {formatPostDate(post.createdAt)}
            </small>
          </span>
        </CommunityProfileLink>
        {post.ownedByMe ? (
          <button
            className="community-icon-button danger"
            type="button"
            aria-label="Delete post"
            disabled={isCommunityActionBusy(busy, `delete-${post.id}`)}
            onClick={() => onDelete(post.id)}
          >
            <Trash2 size={17} />
          </button>
        ) : (
          <button
            className="community-icon-button"
            type="button"
            aria-label="Report post"
            title="Report post"
            onClick={interactions.openReport}
          >
            <Flag size={17} />
          </button>
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

      <div className="community-post-engagement" aria-label="Post engagement">
        <button
          className="community-like-summary"
          type="button"
          onClick={interactions.openLikes}
          aria-label={`See ${post.likeCount} people who liked this post`}
        >
          <span aria-hidden="true">
            <Heart size={11} fill="currentColor" />
          </span>
          {post.likeCount} {post.likeCount === 1 ? "like" : "likes"}
        </button>
        <button type="button" onClick={interactions.toggleComments}>
          {post.commentCount} {post.commentCount === 1 ? "comment" : "comments"}
        </button>
      </div>

      <footer className="community-post-actions">
        <button
          className={
            post.likedByMe ? "community-action active" : "community-action"
          }
          type="button"
          aria-label={post.likedByMe ? "Unlike post" : "Like post"}
          aria-pressed={post.likedByMe}
          disabled={isCommunityActionBusy(busy, `like-${post.id}`)}
          onClick={() => onLike(post)}
        >
          <Heart size={19} fill={post.likedByMe ? "currentColor" : "none"} />
          <span>{post.likedByMe ? "Liked" : "Like"}</span>
        </button>
        <button
          className={
            interactions.commentsOpen
              ? "community-action active-comment"
              : "community-action"
          }
          type="button"
          onClick={interactions.toggleComments}
        >
          <MessageCircle size={19} /> <span>Comment</span>
        </button>
        <button className="community-action" type="button" onClick={interactions.sharePost}>
          <Send size={18} /> <span>{interactions.shared ? "Link copied" : "Share"}</span>
        </button>
      </footer>

      {interactions.commentsOpen && (
        <CommunityComments
          postId={post.id}
          comments={comments}
          busy={busy}
          onAddComment={onAddComment}
        />
      )}
      {interactions.likesOpen && (
        <CommunityLikesDialog
          postId={post.id}
          onClose={interactions.closeLikes}
        />
      )}
      {interactions.reportOpen && (
        <ReportDialog
          targetType="POST"
          targetId={post.id}
          targetLabel="post"
          onClose={interactions.closeReport}
        />
      )}
    </article>
  );
}
