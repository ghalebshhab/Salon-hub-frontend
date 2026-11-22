import { Images, MessageSquareText, RotateCw } from "lucide-react";
import { mergeCommunityActions } from "../hooks/useCommunityAction.js";
import CommunityPostCard from "./CommunityPostCard.jsx";
import CommunityProfilePostSkeleton from "./CommunityProfilePostSkeleton.jsx";
import t from "../../../shared/i18n/t.js";

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
          <span className="community-card-kicker">
            {t("Community activity")}
          </span>
          <h2 id="profile-posts-title">
            {t("Posts by {firstName}", { firstName })}
          </h2>
        </div>
        <span>
          <MessageSquareText size={16} /> {postPage.totalElements}
        </span>
      </header>

      {postsLoading && !posts.length ? (
        <CommunityProfilePostSkeleton />
      ) : postsError && !posts.length ? (
        <div className="community-profile-post-state is-error" role="alert">
          <p>{postsError}</p>
          <button type="button" onClick={retryPosts}>
            <RotateCw size={15} /> {t("Try again")}
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
              {postsLoading ? t("Loading…") : t("Load more posts")}
            </button>
          )}
          {postsError && (
            <p className="community-profile-inline-error">{postsError}</p>
          )}
        </div>
      ) : (
        <div className="community-profile-post-state">
          <Images size={24} />
          <h3>{t("No community posts yet")}</h3>
          <p>
            {isSelf
              ? t(
                  "Your stories and work will appear here when you publish them.",
                )
              : t("{firstName}'s stories and work will appear here.", {
                  firstName,
                })}
          </p>
        </div>
      )}
    </section>
  );
}
