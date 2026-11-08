import { useEffect, useState } from "react";
import { requireData } from "../../../shared/api/response.js";
import {
  showApiErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";
import {
  getFollowedSalonsApi,
  setSalonFollowApi,
} from "../api/communitySalonFollowsApi.js";

export default function useSalonFollow(salonId, enabled) {
  const [followed, setFollowed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!enabled || !salonId) return undefined;
    const controller = new AbortController();
    async function run() {
      try {
        const response = await getFollowedSalonsApi({
          signal: controller.signal,
        });
        if (!controller.signal.aborted)
          setFollowed(
            (requireData(response) || []).some(
              (item) => Number(item.salon.id) === Number(salonId),
            ),
          );
      } catch {
        // Following state is optional context; the profile remains usable.
      }
    }
    run();
    return () => controller.abort();
  }, [enabled, salonId]);

  const toggle = async () => {
    setBusy(true);
    try {
      requireData(await setSalonFollowApi(salonId, !followed));
      setFollowed((value) => !value);
      showSuccessToast(followed ? "Salon unfollowed." : "Salon followed.");
    } catch (error) {
      showApiErrorToast(error, "Salon following could not be updated.");
    } finally {
      setBusy(false);
    }
  };

  return { followed, busy, toggle };
}
