import t from "../i18n/t.js";

/**
 * Page-shaped placeholder shown while a page loads its code or data.
 * It keeps the layout stable (no jump when the content arrives) and tells
 * screen readers that the page is busy.
 *
 * Layouts: "list" (rows), "cards" (grid), "form", "profile", "dashboard".
 */
const LAYOUTS = {
  list: ListBody,
  cards: CardsBody,
  form: FormBody,
  profile: ProfileBody,
  dashboard: DashboardBody,
};

export default function PageSkeleton({ layout = "list", label }) {
  const Body = LAYOUTS[layout] ?? ListBody;
  return (
    <section
      className={`page-skeleton page-skeleton--${layout}`}
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">{label ?? t("Loading…")}</span>
      <div className="page-skeleton-head" aria-hidden="true">
        <span className="skeleton-block page-skeleton-kicker" />
        <span className="skeleton-block page-skeleton-title" />
        <span className="skeleton-block page-skeleton-line is-wide" />
      </div>
      <div aria-hidden="true">
        <Body />
      </div>
    </section>
  );
}

function ListBody() {
  return (
    <div className="page-skeleton-list">
      {[0, 1, 2, 3].map((row) => (
        <div className="page-skeleton-row" key={row}>
          <span className="skeleton-block page-skeleton-avatar" />
          <div className="page-skeleton-stack">
            <span className="skeleton-block page-skeleton-line is-strong" />
            <span className="skeleton-block page-skeleton-line" />
          </div>
          <span className="skeleton-block page-skeleton-chip" />
        </div>
      ))}
    </div>
  );
}

function CardsBody() {
  return (
    <div className="page-skeleton-grid">
      {[0, 1, 2, 3, 4, 5].map((card) => (
        <div className="page-skeleton-card" key={card}>
          <span className="skeleton-block page-skeleton-media" />
          <span className="skeleton-block page-skeleton-line is-strong" />
          <span className="skeleton-block page-skeleton-line" />
        </div>
      ))}
    </div>
  );
}

function FormBody() {
  return (
    <div className="page-skeleton-card page-skeleton-form">
      {[0, 1, 2, 3].map((field) => (
        <div className="page-skeleton-stack" key={field}>
          <span className="skeleton-block page-skeleton-label" />
          <span className="skeleton-block page-skeleton-input" />
        </div>
      ))}
      <span className="skeleton-block page-skeleton-button" />
    </div>
  );
}

function ProfileBody() {
  return (
    <>
      <div className="page-skeleton-card page-skeleton-profile">
        <span className="skeleton-block page-skeleton-portrait" />
        <div className="page-skeleton-stack">
          <span className="skeleton-block page-skeleton-line is-strong" />
          <span className="skeleton-block page-skeleton-line" />
          <span className="skeleton-block page-skeleton-line is-short" />
        </div>
      </div>
      <ListBody />
    </>
  );
}

function DashboardBody() {
  return (
    <>
      <div className="page-skeleton-kpis">
        {[0, 1, 2, 3].map((kpi) => (
          <div className="page-skeleton-card" key={kpi}>
            <span className="skeleton-block page-skeleton-line is-short" />
            <span className="skeleton-block page-skeleton-figure" />
          </div>
        ))}
      </div>
      <div className="page-skeleton-card">
        <span className="skeleton-block page-skeleton-chart" />
      </div>
      <ListBody />
    </>
  );
}
