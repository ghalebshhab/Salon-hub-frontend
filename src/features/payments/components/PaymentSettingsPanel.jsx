import {
  Banknote,
  CreditCard,
  Lock,
  Save,
  SlidersHorizontal,
  Smartphone,
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
import t from "../../../shared/i18n/t.js";

const toForm = (settings) => ({
  cashEnabled: settings.cashEnabled,
  cardPrepaidEnabled: settings.cardPrepaidEnabled,
  cardPostpaidEnabled: settings.cardPostpaidEnabled,
  cliqEnabled: Boolean(settings.cliqEnabled),
  cliqAlias: settings.cliqAlias || "",
  cliqName: settings.cliqName || "",
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
        <strong>{t(label)}</strong>
        <small>{t(hint)}</small>
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
  const planName = subscription?.limits?.name || t("Free");
  // A locked fee may only go down from the saved value.
  const feeMax = (field) =>
    planLocks.fees ? Number(settings?.[field] || 0) : 100;

  const set = (field) => (value) =>
    setDraft((current) => ({ ...(current || form), [field]: value }));
  const setNumber = (field) => (event) => set(field)(event.target.value);

  const submit = async (event) => {
    event.preventDefault();
    // Optional chaining: the React Compiler reads these fields during render
    // to memoize this handler, and the form is null until settings load.
    const result = await save({
      cashEnabled: form?.cashEnabled,
      cardPrepaidEnabled: form?.cardPrepaidEnabled,
      cardPostpaidEnabled: form?.cardPostpaidEnabled,
      cliqEnabled: form?.cliqEnabled,
      cliqAlias: form?.cliqAlias?.trim() || null,
      cliqName: form?.cliqName?.trim() || null,
      freeCancelHours: Number(form?.freeCancelHours),
      lateCancelFeePercent: Number(form?.lateCancelFeePercent),
      noShowFeePercent: Number(form?.noShowFeePercent),
      noShowLimit: form?.noShowRuleOn ? Number(form?.noShowLimit) : null,
    });
    if (!result.ok) {
      showErrorToast(result.message);
      return;
    }
    setDraft(null);
    showSuccessToast(t("Payment settings saved."));
  };

  return (
    <section className="pay-panel" aria-labelledby={`${id}-title`}>
      <header className="pay-panel-head">
        <span className="pay-panel-icon" aria-hidden="true">
          <SlidersHorizontal size={18} />
        </span>
        <div>
          <h2 id={`${id}-title`}>{t("Payment settings")}</h2>
          <p>{t("What guests can choose, and your cancellation rules.")}</p>
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
            <legend>{t("Accepted methods")}</legend>
            <MethodToggle
              icon={Banknote}
              label={t("Cash at the salon")}
              hint={t("Staff confirm the cash after the service.")}
              checked={form.cashEnabled}
              onChange={set("cashEnabled")}
            />
            <MethodToggle
              icon={CreditCard}
              label={t("Card after the service")}
              hint={
                gatewayReady
                  ? t("Guest pays with a secure link.")
                  : t("Needs a payment provider")
              }
              checked={form.cardPostpaidEnabled}
              disabled={
                !gatewayReady || (planLocks.card && !form.cardPostpaidEnabled)
              }
              onChange={set("cardPostpaidEnabled")}
            />
            <MethodToggle
              icon={CreditCard}
              label={t("Card now")}
              hint={
                gatewayReady
                  ? t("Amount is held when booking.")
                  : t("Needs a payment provider")
              }
              checked={form.cardPrepaidEnabled}
              disabled={
                !gatewayReady || (planLocks.card && !form.cardPrepaidEnabled)
              }
              onChange={set("cardPrepaidEnabled")}
            />
            <MethodToggle
              icon={Smartphone}
              label={t("CliQ transfer")}
              hint={t(
                "Guests send the amount to your CliQ alias. You mark it as paid.",
              )}
              checked={form.cliqEnabled}
              onChange={set("cliqEnabled")}
            />
            {form.cliqEnabled && (
              <div className="pay-cliq-fields">
                <label>
                  <span>{t("CliQ alias or mobile number")}</span>
                  <input
                    type="text"
                    dir="ltr"
                    required
                    maxLength={40}
                    pattern="\+?[A-Za-z0-9._\-]{2,40}"
                    title={t(
                      "Use 2 to 40 letters, digits, dots, dashes or underscores.",
                    )}
                    value={form.cliqAlias}
                    onChange={setNumber("cliqAlias")}
                    placeholder="SALONHUB or 0791234567"
                  />
                </label>
                <label>
                  <span>{t("Account name guests see (optional)")}</span>
                  <input
                    type="text"
                    maxLength={80}
                    value={form.cliqName}
                    onChange={setNumber("cliqName")}
                  />
                </label>
              </div>
            )}
            {planLocks.card && (
              <PlanLockNote>
                {t(
                  "Card payment is part of Pro and Business, not {planName}.",
                  { planName },
                )}
              </PlanLockNote>
            )}
            {!gatewayReady && (
              <p className="pay-note">
                <Lock size={14} aria-hidden="true" />
                {t(
                  "Card payments open when SalonHub connects a payment provider.",
                )}
              </p>
            )}
          </fieldset>

          <fieldset className="pay-rules">
            <legend>{t("Cancellation rules")}</legend>
            <label>
              <span>{t("Free cancellation (hours before)")}</span>
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
              <span>{t("Late cancellation fee (%)")}</span>
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
              <span>{t("No-show fee (%)")}</span>
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
                {t(
                  "Late-cancel and no-show fees are part of Pro and Business.",
                )}
              </PlanLockNote>
            )}
            <p className="pay-note">
              {t(
                "Fees apply only to bookings paid by card in advance. Cash guests are never charged a fee.",
              )}
            </p>
          </fieldset>

          <fieldset className="pay-rules pay-no-show-rule">
            <legend>{t("Missed-visit rule")}</legend>
            <MethodToggle
              icon={UserX}
              label={t("Ask repeat no-shows to pay in advance")}
              hint={t(
                "Protects your time from customers who often do not come.",
              )}
              checked={form.noShowRuleOn}
              disabled={planLocks.rule && !form.noShowRuleOn}
              onChange={set("noShowRuleOn")}
            />
            {planLocks.rule && (
              <PlanLockNote>
                {t("The missed-visit rule is part of Pro and Business.")}
              </PlanLockNote>
            )}
            {form.noShowRuleOn && (
              <label>
                <span>{t("Missed visits before the rule applies")}</span>
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
                ? t("These customers can book only with “Card now”.")
                : t(
                    "Until card payment is on, these customers cannot book online and are asked to contact you.",
                  )}
            </p>
          </fieldset>

          <footer className="pay-settings-foot">
            <span className="pay-commission">
              {t("Card payment fee on your plan:")}
              <strong>{formatRate(settings.commissionRateBps)}</strong>
            </span>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={saving || !draft}
            >
              <Save size={16} aria-hidden="true" />
              {saving ? t("Saving…") : t("Save settings")}
            </button>
          </footer>
        </form>
      )}
    </section>
  );
}
