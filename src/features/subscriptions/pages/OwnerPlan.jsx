import { Clock3, Crown, History, Phone, RefreshCw } from "lucide-react";
import { useRef, useState } from "react";
import { confirmAction } from "../../../shared/confirm/confirmStore.js";
import { formatMoney } from "../../payments/model/payment.js";
import PlanCards from "../components/PlanCards.jsx";
import PlanRequestForm, {
  CliqDetails,
} from "../components/PlanRequestForm.jsx";
import useOwnerPlan from "../hooks/useOwnerPlan.js";
import {
  METHOD_LABELS,
  REQUEST_STATUS_LOOK,
  STATUS_LOOK,
  feeText,
  formatDate,
  usageRows,
} from "../model/plan.js";
import { PlanBodyBones } from "../components/PlanSkeleton.jsx";
import t from "../../../shared/i18n/t.js";
import { PAGE_HEADS } from "../../../shared/copy/pageHeads.js";

function StatusPill({ look }) {
  return <span className={`plan-pill is-${look.tone}`}>{t(look.label)}</span>;
}

/** Plan time left in words, for the summary card. */
function accessText(subscription) {
  const { status, daysLeft, accessEndsAt } = subscription;
  if (status === "ENDED" || daysLeft == null) {
    return t("Free has no end date. Upgrade at any time.");
  }
  const days =
    daysLeft === 1 ? t("1 day") : t("{count} days", { count: daysLeft });
  const date = formatDate(accessEndsAt);
  if (status === "TRIAL")
    return t("Your free trial ends in {days}, on {date}.", { days, date });
  if (status === "GRACE") {
    return t("Your plan ended. Pay within {days} (by {date}) to keep it.", {
      days,
      date,
    });
  }
  return t("Paid until {date} ({days} left).", { date, days });
}

function UsageMeter({ row }) {
  const unlimited = row.max == null;
  const ratio = unlimited ? 0 : Math.min(1, row.used / Math.max(1, row.max));
  const full = !unlimited && row.used >= row.max;
  return (
    <li className={`plan-meter ${full ? "is-full" : ""}`}>
      <div className="plan-meter-text">
        <span>
          {t(row.label)}
          {row.hint && <small> · {t(row.hint)}</small>}
        </span>
        <strong>
          {row.used}{" "}
          {unlimited ? t("· unlimited") : t("of {max}", { max: row.max })}
        </strong>
      </div>
      {!unlimited && (
        <span
          className="plan-meter-bar"
          role="meter"
          aria-label={t(row.label)}
          aria-valuemin={0}
          aria-valuemax={row.max}
          aria-valuenow={row.used}
        >
          <span style={{ transform: `scaleX(${ratio})` }} />
        </span>
      )}
    </li>
  );
}

function CurrentPlan({ subscription }) {
  const look = STATUS_LOOK[subscription.status] || STATUS_LOOK.ENDED;
  const limits = subscription.limits;
  return (
    <section className="owner-panel plan-current" aria-label={t("Your plan")}>
      <div className="plan-current-head">
        <span className="plan-current-icon" aria-hidden="true">
          <Crown size={20} />
        </span>
        <div>
          <span className="eyebrow">{t("Your plan")}</span>
          <h2>
            {limits.name} <StatusPill look={look} />
          </h2>
          <p>{accessText(subscription)}</p>
        </div>
      </div>
      <ul className="plan-meters">
        {usageRows(subscription).map((row) => (
          <UsageMeter key={row.key} row={row} />
        ))}
      </ul>
      <p className="plan-current-foot">
        <History size={14} aria-hidden="true" />
        {t("Dashboard history: {analyticsMaxDays} days", {
          analyticsMaxDays: limits.analyticsMaxDays,
        })}
        {limits.features.includes("CARD_PAYMENTS") &&
          t(" · Card payment fee: {value}", {
            value: feeText(limits.cardFeeBps),
          })}
      </p>
    </section>
  );
}

