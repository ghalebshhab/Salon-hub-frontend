import { RotateCw } from "lucide-react";
import { mergeCommunityActions } from "../hooks/useCommunityAction.js";
import CommunityComposer from "./CommunityComposer.jsx";
import CommunityEmptyFeed from "./CommunityEmptyFeed.jsx";
import CommunityFeedHeading from "./CommunityFeedHeading.jsx";
import CommunityFeedSkeleton from "./CommunityFeedSkeleton.jsx";
import CommunityPostCard from "./CommunityPostCard.jsx";

export default function CommunityFeed({ user, posts, comments }) {
  return (
    <section
      className="community-feed"
      id="community-feed"
      tabIndex={-1}
      aria-labelledby="community-feed-title"
      aria-busy={posts.loading}
    >
      <CommunityFeedHeading postCount={posts.posts.length} />
      <CommunityComposer
        user={user}
        busy={posts.busyAction}
        onPublish={posts.createPost}
      />
      {posts.loading ? (
        <CommunityFeedSkeleton />
      ) : posts.feedError ? (
        <div className="community-feed-error" role="alert">
          <span>We couldn&apos;t load the community feed.</span>
          <button type="button" onClick={posts.retryFeed}>
            <RotateCw size={15} aria-hidden="true" /> Try again
          </button>
        </div>
      ) : posts.posts.length ? (
        posts.posts.map((post) => (
          <CommunityPostCard
            key={post.id}
            post={post}
            comments={comments.commentsByPost[post.id]}
            busy={mergeCommunityActions(comments.busyAction, posts.busyAction)}
            onLike={posts.toggleLike}
            onLoadComments={comments.loadComments}
            onAddComment={comments.addComment}
            onDelete={posts.deletePost}
          />
        ))
      ) : (
        <CommunityEmptyFeed />
      )}
    </section>
  );
}
