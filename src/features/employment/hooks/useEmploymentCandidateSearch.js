import { useEffect, useState } from "react";
import { requireData } from "../../../shared/api/response.js";
import { showApiErrorToast } from "../../../shared/notifications/toast.jsx";
import { searchEmploymentCandidatesApi } from "../api/employmentApi.js";

const SEARCH_DELAY_MS = 180;

export default function useEmploymentCandidateSearch() {
  const [searchInput, setSearchInput] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const query = searchInput.trim();
    const timer = window.setTimeout(
      async () => {
        setSearching(true);
        try {
          const firstResponse = await searchEmploymentCandidatesApi(query, {
            signal: controller.signal,
          });
          const firstPage = requireData(firstResponse);
          const remainingPages = await Promise.all(
            Array.from(
              { length: Math.max((firstPage?.totalPages || 1) - 1, 0) },
              (_, index) => index + 1,
            ).map((page) =>
              searchEmploymentCandidatesApi(query, {
                page,
                signal: controller.signal,
              }).then(requireData),
            ),
          );
          if (!controller.signal.aborted) {
            setCandidates([
              ...(firstPage?.content || []),
              ...remainingPages.flatMap((page) => page?.content || []),
            ]);
          }
        } catch (error) {
          if (!controller.signal.aborted) {
            showApiErrorToast(error, "Candidates could not be searched.");
          }
        } finally {
          if (!controller.signal.aborted) {
            setLoading(false);
            setSearching(false);
          }
        }
      },
      query ? SEARCH_DELAY_MS : 0,
    );

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [searchInput]);

  return {
    candidates,
    loading,
    searching,
    searchInput,
    setSearchInput,
    clearSearch: () => setSearchInput(""),
  };
}