function OpenRequest({ request, payTo, cancelling, onCancel }) {
  return (
    <section
      className="owner-panel plan-open"
      aria-label={t("Request waiting")}
    >
      <div className="plan-open-head">
        <Clock3 size={20} aria-hidden="true" />
        <div>
          <h2>
            {request.plan === "BUSINESS"
              ? t("Request for Business")
              : t("Request for Pro")}{" "}
            <StatusPill look={REQUEST_STATUS_LOOK.PENDING} />
          </h2>
          <p>
            {t("{amount}, {cycle}, by {method}. Sent on {date}.", {
              amount: formatMoney(request.amountFils, request.currency),
              cycle:
                request.billingCycle === "YEARLY" ? t("yearly") : t("monthly"),
              method: t(METHOD_LABELS[request.method] || ""),
              date: formatDate(request.createdAt),
            })}
          </p>
          {request.method === "CLIQ" && (
            <>
              <p>{t("If you did not pay yet, send the transfer to:")}</p>
              <CliqDetails payTo={payTo} />
            </>
          )}
          {request.method === "CASH" && (
            <p>{t("Our team contacts you to collect the cash.")}</p>
          )}
          {request.reference && (
            <p>
              {t("Your reference: {reference}", {
                reference: request.reference,
              })}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        className="btn btn-secondary"
        disabled={cancelling}
        onClick={onCancel}
      >
        {cancelling ? t("Cancelling…") : t("Cancel request")}
      </button>
    </section>
  );
}

function RecentRequests({ requests }) {
  const done = requests.filter((request) => request.status !== "PENDING");
  if (!done.length) return null;
  return (
    <section
      className="owner-panel plan-history"
      aria-labelledby="plan-history"
    >
      <h2 id="plan-history">{t("Past requests")}</h2>
      <ul>
        {done.map((request) => {
          const look = REQUEST_STATUS_LOOK[request.status];
          return (
            <li key={request.id}>
              <div>
                <strong>
                  {request.plan === "BUSINESS" ? t("Business") : t("Pro")},{" "}
                  {request.billingCycle === "YEARLY"
                    ? t("yearly")
                    : t("monthly")}
                </strong>
                <small>
                  {formatMoney(request.amountFils, request.currency)} ·{" "}
                  {METHOD_LABELS[request.method]} ·{" "}
                  {formatDate(request.createdAt)}
                </small>
                {request.rejectionReason && (
                  <small>
                    {t("Reason: {rejectionReason}", {
                      rejectionReason: request.rejectionReason,
                    })}
                  </small>
                )}
              </div>
              {look && <StatusPill look={look} />}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Owner page: the plan in use, usage against its limits, and upgrades. */
export default function OwnerPlan() {
  const {
    subscription,
    plans,
    loading,
    error,
    refetch,
    sending,
    cancellingId,
    sendRequest,
    cancelRequest,
  } = useOwnerPlan();
  const [cycle, setCycle] = useState("MONTHLY");
  const [chosen, setChosen] = useState(null);
  const formRef = useRef(null);

  const choose = (plan) => {
    setChosen(plan);
    requestAnimationFrame(() =>
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };
  const submit = async (payload) => {
    if (await sendRequest(payload)) setChosen(null);
  };
  const cancel = async (request) => {
    const ok = await confirmAction({
      title: t("Cancel this request?"),
      message: t(
        "If you already paid, keep the request so we can find your payment.",
      ),
      confirmText: t("Cancel request"),
      cancelText: t("Keep it"),
      danger: true,
    });
    if (ok) cancelRequest(request.id);
  };

  const openRequest = subscription?.openRequest;
  const supportPhone = subscription?.payTo?.supportPhone;

  return (
    <main className="container section plan-page">
      <header className="plan-page-head">
        <div>
          <span className="eyebrow">{t(PAGE_HEADS.plan.eyebrow)}</span>
          <h1>{t(PAGE_HEADS.plan.title)}</h1>
          <p>{t(PAGE_HEADS.plan.text)}</p>
        </div>
        {supportPhone && (
          <a className="btn btn-secondary" href={`tel:${supportPhone}`}>
            <Phone size={16} aria-hidden="true" />
            {t("Call us")}
          </a>
        )}
      </header>

      {loading && (
        <div role="status" aria-label={t("Loading")}>
          <div aria-hidden="true">
            <PlanBodyBones />
          </div>
        </div>
      )}
      {!loading && (error || !subscription) && (
        <div className="empty-state">
          <h2>{t("Your plan could not be loaded")}</h2>
          <p>{t("Check your connection, then try again.")}</p>
          <button type="button" className="btn btn-primary" onClick={refetch}>
            <RefreshCw size={16} aria-hidden="true" />
            {t("Try again")}
          </button>
        </div>
      )}

      {!loading && subscription && (
        <>
          <div className="plan-top">
            <CurrentPlan subscription={subscription} />
            {openRequest && (
              <OpenRequest
                request={openRequest}
                payTo={subscription.payTo}
                cancelling={cancellingId === openRequest.id}
                onCancel={() => cancel(openRequest)}
              />
            )}
          </div>

          {chosen && !openRequest && (
            <div ref={formRef}>
              <PlanRequestForm
                key={`${chosen.code}-${cycle}`}
                plan={chosen}
                cycle={cycle}
                payTo={subscription.payTo}
                sending={sending}
                onSubmit={submit}
                onClose={() => setChosen(null)}
              />
            </div>
          )}

          <PlanCards
            plans={plans}
            cycle={cycle}
            onCycleChange={setCycle}
            currentPlan={subscription.plan}
            blocked={Boolean(openRequest) || sending}
            onChoose={choose}
          />
          {openRequest && (
            <p className="plan-note">
              {t(
                "You can send a new request after we review the one that is waiting, or after you cancel it.",
              )}
            </p>
          )}

          <RecentRequests requests={subscription.recentRequests || []} />
        </>
      )}
    </main>
  );
}
