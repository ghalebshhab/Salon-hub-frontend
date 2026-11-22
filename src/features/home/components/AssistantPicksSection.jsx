import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../shared/auth/useAuth.js";
import ScrollReveal from "../../../shared/components/ScrollReveal.jsx";
import {
  CandidateCard,
  JobCard,
  SalonCard,
} from "../../assistant/components/AssistantCards.jsx";
import LamsaOrb from "../../assistant/components/LamsaOrb.jsx";
import { ASSISTANT_NAME } from "../../assistant/model/assistantIdentity.js";
import useAssistant from "../../assistant/hooks/useAssistant.js";
import useAssistantInsights from "../../assistant/hooks/useAssistantInsights.js";
import t from "../../../shared/i18n/t.js";

// The server writes the seat count inside the owner summary sentence.
function summaryText(summary) {
  const seats = String(summary || "").match(
    /^Your team has (\d+) free seats?\. These members are open to work\.$/,
  );
  if (!seats) return t(summary);
  return seats[1] === "1"
    ? t("Your team has 1 free seat. These members are open to work.")
    : t("Your team has {count} free seats. These members are open to work.", {
        count: seats[1],
      });
}

function GovernorateRankings({ rankings }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const index = Math.min(active, rankings.length - 1);
  const ranking = rankings[index];

  const onKeyDown = (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (index + step + rankings.length) % rankings.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="lamsa-picks-rankings">
      <div
        className="lamsa-picks-tabs"
        role="tablist"
        aria-label={t("Governorates")}
        onKeyDown={onKeyDown}
      >
        {rankings.map((item, itemIndex) => (
          <button
            key={item.governorate}
            ref={(element) => {
              tabRefs.current[itemIndex] = element;
            }}
            type="button"
            role="tab"
            id={`lamsa-tab-${itemIndex}`}
            aria-selected={itemIndex === index}
            aria-controls="lamsa-picks-panel"
            tabIndex={itemIndex === index ? 0 : -1}
            onClick={() => setActive(itemIndex)}
          >
            <MapPin aria-hidden="true" />
            {t(item.governorate)}
          </button>
        ))}
      </div>
      <div
        id="lamsa-picks-panel"
        role="tabpanel"
        aria-labelledby={`lamsa-tab-${index}`}
      >
        <ol
          className="lamsa-card-list lamsa-picks-list"
          key={ranking.governorate}
        >
          {ranking.salons.map((salon, rank) => (
            <SalonCard key={salon.id} salon={salon} rank={rank + 1} />
          ))}
        </ol>
      </div>
    </div>
  );
}

function OpportunityCard({ opportunity }) {
  const { title, summary, action, jobs, salons, candidates, audience } =
    opportunity;
  const ownerSalon = audience === "owner";
  const empty =
    !jobs.length && !candidates.length && (ownerSalon || !salons.length);
  return (
    <article className="lamsa-opportunity">
      <span className="lamsa-opportunity-eyebrow">
        <Sparkles aria-hidden="true" />
        {audience === "owner" ? t("For your salon") : t("Opportunities")}
      </span>
      <h3>{t(title)}</h3>
      <p>{summaryText(summary)}</p>
      {jobs.length > 0 && (
        <ul className="lamsa-card-list">
          {jobs.slice(0, 3).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </ul>
      )}
      {candidates.length > 0 && (
        <ul className="lamsa-card-list">
          {candidates.slice(0, 3).map((person) => (
            <CandidateCard key={person.userId} person={person} />
          ))}
        </ul>
      )}
      {!ownerSalon && !jobs.length && salons.length > 0 && (
        <ul className="lamsa-card-list">
          {salons.map((salon) => (
            <SalonCard key={salon.id} salon={salon} />
          ))}
        </ul>
      )}
      {empty && (
        <p className="lamsa-opportunity-empty">
          {t("Nothing open right now. New posts appear here first.")}
        </p>
      )}
      {action && (
        <Link
          className="btn btn-secondary btn-small lamsa-opportunity-action"
          to={action.to}
        >
          {t(action.label)}
          <ArrowRight aria-hidden="true" />
        </Link>
      )}
    </article>
  );
}

/** Home section with Lamsa's live suggestions. */
export default function AssistantPicksSection() {
  const { token } = useAuth();
  const { openPanel } = useAssistant();
  const { status, data } = useAssistantInsights(token);
  const rankings = data?.rankings ?? [];

  return (
    <section
      className="editorial-section container lamsa-picks"
      id="lamsa-picks"
      aria-labelledby="lamsa-picks-title"
    >
      <ScrollReveal className="editorial-section-heading">
        <div>
          <span className="editorial-index">
            {t("02 / {ASSISTANT_NAME}’s picks", { ASSISTANT_NAME })}
          </span>
          <h2 id="lamsa-picks-title">
            {t("The best salons, governorate by governorate.")}
          </h2>
          <p>
            {t(
              "{ASSISTANT_NAME} ranks salons from real customer reviews and points you to the openings that fit you. Ask her anything about Salonhub.",
              { ASSISTANT_NAME },
            )}
          </p>
        </div>
        <button type="button" className="lamsa-ask-chip" onClick={openPanel}>
          <LamsaOrb size="sm" animated />
          <span>
            <strong>{t("Ask {ASSISTANT_NAME}", { ASSISTANT_NAME })}</strong>
            <small>{t("Your AI assistant")}</small>
          </span>
        </button>
      </ScrollReveal>

      <ScrollReveal delay={90} className="lamsa-picks-grid">
        <div className="lamsa-picks-main">
          {status === "loading" && (
            <div className="lamsa-picks-skeleton" aria-hidden="true" />
          )}
          {status === "error" && (
            <p className="lamsa-picks-empty">
              {t("{ASSISTANT_NAME}’s picks are not available right now.", {
                ASSISTANT_NAME,
              })}
            </p>
          )}
          {status === "ready" && rankings.length > 0 && (
            <GovernorateRankings rankings={rankings} />
          )}
          {status === "ready" && rankings.length === 0 && (
            <div className="lamsa-picks-empty">
              <LamsaOrb size="lg" className="lamsa-picks-empty-mark" />
              <strong>{t("Rankings start with the first reviews.")}</strong>
              <span>
                {t(
                  "After customers rate their visits, the best salons of each governorate show here.",
                )}
              </span>
              <a className="btn btn-secondary btn-small" href="#discover">
                {t("Browse salons")}
              </a>
            </div>
          )}
        </div>
        {status === "ready" && data?.opportunity && (
          <OpportunityCard opportunity={data.opportunity} />
        )}
      </ScrollReveal>
    </section>
  );
}
