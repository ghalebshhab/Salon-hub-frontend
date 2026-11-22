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
import MyApplicationsSkeleton from "../components/MyApplicationsSkeleton.jsx";
import useMyApplications from "../hooks/useMyApplications.js";
import {
  countApplications,
  filterApplications,
  getApplicationStatus,
} from "../model/applicationStatus.js";
import t from "../../../shared/i18n/t.js";
import { dateLocale } from "../../../shared/i18n/language.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

const filters = [
  { id: "all", label: t("All applications") },
  { id: "in-progress", label: t("In progress") },
  { id: "accepted", label: t("Accepted") },
  { id: "closed", label: t("Closed") },
];

function formatAppliedDate(value) {
  if (!value) return t("Date unavailable");
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? t("Date unavailable")
    : new Intl.DateTimeFormat(dateLocale(), {
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
            <span className="eyebrow">
              {application.salonName || t("Salon")}
            </span>
            <h2>{application.hiringPostTitle || t("Hiring application")}</h2>
          </div>
        </div>
        <span className={`application-status-pill status-${status.group}`}>
          <StatusIcon size={15} />
          {t(status.label)}
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
          {t("Applied")} {formatAppliedDate(application.appliedAt)}
        </span>
        {Number.isFinite(application.matchScore) && (
          <span className="application-match-score">
            <Sparkles size={16} />
            {t("{matchScore}% profile match", {
              matchScore: application.matchScore,
            })}
          </span>
        )}
      </div>

      <p className="candidate-application-status-copy">
        {t(status.description)}
      </p>

      {application.applicationNote && (
        <div className="candidate-application-note">
          <strong>{t("Your note")}</strong>
          <p>{application.applicationNote}</p>
        </div>
      )}

      {(application.matchedSkills?.length > 0 ||
        application.missingRequirements?.length > 0) && (
        <div className="candidate-application-match-details">
          {application.matchedSkills?.length > 0 && (
            <div>
              <strong>{t("Matched skills")}</strong>
              <p>{application.matchedSkills.join(" · ")}</p>
            </div>
          )}
          {application.missingRequirements?.length > 0 && (
            <div>
              <strong>{t("Requirements to strengthen")}</strong>
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
          {t("View submitted resume")} <ArrowRight size={16} />
        </a>
      )}
    </article>
  );
}

function MyApplications() {
  const { applications, loading, error, filter, setFilter } =
    useMyApplications();

  if (loading) return <MyApplicationsSkeleton />;

  const visibleApplications = filterApplications(applications, filter);

  return (
    <section className="container section candidate-applications-page">
      <header className="candidate-applications-header">
        <div>
          <span className="eyebrow">
            {t(PAGE_HEADS.myApplications.eyebrow)}
          </span>
          <h1>{t(PAGE_HEADS.myApplications.title)}</h1>
          <p>{t(PAGE_HEADS.myApplications.text)}</p>
        </div>
        <Link className="btn btn-primary" to="/hiring-posts">
          {t("Find opportunities")} <ArrowRight size={17} />
        </Link>
      </header>

      {error ? (
        <EmptyState
          title={t("Applications could not load")}
          message={
            error?.response?.data?.message ||
            error?.message ||
            t("Please try again in a moment.")
          }
        />
      ) : applications.length === 0 ? (
        <div className="candidate-applications-empty">
          <EmptyState
            title={t("Your next opportunity starts here")}
            message={t(
              "When you apply to a hiring post, its status and salon updates will appear on this page.",
            )}
          />
          <Link className="btn btn-primary" to="/hiring-posts">
            {t("Browse hiring posts")} <ArrowRight size={17} />
          </Link>
        </div>
      ) : (
        <>
          <div
            className="application-filter-bar"
            aria-label={t("Filter applications")}
          >
            {filters.map((item) => (
              <button
                aria-pressed={filter === item.id}
                className={filter === item.id ? "active" : ""}
                key={item.id}
                onClick={() => setFilter(item.id)}
                type="button"
              >
                {t(item.label)}
                <span>{countApplications(applications, item.id)}</span>
              </button>
            ))}
          </div>
          {visibleApplications.length === 0 ? (
            <EmptyState
              title={t("No applications in this group")}
              message={t(
                "Choose another status filter to see your applications.",
              )}
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
