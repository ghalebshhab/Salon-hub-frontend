import { useCallback, useState } from "react";
import { setSalonManagerApi } from "../api/salonEmployeesApi.js";
import { confirmAction } from "../../../shared/confirm/confirmStore.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";
import t from "../../../shared/i18n/t.js";

/**
 * The owner gives or removes the salon manager role. A manager can answer
 * bookings and plan the team's time; money and settings stay with the owner.
 */
export default function useSalonManagerRole(onChanged) {
  const [busyId, setBusyId] = useState(null);

  const setManager = useCallback(
    async (employee, manager) => {
      const name = employee.fullName || t("This employee");
      const confirmed = await confirmAction(
        manager
          ? {
              title: t("Make {name} a manager?", { name }),
              message: t(
                "Managers can answer booking requests, assign employees and change the team's schedules and time off. They cannot see payments, your plan or salon settings.",
              ),
              confirmText: t("Make manager"),
              cancelText: t("Cancel"),
            }
          : {
              title: t("Remove {name} as manager?", { name }),
              message: t(
                "They stay on your team, but they can no longer manage bookings or schedules.",
              ),
              confirmText: t("Remove manager"),
              cancelText: t("Keep manager"),
              danger: true,
            },
      );
      if (!confirmed) return;

      setBusyId(employee.id);
      try {
        const response = await setSalonManagerApi(employee.id, manager);
        if (!response.success) {
          showErrorToast(
            response.message || t("The manager role was not saved."),
          );
          return;
        }
        showSuccessToast(response.message);
        await onChanged?.();
      } catch (error) {
        showErrorToast(error.message || t("The manager role was not saved."));
      } finally {
        setBusyId(null);
      }
    },
    [onChanged],
  );

  return { setManager, busyId };
}
