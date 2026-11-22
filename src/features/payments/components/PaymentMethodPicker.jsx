import { Banknote, CreditCard, Lock, ShieldCheck } from "lucide-react";
import { useId } from "react";
import {
  CARD_METHODS,
  PAYMENT_METHODS,
  formatMoney,
} from "../model/payment.js";
import t from "../../../shared/i18n/t.js";

const ICONS = {
  CASH: Banknote,
  CARD_POSTPAID: CreditCard,
  CARD_PREPAID: CreditCard,
};

/**
 * Radio cards for the booking wizard. Methods the salon cannot take yet are
 * shown locked, so the customer knows they exist but cannot pick them.
 */
export default function PaymentMethodPicker({
  methods = ["CASH"],
  value,
  onChange,
  totalFils,
  freeCancelHours = 24,
}) {
  const id = useId();
  const shown = ["CASH", ...CARD_METHODS];

  return (
    <fieldset className="pay-picker" aria-describedby={`${id}-terms`}>
      <legend className="pay-picker-legend">
        <span>{t("How do you want to pay?")}</span>
        <strong>{formatMoney(totalFils)}</strong>
      </legend>

      <div className="pay-picker-options">
        {shown.map((method) => {
          const available = methods.includes(method);
          const selected = value === method;
          const Icon = ICONS[method];
          return (
            <label
              key={method}
              className={`pay-option ${selected ? "is-selected" : ""} ${available ? "" : "is-locked"}`}
            >
              <input
                type="radio"
                className="sr-only"
                name={`${id}-method`}
                value={method}
                checked={selected}
                disabled={!available}
                onChange={() => available && onChange(method)}
              />
              <span className="pay-option-icon" aria-hidden="true">
                <Icon size={18} />
              </span>
              <span className="pay-option-body">
                <strong>{t(PAYMENT_METHODS[method].label)}</strong>
                <small>
                  {available ? PAYMENT_METHODS[method].hint : t("Coming soon")}
                </small>
              </span>
              {!available && (
                <Lock
                  className="pay-option-lock"
                  size={14}
                  aria-hidden="true"
                />
              )}
            </label>
          );
        })}
      </div>

      <p className="pay-picker-terms" id={`${id}-terms`}>
        <ShieldCheck size={15} aria-hidden="true" />
        <span>
          {t(
            "Nothing is charged now. Free cancellation until {freeCancelHours} hours before your appointment.",
            { freeCancelHours },
          )}
        </span>
      </p>
    </fieldset>
  );
}
