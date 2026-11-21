import {
  ArrowUpRight,
  BriefcaseBusiness,
  ExternalLink,
  MapPin,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getInitials } from "../model/communityPresentation.js";
import RoleSeal from "./CommunityRoleSeal.jsx";

/**
 * The member's place at their salon, drawn as a ticket stub. The whole
 * ticket opens the salon page.
 */
function SalonPass({ profile, viewModel }) {
  const { role, tenure, salonRelationship } = viewModel;
  return (
    <Link
      className={`pf-pass pf-tone-${role.tone}`}
      to={`/salons/${profile.salonId}`}
      aria-label={`${salonRelationship} ${profile.salonName}. Open the salon page`}
    >
      <span className="pf-pass-head">
        <span className="pf-pass-kicker">Salon pass</span>
        <span className="pf-pass-stamp" aria-hidden="true">
          {getInitials(profile.salonName)}
        </span>
      </span>
      <strong className="pf-pass-salon">{profile.salonName}</strong>
      <span className="pf-pass-role">
        <RoleSeal role={role} size={14} /> {role.label}
      </span>
      <span className="pf-pass-tear" aria-hidden="true" />
      <span className="pf-pass-foot">
        <span>
          <small>{role.key === "owner" ? "Founded" : "Since"}</small>
          <b>{tenure ? tenure.since : "—"}</b>
        </span>
        <span>
          <small>Time here</small>
          <b>{tenure ? tenure.length : "—"}</b>
        </span>
        <span className="pf-pass-go" aria-hidden="true">
          <ArrowUpRight size={17} />
        </span>
      </span>
    </Link>
  );
}

export default function CommunityProfileSidebar({ profile, viewModel }) {
  const { displayName, firstName } = viewModel;
  const skills = profile.skills || [];
  const locations = profile.preferredWorkLocations || [];

  return (
    <aside
      className="community-profile-sidebar pf-side"
      aria-label={`${displayName}'s professional details`}
    >
      {profile.salonId && <SalonPass profile={profile} viewModel={viewModel} />}

      <section className="pf-card">
        <h2 className="community-card-kicker">
          <Sparkles size={14} aria-hidden="true" /> Specialties
        </h2>
        {skills.length ? (
          <ul className="pf-skills">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p className="pf-muted">No specialties shared yet.</p>
        )}
      </section>

      {locations.length > 0 && (
        <section className="pf-card">
          <h2 className="community-card-kicker">
            <MapPin size={14} aria-hidden="true" /> Works around
          </h2>
          <ul className="pf-places">
            {locations.map((place) => (
              <li key={place}>{place}</li>
            ))}
          </ul>
        </section>
      )}

      {profile.portfolioUrl && (
        <a
          className="pf-card pf-portfolio"
          href={profile.portfolioUrl}
          target="_blank"
          rel="noreferrer"
        >
          <BriefcaseBusiness size={18} aria-hidden="true" />
          <strong>View portfolio</strong>
          <ExternalLink size={15} aria-hidden="true" />
        </a>
      )}

      <p className="pf-note">
        <UsersRound size={18} aria-hidden="true" />
        Connect to keep up with new work and conversations from {firstName}.
      </p>
    </aside>
  );
}
