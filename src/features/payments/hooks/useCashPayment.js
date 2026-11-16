import { useState } from "react";
import { recordCashPaymentApi } from "../api/paymentApi.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";
import { formatMoney } from "../model/payment.js";

/**
 * "Cash received" flow for the employee and the owner: `request(booking)`
 * opens the confirmation, `confirm()` records it once. Repeating it is safe;
 * the server answers with the same receipt.
 */
export default function useCashPayment({ onRecorded } = {}) {
  const [target, setTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const request = (booking) => setTarget(booking);
  const cancel = () => {
    if (!saving) setTarget(null);
  };

  const confirm = async () => {
    if (!target) return;
    try {
      setSaving(true);
      const response = await recordCashPaymentApi(target.id);
      if (!response.success) {
        showErrorToast(response.message || "Could not record the payment.");
        return;
      }
      showSuccessToast(
        `${formatMoney(response.data?.amountFils, response.data?.currency)} recorded. Receipt ${response.data?.receiptNumber || ""} is ready.`,
        "Cash received",
      );
      setTarget(null);
      onRecorded?.(response.data);
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Could not record the payment.",
      );
    } finally {
      setSaving(false);
    }
  };

  return { target, saving, request, cancel, confirm };
}
