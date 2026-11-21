import { useId, useState } from "react";
import { Award, CalendarDays, Scissors } from "lucide-react";
import { Link } from "react-router-dom";
import {
  BIO_PREVIEW_LENGTH,
  CARD_SERVICE_COUNT,
  CARD_SKILL_COUNT,
  firstName,
  initials,
  specialtyOf,
} from "../../model/salonTeam.js";

/**
 * One professional: who they are, what they are good at, which services
 * they do, and a shortcut to book with them. No private contact details.
 */
export default function TeamMemberCard({ employee, booking }) {
  const [bioOpen, setBioOpen] = useState(false);
  const bioId = useId();
  const name = employee.fullName || "Salon professional";
  const bio = employee.professionalBio?.trim();
  const longBio = bio && bio.length > BIO_PREVIEW_LENGTH;
  const skills = employee.skills || [];
  const services = employee.serviceNames || [];
  const years = Number(employee.yearsOfExperience);

  return (
    <article className="team-card">
      <header className="team-card-head">
        <div className="team-card-avatar" aria-hidden="true">
          {employee.imageUrl ? (
            <img src={employee.imageUrl} alt="" loading="lazy" />
          ) : (
            <span>{initials(name)}</span>
          )}
        </div>
        <div className="team-card-title">
          <h3>{name}</h3>
          <span className="team-card-specialty">{specialtyOf(employee)}</span>
        </div>
        {years > 0 && (
          <span
            className="team-card-years"
            title={`${years} years of experience`}
          >
            <Award size={14} aria-hidden="true" />
            <strong>{years}</strong>
            <span>{years === 1 ? "yr" : "yrs"}</span>
            <span className="sr-only">of experience</span>
          </span>
        )}
      </header>

      {bio && (
        <div className="team-card-bio">
          <p id={bioId} className={longBio && !bioOpen ? "is-clamped" : ""}>
            {bio}
          </p>
          {longBio && (
            <button
              className="team-card-more"
              type="button"
              aria-expanded={bioOpen}
              aria-controls={bioId}
              onClick={() => setBioOpen((open) => !open)}
            >
              {bioOpen ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      )}

      {skills.length > 0 && (
        <ul className="team-card-skills" aria-label={`${name}'s skills`}>
          {skills.slice(0, CARD_SKILL_COUNT).map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
          {skills.length > CARD_SKILL_COUNT && (
            <li
              className="is-more"
              title={skills.slice(CARD_SKILL_COUNT).join(", ")}
            >
              +{skills.length - CARD_SKILL_COUNT}
            </li>
          )}
        </ul>
      )}

      <div className="team-card-services">
        <Scissors size={15} aria-hidden="true" />
        {services.length ? (
          <p>
            <span className="team-card-label">Does </span>
            {services.slice(0, CARD_SERVICE_COUNT).join(", ")}
            {services.length > CARD_SERVICE_COUNT && (
              <span
                className="team-card-extra"
                title={services.slice(CARD_SERVICE_COUNT).join(", ")}
              >
                {" "}
                +{services.length - CARD_SERVICE_COUNT} more
              </span>
            )}
          </p>
        ) : (
          <p className="is-muted">Services are being set up</p>
        )}
      </div>

      {booking && services.length > 0 && (
        <Link
          className="team-card-book"
          to={booking.to}
          state={booking.state(employee.id)}
        >
          <CalendarDays size={16} aria-hidden="true" />
          {booking.signedIn
            ? `Book with ${firstName(name)}`
            : "Sign in to book"}
        </Link>
      )}
    </article>
  );
}
