import { Banknote, CreditCard, Lock, Save, SlidersHorizontal } from "lucide-react";
import { useId, useState } from "react";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";
import usePaymentSettings from "../hooks/usePaymentSettings.js";
import { formatRate } from "../model/payment.js";

const toForm = (settings) => ({
  cashEnabled: settings.cashEnabled,
  cardPrepaidEnabled: settings.cardPrepaidEnabled,
  cardPostpaidEnabled: settings.cardPostpaidEnabled,
  freeCancelHours: String(settings.freeCancelHours),
  lateCancelFeePercent: String(settings.lateCancelFeePercent),
  noShowFeePercent: String(settings.noShowFeePercent),
});

function MethodToggle({ icon: Icon, label, hint, checked, disabled, onChange }) {
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
              hint={gatewayReady ? "Guest pays with a secure link." : "Needs a payment provider"}
              checked={form.cardPostpaidEnabled}
              disabled={!gatewayReady}
              onChange={set("cardPostpaidEnabled")}
            />
            <MethodToggle
              icon={CreditCard}
              label="Card now"
              hint={gatewayReady ? "Amount is held when booking." : "Needs a payment provider"}
              checked={form.cardPrepaidEnabled}
              disabled={!gatewayReady}
              onChange={set("cardPrepaidEnabled")}
            />
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
                max={100}
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
                max={100}
                required
                inputMode="numeric"
                value={form.noShowFeePercent}
                onChange={setNumber("noShowFeePercent")}
              />
            </label>
            <p className="pay-note">
              Fees apply only to bookings paid by card in advance. Cash guests
              are never charged a fee.
            </p>
          </fieldset>

          <footer className="pay-settings-foot">
            <span className="pay-commission">
              SalonHub commission: <strong>{formatRate(settings.commissionRateBps)}</strong>
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
