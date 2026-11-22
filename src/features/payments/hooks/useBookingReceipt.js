import { useCallback } from "react";
import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { getBookingPaymentApi } from "../api/paymentApi.js";
import t from "../../../shared/i18n/t.js";

/** Receipt of one booking; loads only while `bookingId` is set. */
export default function useBookingReceipt(bookingId) {
  const loader = useCallback(
    async (signal) =>
      bookingId
        ? requireData(
            await getBookingPaymentApi(bookingId, { signal }),
            t("Could not load the receipt"),
          )
        : null,
    [bookingId],
  );
  const { data, loading, error, refetch } = useQuery(loader, {
    initialData: null,
  });
  return {
    receipt: data,
    loading: Boolean(bookingId) && loading,
    error: error
      ? error?.response?.data?.message ||
        error?.message ||
        t("Could not load the receipt")
      : "",
    refetch,
  };
}
