import { useCallback, useEffect, useState } from "react";
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

export default function useCommunityNetwork() {
  const [people, setPeople] = useState([]);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [followedSalons, setFollowedSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { busyAction, runAction } = useCommunityAction();

  const applyNetworkResponses = useCallback((responses) => {
    const [peopleResponse, friendsResponse, requestsResponse, salonsResponse] =
      responses;
    setPeople(requireData(peopleResponse) || []);
    setFriends(requireData(friendsResponse) || []);
    setRequests(requireData(requestsResponse) || []);
    setFollowedSalons(requireData(salonsResponse) || []);
  }, []);

  const fetchNetwork = useCallback(
    (config = {}) =>
      Promise.all([
        searchCommunityPeopleApi("", config),
        getFriendsApi(config),
        getFriendRequestsApi(config),
        getFollowedSalonsApi(config),
      ]),
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    async function loadNetwork() {
      try {
        const responses = await fetchNetwork({ signal: controller.signal });
        if (!controller.signal.aborted) applyNetworkResponses(responses);
      } catch (error) {
        if (!controller.signal.aborted)
          showApiErrorToast(
            error,
            "Community connections could not be loaded.",
          );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadNetwork();
    return () => controller.abort();
  }, [applyNetworkResponses, fetchNetwork]);

  const refreshNetwork = useCallback(async () => {
    applyNetworkResponses(await fetchNetwork());
  }, [applyNetworkResponses, fetchNetwork]);

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

  const searchPeople = useCallback(
    async (search) => {
      const response = await runAction({
        key: "people-search",
        action: () => searchCommunityPeopleApi(search),
        errorMessage: "Community members could not be searched.",
      });
      if (response?.success) setPeople(requireData(response) || []);
    },
    [runAction],
  );

  return {
    people,
    friends,
    requests,
    followedSalons,
    loading,
    busyAction,
    connect,
    accept,
    decline,
    searchPeople,
  };
}
