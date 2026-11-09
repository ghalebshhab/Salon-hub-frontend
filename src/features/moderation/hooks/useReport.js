import { useState } from "react";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";
import { getApiErrorMessage } from "../../../shared/api/response.js";
import { createReportApi } from "../api/reportsApi.js";

export default function useReport() {
  const [submitting, setSubmitting] = useState(false);
  const submitReport = async (report) => {
    setSubmitting(true);
    try {
      const response = await createReportApi(report);
      if (!response.success) throw new Error(response.message);
      showSuccessToast(response.message || "Report submitted for review.");
      return true;
    } catch (error) {
      showErrorToast(
        getApiErrorMessage(error, "The report could not be submitted."),
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  };
  return { submitting, submitReport };
}
