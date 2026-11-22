import { useCallback, useState } from "react";
import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import {
  addSalonClosureApi,
  getSalonClosuresApi,
  removeSalonClosureApi,
} from "../api/salonApi.js";
import t from "../../../shared/i18n/t.js";

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

/**
 * Upcoming whole-day closures of a salon (holidays, renovation).
 * Everyone can read them; `add` and `remove` work only for the owner and
 * resolve to `{ ok, message, affectedBookings }`.
 */
export default function useSalonClosures(salonId, { onError } = {}) {
  const [saving, setSaving] = useState(false);
  const loader = useCallback(
    async (signal) =>
      salonId
        ? requireData(await getSalonClosuresApi(salonId, { signal })) || []
        : [],
    [salonId],
  );
  const { data, loading, refetch } = useQuery(loader, {
    initialData: [],
    keepPreviousData: true,
    onError,
  });

  const add = async (closure) => {
    try {
      setSaving(true);
      const response = await addSalonClosureApi(salonId, closure);
      if (!response.success) {
        return {
          ok: false,
          message: response.message || t("Could not save the closure."),
        };
      }
      refetch();
      return {
        ok: true,
        message: response.message,
        affectedBookings: response.data?.affectedBookings || 0,
      };
    } catch (error) {
      return {
        ok: false,
        message: errorMessage(error, t("Could not save the closure.")),
      };
    } finally {
      setSaving(false);
    }
  };

  const remove = async (closureId) => {
    try {
      const response = await removeSalonClosureApi(salonId, closureId);
      if (!response.success) {
        return {
          ok: false,
          message: response.message || t("Could not remove the closure."),
        };
      }
      refetch();
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: errorMessage(error, t("Could not remove the closure.")),
      };
    }
  };

  return { items: data, loading, saving, add, remove };
}
