import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../../../shared/auth/useAuth.js";
import CommunityAside from "../components/CommunityAside.jsx";
import CommunityFeed from "../components/CommunityFeed.jsx";
import CommunityHeader from "../components/CommunityHeader.jsx";
import CommunityTabs from "../components/CommunityTabs.jsx";
import FollowedSalonsPanel from "../components/FollowedSalonsPanel.jsx";
import FriendRequestsPanel from "../components/FriendRequestsPanel.jsx";
import PeopleDiscoveryPanel from "../components/PeopleDiscoveryPanel.jsx";
import useCommunityComments from "../hooks/useCommunityComments.js";
import useCommunityNetwork from "../hooks/useCommunityNetwork.js";
import useCommunityPosts from "../hooks/useCommunityPosts.js";
import useCommunitySectionRoute from "../hooks/useCommunitySectionRoute.js";
import { communitySectionFor } from "../model/communityRoutes.js";

export default function Community() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const section = communitySectionFor(pathname);
  const posts = useCommunityPosts();
  const comments = useCommunityComments({
    onCommentAdded: posts.incrementCommentCount,
  });
  const network = useCommunityNetwork();
  const { searchPeople } = network;
  useCommunitySectionRoute();

  // Suggestions outside Discover always show the unfiltered list.
  useEffect(() => {
    if (section !== "discover") searchPeople("");
  }, [section, searchPeople]);

  const counts = {
    requests: network.loading ? null : network.requests.length,
    following: network.loading ? null : network.followedSalons.length,
  };

  return (
    <main className="community-page community-workspace-v2">
      <div className="container">
        <CommunityHeader />
        <CommunityTabs active={section} counts={counts} />
        <div className="community-v2-layout" id="community-section">
          <div className="community-v2-main">
            {section === "feed" && (
              <CommunityFeed user={user} posts={posts} comments={comments} />
            )}
            {section === "discover" && (
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
            )}
            {section === "requests" && (
              <FriendRequestsPanel
                requests={network.requests}
                busy={network.busyAction}
                loading={network.loading}
                onAccept={network.accept}
                onDecline={network.decline}
              />
            )}
            {section === "following" && (
              <FollowedSalonsPanel
                followedSalons={network.followedSalons}
                loading={network.loading}
              />
            )}
          </div>
          <CommunityAside user={user} network={network} section={section} />
        </div>
      </div>
    </main>
  );
}
