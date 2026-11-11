import { ArrowRight, Bell, PenLine, Store, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { COMMUNITY_ROUTES } from "../model/communityRoutes.js";

export default function CommunityHero({ friendCount, followedSalonCount, requestCount }) {
  return (
    <header className="community-hero">
      <div className="container community-hero-inner">
        <div className="community-hero-copy">
          <span className="community-eyebrow">SalonHub community</span>
          <h1>Where the beauty community <em>comes together.</em></h1>
          <p>Share your work, exchange ideas, and build relationships with people who understand the craft.</p>
        </div>
        <div className="community-overview" aria-label="Your community overview">
          <div className="community-overview-stats">
            <span><UsersRound size={17} aria-hidden="true" /><strong>{friendCount ?? "—"}</strong><small>Friends</small></span>
            <span><Store size={17} aria-hidden="true" /><strong>{followedSalonCount ?? "—"}</strong><small>Following</small></span>
            <span className={requestCount ? "has-updates" : ""}><Bell size={17} aria-hidden="true" /><strong>{requestCount ?? "—"}</strong><small>Requests</small></span>
          </div>
          <div className="community-hero-actions">
            <Link className="community-hero-link" to={COMMUNITY_ROUTES.discover}>
              Find people <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link className="community-hero-create" to={COMMUNITY_ROUTES.create}>
              <PenLine size={16} aria-hidden="true" /> Create post
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
