import { useCallback, useEffect, useState } from "react";
import { requireData } from "../../../shared/api/response.js";
import { showApiErrorToast } from "../../../shared/notifications/toast.jsx";
import { getFollowedSalonsApi } from "../api/communitySalonFollowsApi.js";
import {
  getFriendRequestsApi,
  getFriendsApi,
} from "../api/communityRelationshipsApi.js";
import useCommunityPeopleSearch from "./useCommunityPeopleSearch.js";
import useCommunityRelationshipActions from "./useCommunityRelationshipActions.js";

function readList(result) {
  if (result.status !== "fulfilled") return [];
  try {
    const data = requireData(result.value);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default function useCommunityNetwork() {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [followedSalons, setFollowedSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const peopleSearch = useCommunityPeopleSearch();
  const { refresh: refreshPeople } = peopleSearch;

  const refreshSummary = useCallback(async (config = {}) => {
    const responses = await Promise.allSettled([
      getFriendsApi(config),
      getFriendRequestsApi(config),
      getFollowedSalonsApi(config),
    ]);
    setFriends(readList(responses[0]));
    setRequests(readList(responses[1]));
    setFollowedSalons(readList(responses[2]));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    Promise.resolve()
      .then(() => refreshSummary({ signal: controller.signal }))
      .catch((error) => {
        if (!controller.signal.aborted) {
          showApiErrorToast(error, "Community connections could not be loaded.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [refreshSummary]);

  const refreshNetwork = useCallback(
    () => Promise.all([refreshSummary(), refreshPeople()]),
    [refreshPeople, refreshSummary],
  );
  const relationships = useCommunityRelationshipActions({
    afterSuccess: refreshNetwork,
  });

  return {
    people: peopleSearch.people,
    peopleLoading: peopleSearch.loading,
    peopleError: peopleSearch.error,
    searchPeople: peopleSearch.search,
    retryPeopleSearch: peopleSearch.retry,
    friends,
    requests,
    followedSalons,
    loading,
    busyAction: relationships.busyAction,
    connect: relationships.connect,
    accept: relationships.accept,
    decline: relationships.decline,
  };
}
