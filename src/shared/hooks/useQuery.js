import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "../api/response.js";
import t from "../i18n/t.js";

// The loader owns data access; this hook owns request lifecycle and stale-result protection.
export default function useQuery(
  loader,
  {
    initialData = null,
    onError,
    errorMessage = t("Unable to load data"),
    // While a refetch runs, keep showing the last data instead of initialData.
    keepPreviousData = false,
  } = {},
) {
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState(null);
  const refetch = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    async function run() {
      try {
        const data = await loader(controller.signal);
        if (!controller.signal.aborted)
          setResult({ loader, revision, data, error: null });
      } catch (error) {
        if (controller.signal.aborted) return;
        setResult({ loader, revision, data: null, error });
        onError?.(getApiErrorMessage(error, errorMessage));
      }
    }
    run();
    return () => controller.abort();
  }, [loader, revision, onError, errorMessage]);

  const current = result?.loader === loader && result?.revision === revision;
  const previous = keepPreviousData && !current && result?.data != null;
  return {
    data: current
      ? (result.data ?? initialData)
      : previous
        ? result.data
        : initialData,
    error: current ? result.error : null,
    loading: !current && !previous,
    refreshing: !current && previous,
    refetch,
  };
}
