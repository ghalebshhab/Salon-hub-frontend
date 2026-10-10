import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { useCallback } from "react";

import {
  getMySalonEmployeesApi,
  resendEmployeeInvitationApi,
  removeEmployeeApi,
  processApplicationApi,
} from "../api/salonEmployeesApi.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";

export default function useMySalonEmployees() {
  const loader = useCallback(
    async (signal) =>
      requireData(await getMySalonEmployeesApi({ signal })) || [],
    [],
  );
  const {
    data: employees,
    loading,
    refetch: loadEmployees,
  } = useQuery(loader, { initialData: [], onError: showErrorToast });

  const handleResend = async (employeeId) => {
    try {
      const response = await resendEmployeeInvitationApi(employeeId);

      if (response.success) {
        showSuccessToast("Invitation sent again.", "Invitation sent");
        loadEmployees();
      } else {
        showErrorToast(
          response.message || "Could not resend invitation.",
          "Failed",
        );
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Could not resend invitation.", "Failed");
    }
  };

  const handleRemove = async (employeeId) => {
    const confirmRemove = window.confirm(
      "Remove this employee from your salon?",
    );

    if (!confirmRemove) return;

    try {
      const response = await removeEmployeeApi(employeeId);

      if (response.success) {
        showSuccessToast("Employee removed successfully.", "Removed");
        loadEmployees();
      } else {
        showErrorToast(
          response.message || "Could not remove employee.",
          "Failed",
        );
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Could not remove employee.", "Failed");
    }
  };

  const handleProcessApplication = async (applicationId, accept) => {
    const actionText = accept ? "Accept" : "Reject";
    const confirmAction = window.confirm(`${actionText} this application?`);

    if (!confirmAction) return;

    try {
      const response = await processApplicationApi(applicationId, accept);

      if (response.success) {
        showSuccessToast(
          response.message ||
            `Application ${accept ? "accepted" : "rejected"} successfully.`,
          "Success",
        );
        loadEmployees();
      } else {
        showErrorToast(
          response.message ||
            `Could not ${actionText.toLowerCase()} application.`,
          "Failed",
        );
      }
    } catch (error) {
      console.error(error);
      showErrorToast(
        `Could not ${actionText.toLowerCase()} application.`,
        "Failed",
      );
    }
  };

  return {
    employees,
    loading,
    handleResend,
    handleRemove,
    handleProcessApplication,
  };
}
