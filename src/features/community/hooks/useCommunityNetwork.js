import { useCallback, useEffect, useRef, useState } from "react";
import { requireData } from "../../../shared/api/response.js";
import { showApiErrorToast } from "../../../shared/notifications/toast.jsx";
import { getFollowedSalonsApi } from "../api/communitySalonFollowsApi.js";
import {
  acceptFriendRequestApi,
  declineFriendRequestApi,
  getFriendRequestsApi,
  getFriendsApi,
  searchCommunityPeopleApi,
  sendFriendRequestApi,
} from "../api/communityRelationshipsApi.js";
import useCommunityAction from "./useCommunityAction.js";

function readList(result) {
  if (result.status !== "fulfilled") {
    return { ok: false, data: [], error: result.reason };
  }
  try {
    const data = requireData(result.value);
    return { ok: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    return { ok: false, data: [], error };
  }
}

export default function useCommunityNetwork() {
  const [people, setPeople] = useState([]);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [followedSalons, setFollowedSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [peopleLoading, setPeopleLoading] = useState(true);
  const [peopleError, setPeopleError] = useState(false);
  const searchControllerRef = useRef(null);
  const searchSequenceRef = useRef(0);
  const latestQueryRef = useRef(null);
  const completedQueryRef = useRef(null);
  const { busyAction, runAction } = useCommunityAction();

  const fetchNetwork = useCallback(
    (query = "", config = {}) =>
      Promise.allSettled([
        searchCommunityPeopleApi(query, config),
        getFriendsApi(config),
        getFriendRequestsApi(config),
        getFollowedSalonsApi(config),
      ]),
    [],
  );

  const applyNetworkResponses = useCallback((responses) => {
    const [peopleResult, friendsResult, requestsResult, salonsResult] =
      responses.map(readList);
    setPeople(peopleResult.data);
    setFriends(friendsResult.data);
    setRequests(requestsResult.data);
    setFollowedSalons(salonsResult.data);
    setPeopleError(!peopleResult.ok);
    return peopleResult;
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function loadNetwork() {
      const responses = await fetchNetwork("", { signal: controller.signal });
      if (controller.signal.aborted) return;
      const peopleResult = applyNetworkResponses(responses);
      latestQueryRef.current = "";
      completedQueryRef.current = peopleResult.ok ? "" : null;
      setPeopleLoading(false);
      if (!peopleResult.ok) {
        showApiErrorToast(
          peopleResult.error,
          "Community suggestions could not be loaded.",
        );
      }
      setLoading(false);
    }
    loadNetwork().catch((error) => {
      if (controller.signal.aborted) return;
      setPeopleError(true);
      setPeopleLoading(false);
      setLoading(false);
      showApiErrorToast(error, "Community connections could not be loaded.");
    });
    return () => {
      controller.abort();
      searchControllerRef.current?.abort();
    };
  }, [applyNetworkResponses, fetchNetwork]);

  const refreshNetwork = useCallback(async () => {
    const query = latestQueryRef.current || "";
    const sequence = searchSequenceRef.current;
    const responses = await fetchNetwork(query);
    const [peopleResult, friendsResult, requestsResult, salonsResult] =
      responses.map(readList);
    setFriends(friendsResult.data);
    setRequests(requestsResult.data);
    setFollowedSalons(salonsResult.data);
    if (sequence === searchSequenceRef.current && query === latestQueryRef.current) {
      setPeople(peopleResult.data);
      setPeopleError(!peopleResult.ok);
      if (peopleResult.ok) completedQueryRef.current = query;
      else {
        completedQueryRef.current = null;
        showApiErrorToast(
          peopleResult.error,
          "Your people search could not be refreshed.",
        );
      }
    }
  }, [fetchNetwork]);

  const connect = useCallback(
    async (userId) => {
      const response = await runAction({
        key: `connect-${userId}`,
        action: () => sendFriendRequestApi(userId),
        successMessage: "Friend request sent.",
      });
      if (response?.success) await refreshNetwork();
    },
    [refreshNetwork, runAction],
  );

  const accept = useCallback(
    async (friendshipId) => {
      const response = await runAction({
        key: `accept-${friendshipId}`,
        action: () => acceptFriendRequestApi(friendshipId),
        successMessage: "You are now connected.",
      });
      if (response?.success) await refreshNetwork();
    },
    [refreshNetwork, runAction],
  );

  const decline = useCallback(
    async (friendshipId) => {
      const response = await runAction({
        key: `decline-${friendshipId}`,
        action: () => declineFriendRequestApi(friendshipId),
        successMessage: "Friend request declined.",
      });
      if (response?.success) await refreshNetwork();
    },
    [refreshNetwork, runAction],
  );

  const searchPeople = useCallback(async (search = "", { retry = false } = {}) => {
    const normalizedSearch = search.trim().replace(/\s+/g, " ").toLowerCase();
    const activeController = searchControllerRef.current;
    const hasSameSearchInFlight =
      activeController &&
      !activeController.signal.aborted &&
      normalizedSearch === latestQueryRef.current;
    const hasSameCompletedSearch =
      !activeController && completedQueryRef.current === normalizedSearch;
    if (!retry && (hasSameSearchInFlight || hasSameCompletedSearch)) return;

    activeController?.abort();
    const controller = new AbortController();
    searchControllerRef.current = controller;
    const sequence = ++searchSequenceRef.current;
    latestQueryRef.current = normalizedSearch;
    setPeopleLoading(true);
    setPeopleError(false);

    try {
      const response = await searchCommunityPeopleApi(normalizedSearch, {
        signal: controller.signal,
      });
      if (sequence !== searchSequenceRef.current || controller.signal.aborted) return;
      setPeople(requireData(response) || []);
      completedQueryRef.current = normalizedSearch;
    } catch {
      if (controller.signal.aborted || sequence !== searchSequenceRef.current) return;
      completedQueryRef.current = null;
      setPeopleError(true);
    } finally {
      if (sequence === searchSequenceRef.current && !controller.signal.aborted) {
        searchControllerRef.current = null;
        setPeopleLoading(false);
      }
    }
  }, []);

  const retryPeopleSearch = useCallback(() => {
    return searchPeople(latestQueryRef.current || "", { retry: true });
  }, [searchPeople]);

  return {
    people,
    friends,
    requests,
    followedSalons,
    loading,
    peopleLoading,
    peopleError,
    busyAction,
    connect,
    accept,
    decline,
    searchPeople,
    retryPeopleSearch,
  };
}
