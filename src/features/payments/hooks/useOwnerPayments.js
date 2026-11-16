import { useCallback, useMemo, useState } from "react";
import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { showErrorToast } from "../../../shared/notifications/toast.jsx";
import { getMySalonApi } from "../../salons/api/salonApi.js";
import {
  getOwnerOutstandingPaymentsApi,
  getOwnerPaymentSummaryApi,
} from "../api/paymentApi.js";
import { periodRange } from "../model/payment.js";
import useCashPayment from "./useCashPayment.js";

export const OUTSTANDING_PAGE_SIZE = 10;

/**
 * Owner money page: KPIs for a period, finished appointments that are still
 * unpaid (paged), and the "cash received" action for them.
 */
export default function useOwnerPayments() {
  const [period, setPeriod] = useState("month");
  const [page, setPage] = useState(0);
  const range = useMemo(() => periodRange(period), [period]);

  const salonLoader = useCallback(
    async (signal) => requireData(await getMySalonApi({ signal })),
    [],
  );
  const salonQuery = useQuery(salonLoader, { initialData: null });

  const summaryLoader = useCallback(
    async (signal) =>
      requireData(await getOwnerPaymentSummaryApi(range, { signal })),
    [range],
  );
  const summaryQuery = useQuery(summaryLoader, {
    initialData: null,
    keepPreviousData: true,
    onError: showErrorToast,
  });

  const outstandingLoader = useCallback(
    async (signal) =>
      requireData(
        await getOwnerOutstandingPaymentsApi(
          { page, size: OUTSTANDING_PAGE_SIZE },
          { signal },
        ),
      ) || [],
    [page],
  );
  const outstandingQuery = useQuery(outstandingLoader, {
    initialData: [],
    keepPreviousData: true,
    onError: showErrorToast,
  });

  const refetchSummary = summaryQuery.refetch;
  const refetchOutstanding = outstandingQuery.refetch;
  const cash = useCashPayment({
    onRecorded: () => {
      refetchSummary();
      refetchOutstanding();
    },
  });

  return {
    salon: salonQuery.data,
    salonError: salonQuery.error,
    period,
    setPeriod,
    range,
    summary: summaryQuery.data,
    summaryLoading: summaryQuery.loading,
    summaryRefreshing: summaryQuery.refreshing,
    summaryError: summaryQuery.error,
    outstanding: outstandingQuery.data,
    outstandingLoading: outstandingQuery.loading,
    page,
    setPage,
    hasNextPage: outstandingQuery.data.length === OUTSTANDING_PAGE_SIZE,
    cash,
    refresh: () => {
      refetchSummary();
      refetchOutstanding();
    },
  };
}
