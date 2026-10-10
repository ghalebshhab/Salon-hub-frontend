import { getStatusClass } from "../model/booking.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { useCallback } from "react";

import { getMyEmployeeBookingsApi } from "../api/bookingApi.js";
import { showErrorToast } from "../../../shared/notifications/toast.jsx";

export default function useEmployeeBookings() {
  const loader = useCallback(
    async (signal) =>
      requireData(await getMyEmployeeBookingsApi({ signal })) || [],
    [],
  );
  const { data: bookings, loading } = useQuery(loader, {
    initialData: [],
    onError: showErrorToast,
  });

  return { bookings, loading, getStatusClass };
}
