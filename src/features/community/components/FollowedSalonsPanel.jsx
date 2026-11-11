import { ArrowRight, Store } from "lucide-react";
import { Link } from "react-router-dom";
import CommunityAvatar from "./CommunityAvatar.jsx";

export default function FollowedSalonsPanel({ followedSalons, id = "followed-salons", loading = false }) {
  return (
    <section className="community-panel community-following-panel" id={id} aria-labelledby={`${id}-title`}>
      <header className="community-panel-heading">
        <h2 id={`${id}-title`}>
          <Store size={18} aria-hidden="true" /> Followed salons
        </h2>
      </header>
      {loading ? (
        <p className="community-network-loading" role="status">Loading followed salons…</p>
      ) : followedSalons.length ? (
        <ul className="community-salon-list">
          {followedSalons.map(({ salon }) => (
            <li className="community-salon-row" key={salon.id}>
              <CommunityAvatar name={salon.name} salon size="small" />
              <Link to={`/salons/${salon.id}`} className="community-salon-link">
                <span>{salon.name}</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="community-salon-empty">
          <p>Your favorite studios will be easy to find here. Explore salons to start your list.</p>
          <Link to="/#discover" className="community-salon-discover">
            Explore salons <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  );
}
