import { getStatusClass } from "../model/booking.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { useCallback, useState } from "react";
import useCashPayment from "../../payments/hooks/useCashPayment.js";

import { getMyEmployeeBookingsApi } from "../api/bookingApi.js";
import { showErrorToast } from "../../../shared/notifications/toast.jsx";

export default function useEmployeeBookings() {
  const loader = useCallback(
    async (signal) =>
      requireData(await getMyEmployeeBookingsApi({ signal })) || [],
    [],
  );
  const {
    data: bookings,
    loading,
    refetch,
  } = useQuery(loader, {
    initialData: [],
    onError: showErrorToast,
    keepPreviousData: true,
  });

  const cash = useCashPayment({ onRecorded: refetch });
  const [receiptBookingId, setReceiptBookingId] = useState(null);
  const closeReceipt = useCallback(() => setReceiptBookingId(null), []);

  return {
    bookings,
    loading,
    refetch,
    getStatusClass,
    cash,
    receiptBookingId,
    openReceipt: (booking) => setReceiptBookingId(booking.id),
    closeReceipt,
  };
}
