import CommunityAvatar from "./CommunityAvatar.jsx";

export default function CommunityIdentityCard({ user, friendCount, followedSalonCount, loading = false }) {
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  return (
    <section className="community-panel identity-card" aria-labelledby="community-profile-name">
      <span className="community-card-kicker">Your profile</span>
      <div className="community-profile-preview">
        <CommunityAvatar name={displayName || user?.userName || "SalonHub member"} size="large" />
        <div>
          <h2 id="community-profile-name">{displayName || "SalonHub member"}</h2>
          {user?.userName && <p>@{user.userName}</p>}
        </div>
      </div>
      <dl className="community-profile-stats">
        <div><dt>Friends</dt><dd>{loading ? "—" : friendCount}</dd></div>
        <div><dt>Salons followed</dt><dd>{loading ? "—" : followedSalonCount}</dd></div>
      </dl>
    </section>
  );
}
