import httpClient from "../../../shared/api/httpClient.js";

const payload = (response) => response.data;

export async function getFollowedSalonsApi(config = {}) {
  return payload(await httpClient.get("/community/salons/following", config));
}

export async function setSalonFollowApi(salonId, followed) {
  const path = `/community/salons/${salonId}/follow`;
  return payload(
    followed ? await httpClient.put(path) : await httpClient.delete(path),
  );
}
