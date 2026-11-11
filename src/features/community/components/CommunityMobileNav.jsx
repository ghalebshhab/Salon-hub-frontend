import { NavLink } from "react-router-dom";
import { COMMUNITY_ROUTES } from "../model/communityRoutes.js";

export default function CommunityMobileNav({ requestCount }) {
  return (
    <nav className="community-mobile-nav" aria-label="Community sections">
      <NavLink to={COMMUNITY_ROUTES.feed} end>Feed</NavLink>
      <NavLink to={COMMUNITY_ROUTES.discover}>Discover</NavLink>
      <NavLink to={COMMUNITY_ROUTES.requests}>
        Requests{requestCount ? ` · ${requestCount}` : ""}
      </NavLink>
      <NavLink to={COMMUNITY_ROUTES.following}>Following</NavLink>
    </nav>
  );
}
