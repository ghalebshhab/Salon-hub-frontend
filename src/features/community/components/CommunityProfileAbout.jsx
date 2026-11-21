import { CalendarHeart, Quote, Sparkles } from "lucide-react";
import RoleSeal from "./CommunityRoleSeal.jsx";

export default function CommunityProfileAbout({ profile, viewModel }) {
  const { firstName, role, tenure } = viewModel;
  const bio = profile.professionalBio;

  const highlights = [
    {
      key: "role",
      icon: <RoleSeal role={role} size={17} />,
      value: role.label,
      label: profile.salonName || "On SalonHub",
    },
    profile.careerProfileEnabled && {
      key: "years",
      icon: <Sparkles size={17} aria-hidden="true" />,
      value: `${profile.yearsOfExperience ?? 0} ${
        profile.yearsOfExperience === 1 ? "year" : "years"
      }`,
      label: "In the craft",
    },
    tenure && {
      key: "tenure",
      icon: <CalendarHeart size={17} aria-hidden="true" />,
      value: tenure.length,
      label: `At the salon since ${tenure.since}`,
    },
  ].filter(Boolean);

  return (
    <article className={`pf-about pf-tone-${role.tone}`}>
      <span className="community-card-kicker">About</span>
      <h2>Meet {firstName}</h2>
      {bio ? (
        <blockquote className="pf-bio">
          <Quote size={22} aria-hidden="true" />
          <p>{bio}</p>
        </blockquote>
      ) : (
        <p className="pf-summary">{role.summary}</p>
      )}
      <ul className="pf-highlights">
        {highlights.map((item) => (
          <li key={item.key}>
            <span className="pf-highlight-icon">{item.icon}</span>
            <strong>{item.value}</strong>
            <small>{item.label}</small>
          </li>
        ))}
      </ul>
    </article>
  );
}
