import { ArrowRight, Store } from "lucide-react";
import { Link } from "react-router-dom";
import CommunityAvatar from "./CommunityAvatar.jsx";
import t from "../../../shared/i18n/t.js";

export default function FollowedSalonsPanel({
  followedSalons,
  id = "followed-salons",
  loading = false,
}) {
  return (
    <section
      className="community-panel community-following-panel"
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <header className="community-panel-heading">
        <h2 id={`${id}-title`}>
          <Store size={18} aria-hidden="true" /> {t("Followed salons")}
        </h2>
      </header>
      {loading ? (
        <p className="community-network-loading" role="status">
          {t("Loading followed salons…")}
        </p>
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
          <p>
            {t(
              "Your favorite studios will be easy to find here. Explore salons to start your list.",
            )}
          </p>
          <Link to="/#discover" className="community-salon-discover">
            {t("Explore salons")} <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  );
}
