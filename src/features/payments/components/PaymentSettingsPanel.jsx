import {
  Banknote,
  CreditCard,
  Lock,
  Save,
  SlidersHorizontal,
  UserX,
} from "lucide-react";
import { useId, useState } from "react";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";
import PlanLockNote from "../../subscriptions/components/PlanLockNote.jsx";
import useMySubscription from "../../subscriptions/hooks/useMySubscription.js";
import usePaymentSettings from "../hooks/usePaymentSettings.js";
import { formatRate } from "../model/payment.js";

const toForm = (settings) => ({
  cashEnabled: settings.cashEnabled,
  cardPrepaidEnabled: settings.cardPrepaidEnabled,
  cardPostpaidEnabled: settings.cardPostpaidEnabled,
  freeCancelHours: String(settings.freeCancelHours),
  lateCancelFeePercent: String(settings.lateCancelFeePercent),
  noShowFeePercent: String(settings.noShowFeePercent),
  noShowRuleOn: settings.noShowLimit != null,
  noShowLimit: String(settings.noShowLimit ?? 2),
});

function MethodToggle({
  icon: Icon,
  label,
  hint,
  checked,
  disabled,
  onChange,
}) {
  return (
    <label className={`pay-toggle ${disabled ? "is-locked" : ""}`}>
      <span className="pay-option-icon" aria-hidden="true">
        <Icon size={17} />
      </span>
      <span className="pay-option-body">
        <strong>{label}</strong>
        <small>{hint}</small>
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

/** Owner settings: accepted methods, free-cancel window and fees. */
export default function PaymentSettingsPanel({ salonId }) {
  const id = useId();
  const { settings, loading, saving, save } = usePaymentSettings(salonId, {
    onError: showErrorToast,
  });
  const [draft, setDraft] = useState(null);
  const form = draft || (settings ? toForm(settings) : null);
  const gatewayReady = Boolean(settings?.cardGatewayReady);
  // Features outside the salon's plan can be turned off but not on.
  const { data: subscription } = useMySubscription();
  const features = subscription?.limits?.features;
  const planLocks = {
    card: Boolean(features && !features.includes("CARD_PAYMENTS")),
    fees: Boolean(features && !features.includes("CANCELLATION_FEES")),
    rule: Boolean(features && !features.includes("MISSED_VISIT_RULE")),
  };
  const planName = subscription?.limits?.name || "Free";
  // A locked fee may only go down from the saved value.
  const feeMax = (field) =>
    planLocks.fees ? Number(settings?.[field] || 0) : 100;

  const set = (field) => (value) =>
    setDraft((current) => ({ ...(current || form), [field]: value }));
  const setNumber = (field) => (event) => set(field)(event.target.value);

  const submit = async (event) => {
    event.preventDefault();
    const result = await save({
      cashEnabled: form.cashEnabled,
      cardPrepaidEnabled: form.cardPrepaidEnabled,
      cardPostpaidEnabled: form.cardPostpaidEnabled,
      freeCancelHours: Number(form.freeCancelHours),
      lateCancelFeePercent: Number(form.lateCancelFeePercent),
      noShowFeePercent: Number(form.noShowFeePercent),
      noShowLimit: form.noShowRuleOn ? Number(form.noShowLimit) : null,
    });
    if (!result.ok) {
      showErrorToast(result.message);
      return;
    }
    setDraft(null);
    showSuccessToast("Payment settings saved.");
  };

  return (
    <section className="pay-panel" aria-labelledby={`${id}-title`}>
      <header className="pay-panel-head">
        <span className="pay-panel-icon" aria-hidden="true">
          <SlidersHorizontal size={18} />
        </span>
        <div>
          <h2 id={`${id}-title`}>Payment settings</h2>
          <p>What guests can choose, and your cancellation rules.</p>
        </div>
      </header>

      {loading || !form ? (
        <div className="pay-panel-skeleton" aria-busy="true">
          <span className="skeleton-block" />
          <span className="skeleton-block" />
          <span className="skeleton-block" />
        </div>
      ) : (
        <form className="pay-settings-form" onSubmit={submit}>
          <fieldset className="pay-toggles">
            <legend>Accepted methods</legend>
            <MethodToggle
              icon={Banknote}
              label="Cash at the salon"
              hint="Staff confirm the cash after the service."
              checked={form.cashEnabled}
              onChange={set("cashEnabled")}
            />
            <MethodToggle
              icon={CreditCard}
              label="Card after the service"
              hint={
                gatewayReady
                  ? "Guest pays with a secure link."
                  : "Needs a payment provider"
              }
              checked={form.cardPostpaidEnabled}
              disabled={
                !gatewayReady || (planLocks.card && !form.cardPostpaidEnabled)
              }
              onChange={set("cardPostpaidEnabled")}
            />
            <MethodToggle
              icon={CreditCard}
              label="Card now"
              hint={
                gatewayReady
                  ? "Amount is held when booking."
                  : "Needs a payment provider"
              }
              checked={form.cardPrepaidEnabled}
              disabled={
                !gatewayReady || (planLocks.card && !form.cardPrepaidEnabled)
              }
              onChange={set("cardPrepaidEnabled")}
            />
            {planLocks.card && (
              <PlanLockNote>
                Card payment is part of Pro and Business, not {planName}.
              </PlanLockNote>
            )}
            {!gatewayReady && (
              <p className="pay-note">
                <Lock size={14} aria-hidden="true" />
                Card payments open when SalonHub connects a payment provider.
              </p>
            )}
          </fieldset>

          <fieldset className="pay-rules">
            <legend>Cancellation rules</legend>
            <label>
              <span>Free cancellation (hours before)</span>
              <input
                type="number"
                min={0}
                max={168}
                required
                inputMode="numeric"
                value={form.freeCancelHours}
                onChange={setNumber("freeCancelHours")}
              />
            </label>
            <label>
              <span>Late cancellation fee (%)</span>
              <input
                type="number"
                min={0}
                max={feeMax("lateCancelFeePercent")}
                required
                inputMode="numeric"
                value={form.lateCancelFeePercent}
                onChange={setNumber("lateCancelFeePercent")}
              />
            </label>
            <label>
              <span>No-show fee (%)</span>
              <input
                type="number"
                min={0}
                max={feeMax("noShowFeePercent")}
                required
                inputMode="numeric"
                value={form.noShowFeePercent}
                onChange={setNumber("noShowFeePercent")}
              />
            </label>
            {planLocks.fees && (
              <PlanLockNote>
                Late-cancel and no-show fees are part of Pro and Business.
              </PlanLockNote>
            )}
            <p className="pay-note">
              Fees apply only to bookings paid by card in advance. Cash guests
              are never charged a fee.
            </p>
          </fieldset>

          <fieldset className="pay-rules pay-no-show-rule">
            <legend>Missed-visit rule</legend>
            <MethodToggle
              icon={UserX}
              label="Ask repeat no-shows to pay in advance"
              hint="Protects your time from customers who often do not come."
              checked={form.noShowRuleOn}
              disabled={planLocks.rule && !form.noShowRuleOn}
              onChange={set("noShowRuleOn")}
            />
            {planLocks.rule && (
              <PlanLockNote>
                The missed-visit rule is part of Pro and Business.
              </PlanLockNote>
            )}
            {form.noShowRuleOn && (
              <label>
                <span>Missed visits before the rule applies</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  required
                  inputMode="numeric"
                  value={form.noShowLimit}
                  onChange={setNumber("noShowLimit")}
                />
              </label>
            )}
            <p className="pay-note">
              {gatewayReady && form.cardPrepaidEnabled
                ? "These customers can book only with “Card now”."
                : "Until card payment is on, these customers cannot book online and are asked to contact you."}
            </p>
          </fieldset>

          <footer className="pay-settings-foot">
            <span className="pay-commission">
              Card payment fee on your plan:{" "}
              <strong>{formatRate(settings.commissionRateBps)}</strong>
            </span>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={saving || !draft}
            >
              <Save size={16} aria-hidden="true" />
              {saving ? "Saving…" : "Save settings"}
            </button>
          </footer>
        </form>
      )}
    </section>
  );
}
