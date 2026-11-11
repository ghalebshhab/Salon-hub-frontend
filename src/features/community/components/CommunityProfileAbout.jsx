import { BriefcaseBusiness, Sparkles, Store } from "lucide-react";
import { Link } from "react-router-dom";

export default function CommunityProfileAbout({ profile, viewModel }) {
  const { firstName, role, salonRelationship } = viewModel;

  return (
    <article className="community-profile-introduction">
      <span className="community-card-kicker">About</span>
      <h2>Meet {firstName}</h2>
      <p>{profile.professionalBio || role.summary}</p>
      <div className="community-profile-highlights">
        <span>
          <BriefcaseBusiness size={17} />
          <strong>{role.label}</strong>
          <small>Role on SalonHub</small>
        </span>
        {profile.careerProfileEnabled && (
          <span>
            <Sparkles size={17} />
            <strong>{profile.yearsOfExperience ?? 0} years</strong>
            <small>Industry experience</small>
          </span>
        )}
        {profile.salonId && (
          <Link to={`/salons/${profile.salonId}`}>
            <Store size={17} />
            <strong>{profile.salonName}</strong>
            <small>{salonRelationship}</small>
          </Link>
        )}
      </div>
    </article>
  );
}
