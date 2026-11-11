import { ArrowRight, PenLine, UsersRound } from "lucide-react";

export default function CommunityHero({ friendCount, followedSalonCount }) {
  return (
    <header className="community-hero">
      <div className="container community-hero-inner">
        <div className="community-hero-copy">
          <span className="community-eyebrow">SalonHub / Community</span>
          <h1>Good work grows <em>together.</em></h1>
          <p>Share your craft, find your people, and keep inspiration close.</p>
        </div>
        <div className="community-hero-actions">
          <div className="community-hero-stats" aria-label="Your network summary">
            <span><UsersRound size={16} aria-hidden="true" /> <strong>{friendCount ?? "—"}</strong> friends</span>
            <span><strong>{followedSalonCount ?? "—"}</strong> salons followed</span>
          </div>
          <a className="community-hero-link" href="#discover">
            Find people <ArrowRight size={16} aria-hidden="true" />
          </a>
          <a className="community-hero-create" href="#community-composer">
            <PenLine size={16} aria-hidden="true" /> Create post
          </a>
        </div>
      </div>
    </header>
  );
}
