import { Images, MessageSquareText, RotateCw } from "lucide-react";
import { mergeCommunityActions } from "../hooks/useCommunityAction.js";
import CommunityPostCard from "./CommunityPostCard.jsx";
import CommunityProfilePostSkeleton from "./CommunityProfilePostSkeleton.jsx";

export default function CommunityProfileActivity({
  firstName,
  isSelf,
  profileState,
  commentsState,
}) {
  const {
    posts,
    postPage,
    postsLoading,
    postsError,
    busyAction,
    toggleLike,
    deletePost,
    loadMorePosts,
    retryPosts,
  } = profileState;

  return (
    <section className="community-profile-posts">
      <header className="community-profile-section-heading">
        <div>
          <span className="community-card-kicker">Community activity</span>
          <h2 id="profile-posts-title">Posts by {firstName}</h2>
        </div>
        <span><MessageSquareText size={16} /> {postPage.totalElements}</span>
      </header>

      {postsLoading && !posts.length ? (
        <CommunityProfilePostSkeleton />
      ) : postsError && !posts.length ? (
        <div className="community-profile-post-state is-error" role="alert">
          <p>{postsError}</p>
          <button type="button" onClick={retryPosts}>
            <RotateCw size={15} /> Try again
          </button>
        </div>
      ) : posts.length ? (
        <div className="community-profile-post-list">
          {posts.map((post) => (
            <CommunityPostCard
              key={post.id}
              post={post}
              comments={commentsState.commentsByPost[post.id]}
              busy={mergeCommunityActions(commentsState.busyAction, busyAction)}
              onLike={toggleLike}
              onLoadComments={commentsState.loadComments}
              onAddComment={commentsState.addComment}
              onDelete={deletePost}
            />
          ))}
          {!postPage.last && (
            <button
              className="community-profile-load-more"
              type="button"
              disabled={postsLoading}
              onClick={loadMorePosts}
            >
              {postsLoading ? "Loading…" : "Load more posts"}
            </button>
          )}
          {postsError && (
            <p className="community-profile-inline-error">{postsError}</p>
          )}
        </div>
      ) : (
        <div className="community-profile-post-state">
          <Images size={24} />
          <h3>No community posts yet</h3>
          <p>
            {isSelf
              ? "Your stories and work will appear here when you publish them."
              : `${firstName}'s stories and work will appear here.`}
          </p>
        </div>
      )}
    </section>
  );
}
