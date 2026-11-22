import { MapPin, Phone, StickyNote } from "lucide-react";
import { useId } from "react";
import PaymentMethodPicker from "../../../payments/components/PaymentMethodPicker.jsx";
import { toFils } from "../../../payments/model/payment.js";
import t from "../../../../shared/i18n/t.js";

export default function ReviewStep({
  phone,
  onPhoneChange,
  area,
  onAreaChange,
  note,
  onNoteChange,
  paymentMethods,
  paymentMethod,
  onPaymentMethodChange,
  totalPrice,
  freeCancelHours,
}) {
  const id = useId();
  return (
    <div className="bk-fieldset">
      <div className="bk-step-title">
        <span className="eyebrow">{t("Step 4")}</span>
        {t("Almost done")}
        <small>
          {t(
            "Check the summary, then send your request. The salon confirms it and tells you who will serve you.",
          )}
        </small>
      </div>

      <div className="bk-form">
        <label className="bk-field" htmlFor={`${id}-area`}>
          <span>
            <MapPin size={15} aria-hidden="true" />{" "}
            {t("Where are you coming from?")}
          </span>
          <input
            id={`${id}-area`}
            value={area}
            onChange={(event) => onAreaChange(event.target.value)}
            placeholder={t("For example: Sweifieh, Amman")}
            maxLength={255}
            autoComplete="address-level3"
            required
          />
          <small>
            {t(
              "Helps the salon plan your visit. On the day you can also share your live trip.",
            )}
          </small>
        </label>

        <label className="bk-field" htmlFor={`${id}-phone`}>
          <span>
            <Phone size={15} aria-hidden="true" /> {t("Phone number")}
            <em>{t("Optional")}</em>
          </span>
          <input
            id={`${id}-phone`}
            type="tel"
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            placeholder={t("07XXXXXXXX")}
            maxLength={30}
            autoComplete="tel"
          />
          <small>
            {t("Leave it empty to use the number on your profile.")}
          </small>
        </label>

        <label className="bk-field bk-field-wide" htmlFor={`${id}-note`}>
          <span>
            <StickyNote size={15} aria-hidden="true" />{" "}
            {t("Note for the salon")}
            <em>{t("Optional")}</em>
          </span>
          <textarea
            id={`${id}-note`}
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            placeholder={t(
              "Hair length, allergies, or anything the salon should know",
            )}
            maxLength={1000}
            rows={3}
          />
        </label>
      </div>

      <PaymentMethodPicker
        methods={paymentMethods}
        value={paymentMethod}
        onChange={onPaymentMethodChange}
        totalFils={toFils(totalPrice)}
        freeCancelHours={freeCancelHours}
      />
    </div>
  );
}
