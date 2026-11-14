import { PenLine } from "lucide-react";
import { Link } from "react-router-dom";
import { COMMUNITY_ROUTES } from "../model/communityRoutes.js";

// Compact page header: what this place is, and the one main action.
export default function CommunityHeader() {
  return (
    <header className="community-header">
      <div className="community-header-copy">
        <span className="community-header-eyebrow">SalonHub community</span>
        <h1>
          Where the beauty community <em>comes together</em>
        </h1>
        <p>
          Share your work, learn from peers, and grow your professional network.
        </p>
      </div>
      <Link className="community-header-action" to={COMMUNITY_ROUTES.create}>
        <PenLine aria-hidden="true" />
        Create post
      </Link>
    </header>
  );
}
