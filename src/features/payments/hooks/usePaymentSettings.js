import { useCallback, useState } from "react";
import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import {
  getPaymentSettingsApi,
  updatePaymentSettingsApi,
} from "../api/paymentApi.js";
import t from "../../../shared/i18n/t.js";

/** Owner payment settings. `save` resolves to `{ ok, message, data }`. */
export default function usePaymentSettings(salonId, { onError } = {}) {
  const [saving, setSaving] = useState(false);
  const loader = useCallback(
    async (signal) =>
      salonId
        ? requireData(await getPaymentSettingsApi(salonId, { signal }))
        : null,
    [salonId],
  );
  const { data, loading, refetch } = useQuery(loader, {
    initialData: null,
    keepPreviousData: true,
    onError,
  });

  const save = async (settings) => {
    try {
      setSaving(true);
      const response = await updatePaymentSettingsApi(salonId, settings);
      if (!response.success) {
        return {
          ok: false,
          message: response.message || t("Could not save the settings."),
        };
      }
      refetch();
      return { ok: true, message: response.message, data: response.data };
    } catch (error) {
      return {
        ok: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          t("Could not save the settings."),
      };
    } finally {
      setSaving(false);
    }
  };

  return { settings: data, loading, saving, save };
}
