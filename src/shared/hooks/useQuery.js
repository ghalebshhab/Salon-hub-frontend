import { useCallback, useEffect, useState } from "react";

// The loader owns data access; this hook owns request lifecycle and stale-result protection.
export default function useQuery(
  loader,
  { initialData = null, onError, errorMessage = "Unable to load data" } = {},
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
        onError?.(
          error?.response?.data?.message || error?.message || errorMessage,
        );
      }
    }
    run();
    return () => controller.abort();
  }, [loader, revision, onError, errorMessage]);

  const current = result?.loader === loader && result?.revision === revision;
  return {
    data: current ? (result.data ?? initialData) : initialData,
    error: current ? result.error : null,
    loading: !current,
    refetch,
  };
}
