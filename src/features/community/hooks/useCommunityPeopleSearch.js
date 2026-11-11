import { useCallback, useEffect, useRef, useState } from "react";
import { requireData } from "../../../shared/api/response.js";
import { showApiErrorToast } from "../../../shared/notifications/toast.jsx";
import { searchCommunityPeopleApi } from "../api/communityRelationshipsApi.js";
import { normalizeCommunitySearch } from "../model/communityPresentation.js";

export default function useCommunityPeopleSearch() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const controllerRef = useRef(null);
  const sequenceRef = useRef(0);
  const latestQueryRef = useRef("");
  const completedQueryRef = useRef(null);

  const search = useCallback(async (value = "", { retry = false } = {}) => {
    const query = normalizeCommunitySearch(value);
    const activeController = controllerRef.current;
    const sameRequestIsActive =
      activeController &&
      !activeController.signal.aborted &&
      query === latestQueryRef.current;
    const sameSearchIsComplete =
      !activeController && completedQueryRef.current === query;
    if (!retry && (sameRequestIsActive || sameSearchIsComplete)) return;

    activeController?.abort();
    const controller = new AbortController();
    const sequence = ++sequenceRef.current;
    controllerRef.current = controller;
    latestQueryRef.current = query;
    setLoading(true);
    setError(false);

    try {
      const response = await searchCommunityPeopleApi(query, {
        signal: controller.signal,
      });
      if (sequence !== sequenceRef.current || controller.signal.aborted) return;
      setPeople(requireData(response) || []);
      completedQueryRef.current = query;
    } catch (requestError) {
      if (controller.signal.aborted || sequence !== sequenceRef.current) return;
      completedQueryRef.current = null;
      setError(true);
      if (retry) {
        showApiErrorToast(requestError, "Community suggestions could not be loaded.");
      }
    } finally {
      if (sequence === sequenceRef.current && !controller.signal.aborted) {
        controllerRef.current = null;
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => search("", { retry: true }));
    return () => controllerRef.current?.abort();
  }, [search]);

  const retry = useCallback(
    () => search(latestQueryRef.current, { retry: true }),
    [search],
  );

  return { people, loading, error, search, retry, refresh: retry };
}
