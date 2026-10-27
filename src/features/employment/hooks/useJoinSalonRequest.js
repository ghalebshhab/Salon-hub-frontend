import { useState } from "react";
import {
  showApiErrorToast,
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";
import { requestToJoinSalonApi } from "../api/employmentApi.js";

export default function useJoinSalonRequest() {
  const [joining, setJoining] = useState(false);

  const requestJoin = async (salonId) => {
    try {
      setJoining(true);
      const response = await requestToJoinSalonApi(salonId);
      if (!response.success) {
        showErrorToast(response.message || "The join request could not be sent.");
        return false;
      }
      showSuccessToast(response.message || "Join request sent to the salon owner.");
      return true;
    } catch (error) {
      showApiErrorToast(error, "The join request could not be sent.");
      return false;
    } finally {
      setJoining(false);
    }
  };

  return { joining, requestJoin };
}
