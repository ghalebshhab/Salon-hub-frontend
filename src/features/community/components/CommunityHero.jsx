import { Sparkles } from "lucide-react";

export default function CommunityHero({ friendCount, followedSalonCount }) {
  return (
    <section className="community-hero">
      <div className="container community-hero-inner">
        <div className="community-hero-copy">
          <span className="community-eyebrow">
            <Sparkles size={15} /> SalonHub community
          </span>
          <h1>
            Find your people.
            <br />
            <em>Share your craft.</em>
          </h1>
          <p>
            Share your work, celebrate ideas, meet professionals, and stay close
            to the salons you love.
          </p>
        </div>
        <div className="community-hero-stats" aria-label="Community summary">
          <div className="community-hero-stat">
            <span>Your network</span>
            <strong>{friendCount}</strong>
            <small>professional connections</small>
          </div>
          <div className="community-hero-stat">
            <span>Salon inspiration</span>
            <strong>{followedSalonCount}</strong>
            <small>studios in your circle</small>
          </div>
        </div>
      </div>
    </section>
  );
}
