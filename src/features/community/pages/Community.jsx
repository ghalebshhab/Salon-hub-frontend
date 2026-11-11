import useAuth from "../../../shared/auth/useAuth.js";
import CommunityComposer from "../components/CommunityComposer.jsx";
import CommunityEmptyFeed from "../components/CommunityEmptyFeed.jsx";
import CommunityFeedHeading from "../components/CommunityFeedHeading.jsx";
import CommunityHero from "../components/CommunityHero.jsx";
import CommunityIdentityCard from "../components/CommunityIdentityCard.jsx";
import CommunityPostCard from "../components/CommunityPostCard.jsx";
import FollowedSalonsPanel from "../components/FollowedSalonsPanel.jsx";
import FriendRequestsPanel from "../components/FriendRequestsPanel.jsx";
import PeopleDiscoveryPanel from "../components/PeopleDiscoveryPanel.jsx";
import useCommunityComments from "../hooks/useCommunityComments.js";
import useCommunityNetwork from "../hooks/useCommunityNetwork.js";
import useCommunityPosts from "../hooks/useCommunityPosts.js";
import { mergeCommunityActions } from "../hooks/useCommunityAction.js";
import { RotateCw } from "lucide-react";

function CommunityFeedSkeleton() {
  return (
    <div
      className="community-feed-skeletons"
      role="status"
      aria-label="Loading community posts"
      aria-busy="true"
    >
      {[0, 1].map((item) => (
        <article className="community-feed-skeleton" key={item} aria-hidden="true">
          <div className="community-skeleton-author">
            <span />
            <div>
              <i />
              <i />
            </div>
          </div>
          <i className="community-skeleton-line" />
          <i className="community-skeleton-line is-short" />
          <i className="community-skeleton-block" />
        </article>
      ))}
      <span className="sr-only">Loading posts…</span>
    </div>
  );
}

export default function Community() {
  const { user } = useAuth();
  const posts = useCommunityPosts();
  const comments = useCommunityComments({
    onCommentAdded: posts.incrementCommentCount,
  });
  const network = useCommunityNetwork();

  return (
    <main className="community-page">
      <CommunityHero
        friendCount={network.loading ? null : network.friends.length}
        followedSalonCount={network.loading ? null : network.followedSalons.length}
      />

      <div className="container community-layout">
        <PeopleDiscoveryPanel
          people={network.people}
          loading={network.peopleLoading}
          error={network.peopleError}
          busy={network.busyAction}
          onSearch={network.searchPeople}
          onRetry={network.retryPeopleSearch}
          onConnect={network.connect}
          onAccept={network.accept}
          onDecline={network.decline}
        />

        <nav className="community-mobile-nav" aria-label="Community sections">
          <a href="#community-feed">Feed</a>
          <a
            href="#discover"
            onClick={() => document.getElementById("community-people-search")?.focus()}
          >
            Discover
          </a>
          <a href="#friend-requests">
            Requests{!network.loading && network.requests.length ? ` · ${network.requests.length}` : ""}
          </a>
          <a href="#followed-salons">Following</a>
        </nav>

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

        <aside className="community-left-rail" aria-label="Your network">
          <CommunityIdentityCard
            user={user}
            friendCount={network.friends.length}
            followedSalonCount={network.followedSalons.length}
            loading={network.loading}
          />
          <FriendRequestsPanel
            requests={network.requests}
            busy={network.busyAction}
            loading={network.loading}
            onAccept={network.accept}
            onDecline={network.decline}
          />
          <FollowedSalonsPanel
            followedSalons={network.followedSalons}
            loading={network.loading}
          />
        </aside>
      </div>
    </main>
  );
}
