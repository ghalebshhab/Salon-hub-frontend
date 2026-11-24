import { useState } from "react";
import {
  recordCashPaymentApi,
  recordCliqPaymentApi,
} from "../api/paymentApi.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";
import { formatMoney, isCliq } from "../model/payment.js";
import t from "../../../shared/i18n/t.js";

/**
 * "Cash received" flow for the employee and the owner: `request(booking)`
 * opens the confirmation, `confirm()` records it once. For a CliQ booking the
 * owner confirms the transfer instead: `confirm(reference)`. Repeating it is
 * safe; the server answers with the same receipt.
 */
export default function useCashPayment({ onRecorded } = {}) {
  const [target, setTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const request = (booking) => setTarget(booking);
  const cancel = () => {
    if (!saving) setTarget(null);
  };

  const confirm = async (reference) => {
    if (!target) return;
    const cliq = isCliq(target.payment?.method);
    try {
      setSaving(true);
      const response = cliq
        ? await recordCliqPaymentApi(target.id, reference?.trim() || undefined)
        : await recordCashPaymentApi(target.id);
      if (!response.success) {
        showErrorToast(response.message || t("Could not record the payment."));
        return;
      }
      showSuccessToast(
        t("{amount} recorded. Receipt {receipt} is ready.", {
          amount: formatMoney(
            response.data?.amountFils,
            response.data?.currency,
          ),
          receipt: response.data?.receiptNumber || "",
        }),
        cliq ? t("Paid by CliQ") : t("Cash received"),
      );
      setTarget(null);
      onRecorded?.(response.data);
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          t("Could not record the payment."),
      );
    } finally {
      setSaving(false);
    }
  };

  return { target, saving, request, cancel, confirm };
}
