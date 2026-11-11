import {
  BriefcaseBusiness,
  ExternalLink,
  MapPin,
  Sparkles,
  Store,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function CommunityProfileSidebar({ profile, viewModel }) {
  const { displayName, firstName, role, salonRelationship } = viewModel;

  return (
    <aside
      className="community-profile-sidebar"
      aria-label={`${displayName}'s professional details`}
    >
      <section className="community-profile-detail-card">
        <span className="community-profile-detail-icon">
          <UserRoundCheck size={18} />
        </span>
        <div>
          <span className="community-card-kicker">Community identity</span>
          <h2>{role.label}</h2>
          <p>{role.summary}</p>
        </div>
      </section>

      {profile.salonId && (
        <Link className="community-profile-salon-card" to={`/salons/${profile.salonId}`}>
          <span><Store size={20} /></span>
          <div>
            <small>{salonRelationship}</small>
            <strong>{profile.salonName}</strong>
            <em>View salon profile <ExternalLink size={13} /></em>
          </div>
        </Link>
      )}

      <section className="community-profile-detail-card">
        <span className="community-profile-detail-icon"><Sparkles size={18} /></span>
        <div>
          <span className="community-card-kicker">Skills and specialties</span>
          <div className="community-skill-list">
            {(profile.skills || []).length ? (
              profile.skills.map((skill) => <span key={skill}>{skill}</span>)
            ) : (
              <p>No specialties shared yet.</p>
            )}
          </div>
        </div>
      </section>

      {(profile.preferredWorkLocations || []).length > 0 && (
        <section className="community-profile-detail-card">
          <span className="community-profile-detail-icon"><MapPin size={18} /></span>
          <div>
            <span className="community-card-kicker">Preferred locations</span>
            <p>{profile.preferredWorkLocations.join(" · ")}</p>
          </div>
        </section>
      )}

      {profile.portfolioUrl && (
        <a
          className="community-profile-portfolio-card"
          href={profile.portfolioUrl}
          target="_blank"
          rel="noreferrer"
        >
          <span><BriefcaseBusiness size={18} /></span>
          <strong>View professional portfolio</strong>
          <ExternalLink size={15} />
        </a>
      )}

      <section className="community-profile-network-note">
        <UsersRound size={18} />
        <p>Connect to keep up with new work and conversations from {firstName}.</p>
      </section>
    </aside>
  );
}
