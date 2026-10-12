import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CircleHelp,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import EmptyState from "../../../shared/components/EmptyState.jsx";
import Loading from "../../../shared/components/Loading.jsx";
import useMyApplications from "../hooks/useMyApplications.js";
import {
  countApplications,
  filterApplications,
  getApplicationStatus,
} from "../model/applicationStatus.js";

const filters = [
  { id: "all", label: "All applications" },
  { id: "in-progress", label: "In progress" },
  { id: "accepted", label: "Accepted" },
  { id: "closed", label: "Closed" },
];

function formatAppliedDate(value) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

function ApplicationCard({ application }) {
  const status = getApplicationStatus(application.status);
  const StatusIcon =
    status.group === "accepted"
      ? Check
      : status.group === "closed"
        ? X
        : CircleHelp;

  return (
    <article className="candidate-application-card">
      <div className="candidate-application-card-top">
        <div className="candidate-application-heading">
          <span className="candidate-application-icon">
            <BriefcaseBusiness size={20} />
          </span>
          <div>
            <span className="eyebrow">{application.salonName || "Salon"}</span>
            <h2>{application.hiringPostTitle || "Hiring application"}</h2>
          </div>
        </div>
        <span className={`application-status-pill status-${status.group}`}>
          <StatusIcon size={15} />
          {status.label}
        </span>
      </div>

      <div className="candidate-application-meta">
        {application.salonLocation && (
          <span>
            <MapPin size={16} />
            {application.salonLocation}
          </span>
        )}
        <span>
          <CalendarDays size={16} />
          Applied {formatAppliedDate(application.appliedAt)}
        </span>
        {Number.isFinite(application.matchScore) && (
          <span className="application-match-score">
            <Sparkles size={16} />
            {application.matchScore}% profile match
          </span>
        )}
      </div>

      <p className="candidate-application-status-copy">{status.description}</p>

      {application.applicationNote && (
        <div className="candidate-application-note">
          <strong>Your note</strong>
          <p>{application.applicationNote}</p>
        </div>
      )}

      {(application.matchedSkills?.length > 0 ||
        application.missingRequirements?.length > 0) && (
        <div className="candidate-application-match-details">
          {application.matchedSkills?.length > 0 && (
            <div>
              <strong>Matched skills</strong>
              <p>{application.matchedSkills.join(" · ")}</p>
            </div>
          )}
          {application.missingRequirements?.length > 0 && (
            <div>
              <strong>Requirements to strengthen</strong>
              <p>{application.missingRequirements.join(" · ")}</p>
            </div>
          )}
        </div>
      )}

      {application.resumeUrl && (
        <a
          className="application-resume-link"
          href={application.resumeUrl}
          target="_blank"
          rel="noreferrer"
        >
          View submitted resume <ArrowRight size={16} />
        </a>
      )}
    </article>
  );
}

function MyApplications() {
  const { applications, loading, error, filter, setFilter } =
    useMyApplications();

  if (loading) return <Loading />;

  const visibleApplications = filterApplications(applications, filter);

  return (
    <section className="container section candidate-applications-page">
      <header className="candidate-applications-header">
        <div>
          <span className="eyebrow">Your career journey</span>
          <h1>My Applications</h1>
          <p>
            Follow your applications and see updates from salons in one place.
          </p>
        </div>
        <Link className="btn btn-primary" to="/hiring-posts">
          Find opportunities <ArrowRight size={17} />
        </Link>
      </header>

      {error ? (
        <EmptyState
          title="Applications could not load"
          message={
            error?.response?.data?.message ||
            error?.message ||
            "Please try again in a moment."
          }
        />
      ) : applications.length === 0 ? (
        <div className="candidate-applications-empty">
          <EmptyState
            title="Your next opportunity starts here"
            message="When you apply to a hiring post, its status and salon updates will appear on this page."
          />
          <Link className="btn btn-primary" to="/hiring-posts">
            Browse hiring posts <ArrowRight size={17} />
          </Link>
        </div>
      ) : (
        <>
          <div
            className="application-filter-bar"
            aria-label="Filter applications"
          >
            {filters.map((item) => (
              <button
                aria-pressed={filter === item.id}
                className={filter === item.id ? "active" : ""}
                key={item.id}
                onClick={() => setFilter(item.id)}
                type="button"
              >
                {item.label}
                <span>{countApplications(applications, item.id)}</span>
              </button>
            ))}
          </div>
          {visibleApplications.length === 0 ? (
            <EmptyState
              title="No applications in this group"
              message="Choose another status filter to see your applications."
            />
          ) : (
            <div className="candidate-applications-list">
              {visibleApplications.map((application) => (
                <ApplicationCard
                  application={application}
                  key={application.applicationId}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default MyApplications;
