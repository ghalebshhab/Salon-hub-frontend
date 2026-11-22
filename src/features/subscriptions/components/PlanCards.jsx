import { Check, Minus, Sparkles } from "lucide-react";
import {
  BILLING_CYCLES,
  FEATURE_LABELS,
  FEATURE_ORDER,
  PLAN_ORDER,
  PLAN_TAGLINES,
  feeText,
  limitText,
  planPrice,
  yearlySavingMonths,
} from "../model/plan.js";
import t from "../../../shared/i18n/t.js";

function CycleToggle({ cycle, onChange }) {
  return (
    <div className="plan-cycle" role="group" aria-label={t("Billing period")}>
      {BILLING_CYCLES.map((item) => (
        <button
          key={item.key}
          type="button"
          className={cycle === item.key ? "is-active" : ""}
          aria-pressed={cycle === item.key}
          onClick={() => onChange(item.key)}
        >
          {t(item.label)}
        </button>
      ))}
    </div>
  );
}

function PlanCard({ plan, cycle, current, blocked, onChoose }) {
  const paid = plan.monthlyPriceFils > 0;
  const saving = cycle === "YEARLY" ? yearlySavingMonths(plan) : 0;
  const featured = plan.code === "PRO";
  return (
    <article
      className={`plan-card ${featured ? "is-featured" : ""} ${current ? "is-current" : ""}`}
    >
      <header>
        <div className="plan-card-title">
          <h3>{plan.name}</h3>
          {featured && (
            <span className="plan-tag">
              <Sparkles size={12} aria-hidden="true" /> {t("Most salons")}
            </span>
          )}
        </div>
        <p>{PLAN_TAGLINES[plan.code]}</p>
      </header>
      <div className="plan-price">
        <strong>{paid ? planPrice(plan, cycle) : t("0 JOD")}</strong>
        <span>
          {paid
            ? cycle === "YEARLY"
              ? t("per year")
              : t("per month")
            : t("always")}
        </span>
        {saving > 0 && <em>{t("{saving} months free", { saving })}</em>}
      </div>
      <ul className="plan-limits">
        <li>{limitText(plan.maxTeamMembers, t("team members"))}</li>
        <li>{limitText(plan.maxServices, t("services"))}</li>
        <li>
          {limitText(
            plan.maxOpenHiringPosts,
            plan.maxOpenHiringPosts === 1
              ? t("open hiring post")
              : t("open hiring posts"),
          )}
        </li>
        <li>
          {t("{analyticsMaxDays} days of dashboard history", {
            analyticsMaxDays: plan.analyticsMaxDays,
          })}
        </li>
        {plan.features.includes("CARD_PAYMENTS") && (
          <li>
            {t("Card payment fee")} {feeText(plan.cardFeeBps)}
          </li>
        )}
      </ul>
      <ul className="plan-features">
        {FEATURE_ORDER.map((feature) => {
          const included = plan.features.includes(feature);
          return (
            <li key={feature} className={included ? "" : "is-off"}>
              {included ? (
                <Check size={15} aria-label={t("Included")} />
              ) : (
                <Minus size={15} aria-label={t("Not included")} />
              )}
              {FEATURE_LABELS[feature]}
            </li>
          );
        })}
      </ul>
      <footer>
        {current ? (
          <span className="plan-current-label">{t("Your plan now")}</span>
        ) : paid ? (
          <button
            type="button"
            className={`btn ${featured ? "btn-primary" : "btn-secondary"}`}
            disabled={blocked}
            onClick={() => onChoose(plan)}
          >
            {t("Choose {name}", { name: plan.name })}
          </button>
        ) : null}
      </footer>
    </article>
  );
}

/** The three plans side by side, with the monthly or yearly price. */
export default function PlanCards({
  plans,
  cycle,
  onCycleChange,
  currentPlan,
  blocked,
  onChoose,
}) {
  const ordered = PLAN_ORDER.map((code) =>
    plans.find((plan) => plan.code === code),
  ).filter(Boolean);
  return (
    <section className="plan-compare" aria-labelledby="plan-compare-title">
      <div className="plan-section-head">
        <div>
          <span className="eyebrow">{t("Compare")}</span>
          <h2 id="plan-compare-title">{t("Plans")}</h2>
          <p>
            {t(
              "Prices in Jordanian dinar. Change or stop your plan at any time.",
            )}
          </p>
        </div>
        <CycleToggle cycle={cycle} onChange={onCycleChange} />
      </div>
      <div className="plan-grid">
        {ordered.map((plan) => (
          <PlanCard
            key={plan.code}
            plan={plan}
            cycle={cycle}
            current={plan.code === currentPlan}
            blocked={blocked}
            onChoose={onChoose}
          />
        ))}
      </div>
    </section>
  );
}
