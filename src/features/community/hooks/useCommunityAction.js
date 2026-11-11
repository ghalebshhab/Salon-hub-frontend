import { useCallback, useState } from "react";
import {
  showApiErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";

export function isCommunityActionBusy(actions, key) {
  return actions instanceof Set ? actions.has(key) : actions === key;
}

export function mergeCommunityActions(...actionSets) {
  return new Set(actionSets.flatMap((actions) => [...(actions || [])]));
}

export default function useCommunityAction() {
  const [busyAction, setBusyAction] = useState(() => new Set());

  const runAction = useCallback(
    async ({ key, action, successMessage, errorMessage }) => {
      setBusyAction((current) => new Set(current).add(key));
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
        setBusyAction((current) => {
          const next = new Set(current);
          next.delete(key);
          return next;
        });
      }
    },
    [],
  );

  return { busyAction, runAction };
}
