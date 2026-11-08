import { Store } from "lucide-react";
import CommunityAvatar from "./CommunityAvatar.jsx";

export default function FollowedSalonsPanel({ followedSalons }) {
  return (
    <section className="community-panel">
      <header>
        <h2>
          <Store size={18} /> Followed salons
        </h2>
      </header>
      {followedSalons.length ? (
        followedSalons.map(({ salon }) => (
          <div className="community-salon-row" key={salon.id}>
            <CommunityAvatar name={salon.name} salon size="small" />
            <strong>{salon.name}</strong>
          </div>
        ))
      ) : (
        <p className="community-muted">
          Follow a salon from its profile to see it here.
        </p>
      )}
    </section>
  );
}
