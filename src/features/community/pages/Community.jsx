import useAuth from "../../../shared/auth/useAuth.js";
import CommunityFeed from "../components/CommunityFeed.jsx";
import CommunityHero from "../components/CommunityHero.jsx";
import CommunityMobileNav from "../components/CommunityMobileNav.jsx";
import CommunityNetworkRail from "../components/CommunityNetworkRail.jsx";
import useCommunityComments from "../hooks/useCommunityComments.js";
import useCommunityNetwork from "../hooks/useCommunityNetwork.js";
import useCommunityPosts from "../hooks/useCommunityPosts.js";
import useCommunitySectionRoute from "../hooks/useCommunitySectionRoute.js";

export default function Community() {
  const { user } = useAuth();
  const posts = useCommunityPosts();
  const comments = useCommunityComments({
    onCommentAdded: posts.incrementCommentCount,
  });
  const network = useCommunityNetwork();
  useCommunitySectionRoute();
  const requestCount = network.loading ? 0 : network.requests.length;

  return (
    <main className="community-page">
      <CommunityHero
        friendCount={network.loading ? null : network.friends.length}
        followedSalonCount={network.loading ? null : network.followedSalons.length}
        requestCount={network.loading ? null : network.requests.length}
      />

      <div className="container community-content">
        <CommunityMobileNav requestCount={requestCount} />
        <div className="community-workspace">
          <CommunityFeed user={user} posts={posts} comments={comments} />
          <CommunityNetworkRail user={user} network={network} />
        </div>
      </div>
    </main>
  );
}
