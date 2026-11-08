import CommunityAvatar from "./CommunityAvatar.jsx";

export default function CommunityIdentityCard({
  user,
  friendCount,
  followedSalonCount,
}) {
  const displayName = `${user?.firstName || ""} ${user?.lastName || ""}`;
  return (
    <section className="community-panel identity-card">
      <span className="community-card-kicker">Your community profile</span>
      <CommunityAvatar name={displayName} size="large" />
      <h2>{displayName}</h2>
      <p>@{user?.userName}</p>
      <div>
        <span>
          {friendCount}
          <small>Friends</small>
        </span>
        <span>
          {followedSalonCount}
          <small>Following</small>
        </span>
      </div>
    </section>
  );
}
