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

function StatusPill({ look }) {
  return <span className={`plan-pill is-${look.tone}`}>{look.label}</span>;
}

/** Plan time left in words, for the summary card. */
function accessText(subscription) {
  const { status, daysLeft, accessEndsAt } = subscription;
  if (status === "ENDED" || daysLeft == null) {
    return "Free has no end date. Upgrade at any time.";
  }
  const days = daysLeft === 1 ? "1 day" : `${daysLeft} days`;
  const date = formatDate(accessEndsAt);
  if (status === "TRIAL") return `Your free trial ends in ${days}, on ${date}.`;
  if (status === "GRACE") {
    return `Your plan ended. Pay within ${days} (by ${date}) to keep it.`;
  }
  return `Paid until ${date} (${days} left).`;
}

function UsageMeter({ row }) {
  const unlimited = row.max == null;
  const ratio = unlimited ? 0 : Math.min(1, row.used / Math.max(1, row.max));
  const full = !unlimited && row.used >= row.max;
  return (
    <li className={`plan-meter ${full ? "is-full" : ""}`}>
      <div className="plan-meter-text">
        <span>
          {row.label}
          {row.hint && <small> · {row.hint}</small>}
        </span>
        <strong>
          {row.used} {unlimited ? "· unlimited" : `of ${row.max}`}
        </strong>
      </div>
      {!unlimited && (
        <span
          className="plan-meter-bar"
          role="meter"
          aria-label={row.label}
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
    <section className="owner-panel plan-current" aria-label="Your plan">
      <div className="plan-current-head">
        <span className="plan-current-icon" aria-hidden="true">
          <Crown size={20} />
        </span>
        <div>
          <span className="eyebrow">Your plan</span>
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
        Dashboard history: {limits.analyticsMaxDays} days
        {limits.features.includes("CARD_PAYMENTS") &&
          ` · Card payment fee: ${feeText(limits.cardFeeBps)}`}
      </p>
    </section>
  );
}

function OpenRequest({ request, payTo, cancelling, onCancel }) {
  return (
    <section className="owner-panel plan-open" aria-label="Request waiting">
      <div className="plan-open-head">
        <Clock3 size={20} aria-hidden="true" />
        <div>
          <h2>
            Request for {request.plan === "BUSINESS" ? "Business" : "Pro"}{" "}
            <StatusPill look={REQUEST_STATUS_LOOK.PENDING} />
          </h2>
          <p>
            {formatMoney(request.amountFils, request.currency)},{" "}
            {request.billingCycle === "YEARLY" ? "yearly" : "monthly"}, by{" "}
            {METHOD_LABELS[request.method]}. Sent on{" "}
            {formatDate(request.createdAt)}.
          </p>
          {request.method === "CLIQ" && (
            <>
              <p>If you did not pay yet, send the transfer to:</p>
              <CliqDetails payTo={payTo} />
            </>
          )}
          {request.method === "CASH" && (
            <p>Our team contacts you to collect the cash.</p>
          )}
          {request.reference && <p>Your reference: {request.reference}</p>}
        </div>
      </div>
      <button
        type="button"
        className="btn btn-secondary"
        disabled={cancelling}
        onClick={onCancel}
      >
        {cancelling ? "Cancelling…" : "Cancel request"}
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
      <h2 id="plan-history">Past requests</h2>
      <ul>
        {done.map((request) => {
          const look = REQUEST_STATUS_LOOK[request.status];
          return (
            <li key={request.id}>
              <div>
                <strong>
                  {request.plan === "BUSINESS" ? "Business" : "Pro"},{" "}
                  {request.billingCycle === "YEARLY" ? "yearly" : "monthly"}
                </strong>
                <small>
                  {formatMoney(request.amountFils, request.currency)} ·{" "}
                  {METHOD_LABELS[request.method]} ·{" "}
                  {formatDate(request.createdAt)}
                </small>
                {request.rejectionReason && (
                  <small>Reason: {request.rejectionReason}</small>
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

function PlanSkeleton() {
  return (
    <div className="plan-skeleton" aria-busy="true" aria-label="Loading">
      <span className="skeleton-block" />
      <span className="skeleton-block" />
    </div>
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
      title: "Cancel this request?",
      message:
        "If you already paid, keep the request so we can find your payment.",
      confirmText: "Cancel request",
      cancelText: "Keep it",
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
          <span className="eyebrow">Billing</span>
          <h1>My plan</h1>
          <p>What your plan includes, what you use, and how to upgrade.</p>
        </div>
        {supportPhone && (
          <a className="btn btn-secondary" href={`tel:${supportPhone}`}>
            <Phone size={16} aria-hidden="true" />
            Call us
          </a>
        )}
      </header>

      {loading && <PlanSkeleton />}
      {!loading && (error || !subscription) && (
        <div className="empty-state">
          <h2>Your plan could not be loaded</h2>
          <p>Check your connection, then try again.</p>
          <button type="button" className="btn btn-primary" onClick={refetch}>
            <RefreshCw size={16} aria-hidden="true" />
            Try again
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
              You can send a new request after we review the one that is
              waiting, or after you cancel it.
            </p>
          )}

          <RecentRequests requests={subscription.recentRequests || []} />
        </>
      )}
    </main>
  );
}
