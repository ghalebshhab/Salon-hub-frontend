import {
  ArrowUpRight,
  BriefcaseBusiness,
  MapPin,
  Star,
  Store,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { salonInitials } from "../../salons/model/salonInitials.js";
import t from "../../../shared/i18n/t.js";

function Rating({ value, count }) {
  if (value == null || !count) {
    return <span className="lamsa-card-muted">{t("No reviews yet")}</span>;
  }
  return (
    <span
      className="lamsa-rating"
      aria-label={t("{value} stars from {count} reviews", { value, count })}
    >
      <Star aria-hidden="true" />
      <strong>{value.toFixed(1)}</strong>
      <span aria-hidden="true">({count})</span>
    </span>
  );
}

export function SalonCard({ salon, rank, onNavigate }) {
  return (
    <li>
      <Link
        className="lamsa-card lamsa-salon-card"
        to={`/salons/${salon.id}`}
        onClick={onNavigate}
      >
        <span className="lamsa-salon-thumb" aria-hidden="true">
          {salon.profilePictureUrl ? (
            <img src={salon.profilePictureUrl} alt="" loading="lazy" />
          ) : (
            salonInitials(salon.name)
          )}
          {rank && <span className="lamsa-rank">{rank}</span>}
        </span>
        <span className="lamsa-card-body">
          <strong className="lamsa-card-title">{salon.name}</strong>
          <span className="lamsa-card-meta">
            <span>
              <MapPin aria-hidden="true" />
              {t(salon.governorate ?? salon.location)}
            </span>
            <Rating value={salon.averageRating} count={salon.reviewCount} />
          </span>
          {salon.openSeats > 0 && (
            <span className="lamsa-chip is-accent">
              {t("{openSeats} free", { openSeats: salon.openSeats })}{" "}
              {salon.openSeats === 1 ? t("seat") : t("seats")}
              {t("in team")}
            </span>
          )}
        </span>
        <ArrowUpRight className="lamsa-card-arrow" aria-hidden="true" />
      </Link>
    </li>
  );
}

export function JobCard({ job, onNavigate }) {
  return (
    <li>
      <Link
        className="lamsa-card lamsa-job-card"
        to={`/hiring-posts/${job.id}/apply`}
        onClick={onNavigate}
      >
        <span className="lamsa-card-icon" aria-hidden="true">
          <BriefcaseBusiness />
        </span>
        <span className="lamsa-card-body">
          <strong className="lamsa-card-title">{t(job.title)}</strong>
          <span className="lamsa-card-meta">
            <span>{job.salonName}</span>
            {job.location && (
              <span>
                <MapPin aria-hidden="true" />
                {job.location}
              </span>
            )}
          </span>
          {job.skills?.length > 0 && (
            <span className="lamsa-chip-row">
              {job.skills.slice(0, 3).map((skill) => (
                <span className="lamsa-chip" key={skill}>
                  {skill}
                </span>
              ))}
            </span>
          )}
        </span>
        {job.matchScore != null && (
          <span
            className="lamsa-match"
            aria-label={t("{matchScore}% match", {
              matchScore: job.matchScore,
            })}
          >
            {job.matchScore}%
          </span>
        )}
      </Link>
    </li>
  );
}

export function CandidateCard({ person, onNavigate }) {
  return (
    <li>
      <Link
        className="lamsa-card lamsa-candidate-card"
        to={`/community/people/${person.userId}`}
        onClick={onNavigate}
      >
        <span className="lamsa-card-icon is-round" aria-hidden="true">
          <UserRound />
        </span>
        <span className="lamsa-card-body">
          <strong className="lamsa-card-title">{person.name}</strong>
          <span className="lamsa-card-meta">
            {person.yearsOfExperience != null && (
              <span>
                {t("{yearsOfExperience} yrs experience", {
                  yearsOfExperience: person.yearsOfExperience,
                })}
              </span>
            )}
            {person.preferredLocations?.[0] && (
              <span>
                <MapPin aria-hidden="true" />
                {person.preferredLocations[0]}
              </span>
            )}
          </span>
          {person.skills?.length > 0 && (
            <span className="lamsa-chip-row">
              {person.skills.slice(0, 3).map((skill) => (
                <span className="lamsa-chip" key={skill}>
                  {skill}
                </span>
              ))}
            </span>
          )}
        </span>
        <ArrowUpRight className="lamsa-card-arrow" aria-hidden="true" />
      </Link>
    </li>
  );
}

export function RankingBlock({ ranking, onNavigate }) {
  return (
    <section
      className="lamsa-ranking"
      aria-label={t("Top salons in {governorate}", {
        governorate: t(ranking.governorate),
      })}
    >
      <h4>
        <MapPin aria-hidden="true" />
        {t(ranking.governorate)}
      </h4>
      <ol className="lamsa-card-list">
        {ranking.salons.map((salon, index) => (
          <SalonCard
            key={salon.id}
            salon={salon}
            rank={index + 1}
            onNavigate={onNavigate}
          />
        ))}
      </ol>
    </section>
  );
}

/** All record cards of one reply, in a fixed order. */
export default function AssistantCards({ message, onNavigate }) {
  const { salons, jobs, candidates, rankings, intent } = message;
  // Rank numbers and the "Best rated" label only when reviews exist.
  const ranked =
    intent === "TOP_SALONS" && salons?.some((salon) => salon.reviewCount > 0);
  return (
    <>
      {rankings?.length > 0 && (
        <div className="lamsa-rankings">
          {rankings.map((ranking) => (
            <RankingBlock
              key={ranking.governorate}
              ranking={ranking}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
      {jobs?.length > 0 && (
        <CardGroup icon={BriefcaseBusiness} label={t("Open jobs")}>
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onNavigate={onNavigate} />
          ))}
        </CardGroup>
      )}
      {salons?.length > 0 && (
        <CardGroup
          icon={intent === "JOBS" ? UsersRound : ranked ? Star : Store}
          label={
            intent === "JOBS"
              ? t("Salons with free seats")
              : ranked
                ? t("Best rated")
                : t("Salons")
          }
          ordered={ranked}
        >
          {salons.map((salon, index) => (
            <SalonCard
              key={salon.id}
              salon={salon}
              rank={ranked && salon.reviewCount > 0 ? index + 1 : undefined}
              onNavigate={onNavigate}
            />
          ))}
        </CardGroup>
      )}
      {candidates?.length > 0 && (
        <CardGroup icon={UsersRound} label={t("Open to work")}>
          {candidates.map((person) => (
            <CandidateCard
              key={person.userId}
              person={person}
              onNavigate={onNavigate}
            />
          ))}
        </CardGroup>
      )}
    </>
  );
}

function CardGroup({ icon: Icon, label, ordered = false, children }) {
  const List = ordered ? "ol" : "ul";
  return (
    <div className="lamsa-card-group">
      <span className="lamsa-card-group-label">
        <Icon aria-hidden="true" />
        {t(label)}
      </span>
      <List className="lamsa-card-list">{children}</List>
    </div>
  );
}
