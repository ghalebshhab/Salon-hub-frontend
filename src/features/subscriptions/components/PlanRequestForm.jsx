import { Banknote, Send, Smartphone, X } from "lucide-react";
import { useId, useState } from "react";
import { BILLING_CYCLES, planPrice } from "../model/plan.js";
import t from "../../../shared/i18n/t.js";

const MAX_REFERENCE = 120;

/** Where to send a CliQ transfer. Shown in the form and on a waiting request. */
export function CliqDetails({ payTo }) {
  if (!payTo?.cliqAlias) return null;
  return (
    <dl className="plan-payto">
      <div>
        <dt>{t("CliQ alias")}</dt>
        <dd>{payTo.cliqAlias}</dd>
      </div>
      {payTo.cliqName && (
        <div>
          <dt>{t("Name")}</dt>
          <dd>{payTo.cliqName}</dd>
        </div>
      )}
    </dl>
  );
}

/** The owner picks how to pay for the chosen plan and sends the request. */
export default function PlanRequestForm({
  plan,
  cycle,
  payTo,
  sending,
  onSubmit,
  onClose,
}) {
  const id = useId();
  const cliqReady = Boolean(payTo?.cliqAlias);
  const [method, setMethod] = useState(cliqReady ? "CLIQ" : "CASH");
  const [reference, setReference] = useState("");
  const cycleLabel =
    BILLING_CYCLES.find((item) => item.key === cycle)?.label.toLowerCase() ||
    "monthly";

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      plan: plan.code,
      billingCycle: cycle,
      method,
      reference: method === "CLIQ" ? reference.trim() || null : null,
    });
  };

  return (
    <section
      className="owner-panel plan-request"
      aria-labelledby={`${id}-title`}
    >
      <header className="plan-request-head">
        <div>
          <span className="eyebrow">{t("Upgrade")}</span>
          <h2 id={`${id}-title`}>
            {plan.name}, {cycleLabel}: {planPrice(plan, cycle)}
          </h2>
          <p>
            {t(
              "Pay, then send this request. We turn on {name} when we confirm the payment, normally within one working day.",
              { name: plan.name },
            )}
          </p>
        </div>
        <button
          type="button"
          className="icon-button"
          aria-label={t("Close the upgrade form")}
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </header>
      <form onSubmit={submit}>
        <fieldset className="plan-methods">
          <legend>{t("How do you pay?")}</legend>
          <label className={`plan-method ${cliqReady ? "" : "is-locked"}`}>
            <input
              type="radio"
              name={`${id}-method`}
              value="CLIQ"
              checked={method === "CLIQ"}
              disabled={!cliqReady}
              onChange={() => setMethod("CLIQ")}
            />
            <Smartphone size={18} aria-hidden="true" />
            <span>
              <strong>{t("CliQ transfer")}</strong>
              <small>
                {cliqReady
                  ? t("Instant transfer from your bank app.")
                  : t("Not available yet.")}
              </small>
            </span>
          </label>
          <label className="plan-method">
            <input
              type="radio"
              name={`${id}-method`}
              value="CASH"
              checked={method === "CASH"}
              onChange={() => setMethod("CASH")}
            />
            <Banknote size={18} aria-hidden="true" />
            <span>
              <strong>{t("Cash")}</strong>
              <small>{t("Our team contacts you to collect it.")}</small>
            </span>
          </label>
        </fieldset>

        {method === "CLIQ" && (
          <div className="plan-cliq">
            <p>
              {t(
                "Send {amount} to this CliQ alias. Write your salon name in the transfer note.",
                { amount: planPrice(plan, cycle) },
              )}
            </p>
            <CliqDetails payTo={payTo} />
            <label className="plan-field" htmlFor={`${id}-reference`}>
              <span>{t("Transfer reference (optional)")}</span>
              <input
                id={`${id}-reference`}
                type="text"
                maxLength={MAX_REFERENCE}
                value={reference}
                autoComplete="off"
                placeholder={t("For example, the number in your bank app")}
                onChange={(event) => setReference(event.target.value)}
              />
            </label>
          </div>
        )}

        <div className="plan-request-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {t("Cancel")}
          </button>
          <button type="submit" className="btn btn-primary" disabled={sending}>
            <Send size={16} aria-hidden="true" />
            {sending ? t("Sending…") : t("Send request")}
          </button>
        </div>
      </form>
    </section>
  );
}
