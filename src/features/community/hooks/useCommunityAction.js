import { useCallback, useState } from "react";
import {
  showApiErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";

export default function useCommunityAction() {
  const [busyAction, setBusyAction] = useState(null);

  const runAction = useCallback(
    async ({ key, action, successMessage, errorMessage }) => {
      setBusyAction(key);
      try {
        const response = await action();
        if (successMessage) showSuccessToast(successMessage);
        return response;
      } catch (error) {
        showApiErrorToast(
          error,
          errorMessage || "The community action could not be completed.",
        );
        return null;
      } finally {
        setBusyAction(null);
      }
    },
    [],
  );

  return { busyAction, runAction };
}
