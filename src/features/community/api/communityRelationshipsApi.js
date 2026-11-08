import httpClient from "../../../shared/api/httpClient.js";

const payload = (response) => response.data;

export async function searchCommunityPeopleApi(search = "", config = {}) {
  return payload(
    await httpClient.get("/community/people", {
      ...config,
      params: { search, size: 12 },
    }),
  );
}

export async function getFriendsApi(config = {}) {
  return payload(await httpClient.get("/community/friends", config));
}

export async function getFriendRequestsApi(config = {}) {
  return payload(await httpClient.get("/community/friends/requests", config));
}

export async function sendFriendRequestApi(userId) {
  return payload(
    await httpClient.post(`/community/friends/requests/${userId}`),
  );
}

export async function acceptFriendRequestApi(friendshipId) {
  return payload(
    await httpClient.put(`/community/friends/requests/${friendshipId}/accept`),
  );
}

export async function declineFriendRequestApi(friendshipId) {
  return payload(
    await httpClient.delete(`/community/friends/requests/${friendshipId}`),
  );
}

export async function removeFriendshipApi(friendshipId) {
  return payload(await httpClient.delete(`/community/friends/${friendshipId}`));
}
