import { useId, useState } from "react";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import {
  BIO_PREVIEW_LENGTH,
  CARD_SKILL_COUNT,
  firstName,
  initials,
  specialtyOf,
} from "../../model/salonTeam.js";
import { memberProfilePath } from "../../../community/model/communityRoutes.js";
import t from "../../../../shared/i18n/t.js";

/**
 * One professional, kept compact: photo, full name, specialty and years,
 * a short bio, a few skills and "Book with …". The name link covers the
 * whole card and opens their profile; the buttons inside sit above it.
 */
export default function TeamMemberCard({ employee, booking }) {
  const [bioOpen, setBioOpen] = useState(false);
  const bioId = useId();
  const name = employee.fullName || t("Salon professional");
  const specialty = specialtyOf(employee);
  const bio = employee.professionalBio?.trim();
  const longBio = bio && bio.length > BIO_PREVIEW_LENGTH;
  // The specialty is already under the name, so it is not repeated here.
  const skills = (employee.skills || []).filter(
    (skill) => skill.toLowerCase() !== specialty.toLowerCase(),
  );
  const services = employee.serviceNames || [];
  const years = Number(employee.yearsOfExperience);

  return (
    <article className="team-card">
      <div className="team-card-top">
        <div className="team-card-avatar" aria-hidden="true">
          {employee.imageUrl ? (
            <img src={employee.imageUrl} alt="" loading="lazy" />
          ) : (
            <span>{initials(name)}</span>
          )}
        </div>
        <div className="team-card-title">
          <h3>
            <Link
              className="team-card-link"
              to={memberProfilePath(employee.id)}
            >
              {name}
            </Link>
          </h3>
          <p className="team-card-meta">
            <span className="team-card-specialty">{specialty}</span>
            {years > 0 && (
              <span className="team-card-years">
                {t(years === 1 ? "{years} yr" : "{years} yrs", { years })}
                <span className="sr-only"> {t("of experience")}</span>
              </span>
            )}
          </p>
        </div>
        <ArrowUpRight size={18} className="team-card-go" aria-hidden="true" />
      </div>

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
              {bioOpen ? t("Show less") : t("Read more")}
            </button>
          )}
        </div>
      )}

      {skills.length > 0 && (
        <ul
          className="team-card-skills"
          aria-label={t("{name}'s skills", { name })}
        >
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

      {booking && services.length > 0 && (
        <Link
          className="team-card-book"
          to={booking.to}
          state={booking.state(employee.id)}
        >
          <CalendarDays size={15} aria-hidden="true" />
          {booking.signedIn
            ? t("Book with {name}", { name: firstName(name) })
            : t("Sign in to book")}
        </Link>
      )}
    </article>
  );
}
