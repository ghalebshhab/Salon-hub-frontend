import useAuth from "../../../shared/auth/useAuth.js";
import Loading from "../../../shared/components/Loading.jsx";
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

export default function Community() {
  const { user } = useAuth();
  const posts = useCommunityPosts();
  const comments = useCommunityComments({
    onCommentAdded: posts.incrementCommentCount,
  });
  const network = useCommunityNetwork();

  if (posts.loading || network.loading)
    return <Loading message="Opening the SalonHub community…" />;

  return (
    <main className="community-page">
      <CommunityHero
        friendCount={network.friends.length}
        followedSalonCount={network.followedSalons.length}
      />

      <div className="container community-layout">
        <aside className="community-left-rail">
          <CommunityIdentityCard
            user={user}
            friendCount={network.friends.length}
            followedSalonCount={network.followedSalons.length}
          />
          <FriendRequestsPanel
            requests={network.requests}
            busy={network.busyAction}
            onAccept={network.accept}
            onDecline={network.decline}
          />
          <FollowedSalonsPanel followedSalons={network.followedSalons} />
        </aside>

        <section className="community-feed">
          <CommunityFeedHeading postCount={posts.posts.length} />
          <CommunityComposer
            user={user}
            busy={posts.busyAction}
            onPublish={posts.createPost}
          />
          {posts.posts.length ? (
            posts.posts.map((post) => (
              <CommunityPostCard
                key={post.id}
                post={post}
                comments={comments.commentsByPost[post.id]}
                busy={comments.busyAction || posts.busyAction}
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

        <aside className="community-right-rail">
          <PeopleDiscoveryPanel
            people={network.people}
            busy={network.busyAction}
            onSearch={network.searchPeople}
            onConnect={network.connect}
            onAccept={network.accept}
            onDecline={network.decline}
          />
        </aside>
      </div>
    </main>
  );
}
