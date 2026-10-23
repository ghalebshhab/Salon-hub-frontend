import { NavLink } from "react-router-dom";
import { exploreLinks } from "./navigationConfig.js";

export default function ExploreNavigation({ loggedIn, onNavigate }) {
  return (
    <div className="main-nav-links">
      <span className="nav-group-label">Explore</span>
      {exploreLinks
        .filter((link) => link.public || loggedIn)
        .map(({ to, label, icon: Icon }) => (
          <NavLink
            to={to}
            className="creative-nav-link"
            onClick={onNavigate}
            key={to}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
    </div>
  );
}
