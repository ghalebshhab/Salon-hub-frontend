import CommunityIdentityCard from "./CommunityIdentityCard.jsx";
import FollowedSalonsPanel from "./FollowedSalonsPanel.jsx";
import FriendRequestsPanel from "./FriendRequestsPanel.jsx";
import PeopleDiscoveryPanel from "./PeopleDiscoveryPanel.jsx";

export default function CommunityNetworkRail({ user, network }) {
  return (
    <aside className="community-network-rail" aria-label="Community network">
      <div className="community-network-sticky">
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
      </div>
    </aside>
  );
}
