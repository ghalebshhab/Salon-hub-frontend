import { useEffect, useState } from "react";
import {
  changePaymentMethodApi,
  getPaymentOptionsApi,
} from "../api/paymentApi.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";
import { MANUAL_METHODS } from "../model/payment.js";
import t from "../../../shared/i18n/t.js";

/**
 * The customer switches an unpaid booking between cash and CliQ.
 * `request(booking)` opens the dialog and loads what the salon accepts now;
 * `confirm(method)` saves it.
 */
export default function usePaymentMethodChange({ onChanged } = {}) {
  const [target, setTarget] = useState(null);
  const [options, setOptions] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!target) return undefined;
    const controller = new AbortController();
    getPaymentOptionsApi(target.salonId, { signal: controller.signal })
      .then((response) => {
        if (controller.signal.aborted) return;
        const data = response?.data || {};
        setOptions({
          methods: (data.methods || []).filter((method) =>
            MANUAL_METHODS.includes(method),
          ),
          cliqAlias: data.cliqAlias || null,
          cliqName: data.cliqName || null,
        });
      })
      .catch(() => {
        if (!controller.signal.aborted) setOptions({ methods: [] });
      });
    return () => controller.abort();
  }, [target]);

  const request = (booking) => {
    setOptions(null);
    setTarget(booking);
  };
  const cancel = () => {
    if (!saving) setTarget(null);
  };

  const confirm = async (method) => {
    if (!target || !method) return;
    try {
      setSaving(true);
      const response = await changePaymentMethodApi(target.id, method);
      if (!response.success) {
        showErrorToast(
          response.message || t("Could not change the payment method."),
        );
        return;
      }
      showSuccessToast(response.message);
      setTarget(null);
      onChanged?.(response.data);
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          t("Could not change the payment method."),
      );
    } finally {
      setSaving(false);
    }
  };

  return { target, options, saving, request, cancel, confirm };
}
