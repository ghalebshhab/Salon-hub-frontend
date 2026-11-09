import {
  ArrowLeft,
  BriefcaseBusiness,
  ExternalLink,
  MapPin,
  Sparkles,
  Store,
  UserRoundCheck,
  Flag,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../../../shared/components/Loading.jsx";
import CommunityAvatar from "../components/CommunityAvatar.jsx";
import useCommunityProfile from "../hooks/useCommunityProfile.js";
import useAuth from "../../../shared/auth/useAuth.js";
import ReportDialog from "../../moderation/components/ReportDialog.jsx";

const relationshipLabel = (member) => {
  if (member.relationship === "ACCEPTED") return "Connected";
  if (member.relationship === "PENDING")
    return member.incomingRequest ? "Requested to connect" : "Request sent";
  return "SalonHub member";
};

export default function CommunityProfile() {
  const [reportOpen, setReportOpen] = useState(false);
  const { user: currentUser } = useAuth();
  const { userId } = useParams();
  const { profile, error } = useCommunityProfile(userId);

  if (!profile && !error)
    return <Loading message="Opening community profile…" />;

  if (error)
    return (
      <main className="community-profile-page">
        <section className="community-profile-error">
          <h1>Profile unavailable</h1>
          <p>{error}</p>
          <Link className="btn btn-primary" to="/community">
            Return to community
          </Link>
        </section>
      </main>
    );

  const user = profile.member.user;
  const displayName = user.displayName || user.userName;

  return (
    <main className="community-profile-page">
      <div className="container community-profile-shell">
        <Link className="community-profile-back" to="/community">
          <ArrowLeft size={17} /> Back to community
        </Link>

        <section className="community-public-profile">
          <div className="community-public-profile-cover" />
          <div className="community-public-profile-main">
            <CommunityAvatar name={displayName} size="profile" />
            <div className="community-public-profile-title">
              <span className="community-card-kicker">Community profile</span>
              <h1>{displayName}</h1>
              <p>@{user.userName}</p>
            </div>
            <div className="community-profile-moderation-actions">
              <span className="community-relationship-pill">
                <UserRoundCheck size={16} /> {relationshipLabel(profile.member)}
              </span>
              {Number(currentUser?.id) !== Number(user.id) && (
                <button
                  className="community-profile-report"
                  type="button"
                  onClick={() => setReportOpen(true)}
                >
                  <Flag size={15} /> Report profile
                </button>
              )}
            </div>
          </div>

          <div className="community-profile-grid">
            <article className="community-profile-about">
              <span className="community-card-kicker">About</span>
              <h2>Meet {displayName.split(" ")[0]}</h2>
              <p>
                {profile.professionalBio ||
                  "This member has not added a professional introduction yet."}
              </p>

              <div className="community-profile-facts">
                <span>
                  <BriefcaseBusiness size={18} />
                  <strong>{profile.role}</strong>
                  <small>Community role</small>
                </span>
                {profile.careerProfileEnabled && (
                  <span>
                    <Sparkles size={18} />
                    <strong>{profile.yearsOfExperience ?? 0} years</strong>
                    <small>Experience</small>
                  </span>
                )}
              </div>

              {profile.portfolioUrl && (
                <a
                  className="community-portfolio-link"
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View professional portfolio <ExternalLink size={15} />
                </a>
              )}
            </article>

            <aside className="community-profile-details">
              {profile.salonId && (
                <Link to={`/salons/${profile.salonId}`}>
                  <Store size={19} />
                  <span>
                    <small>Works with</small>
                    <strong>{profile.salonName}</strong>
                  </span>
                </Link>
              )}
              <div>
                <h3>Skills and specialties</h3>
                <div className="community-skill-list">
                  {(profile.skills || []).length ? (
                    profile.skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))
                  ) : (
                    <p>No specialties shared yet.</p>
                  )}
                </div>
              </div>
              {(profile.preferredWorkLocations || []).length > 0 && (
                <div>
                  <h3>
                    <MapPin size={16} /> Preferred locations
                  </h3>
                  <p>{profile.preferredWorkLocations.join(" · ")}</p>
                </div>
              )}
            </aside>
          </div>
        </section>
        {reportOpen && (
          <ReportDialog
            targetType="USER"
            targetId={user.id}
            targetLabel={displayName}
            onClose={() => setReportOpen(false)}
          />
        )}
      </div>
    </main>
  );
}
