import { useCallback, useState } from "react";
import { exportOwnerBookingsApi } from "../api/dashboardApi.js";
import { rangeRequest } from "../model/dashboardModel.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";

/** Saves a Blob as a file through a temporary link. */
function saveFile(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  // Give the browser time to start the download before the URL goes.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Downloads the bookings of a dashboard range as a CSV file. */
export default function useExportBookings() {
  const [busy, setBusy] = useState(false);

  const exportBookings = useCallback(async (range) => {
    const { from, to } = rangeRequest(range).bookings;
    setBusy(true);
    try {
      const blob = await exportOwnerBookingsApi({ from, to });
      saveFile(blob, `salonhub-bookings-${from}-to-${to}.csv`);
      showSuccessToast("Your CSV file is downloading.", "Export ready");
    } catch (error) {
      showErrorToast(error.message || "The bookings could not be exported.");
    } finally {
      setBusy(false);
    }
  }, []);

  return { exportBookings, busy };
}
