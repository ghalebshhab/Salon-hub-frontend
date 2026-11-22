import { useState } from "react";
import {
  showApiErrorToast,
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";
import { requestToJoinSalonApi } from "../api/employmentApi.js";
import t from "../../../shared/i18n/t.js";

export default function useJoinSalonRequest() {
  const [joining, setJoining] = useState(false);

  const requestJoin = async (salonId) => {
    try {
      setJoining(true);
      const response = await requestToJoinSalonApi(salonId);
      if (!response.success) {
        showErrorToast(
          response.message || t("The join request could not be sent."),
        );
        return false;
      }
      showSuccessToast(
        response.message || t("Join request sent to the salon owner."),
      );
      return true;
    } catch (error) {
      showApiErrorToast(error, t("The join request could not be sent."));
      return false;
    } finally {
      setJoining(false);
    }
  };

  return { joining, requestJoin };
}
