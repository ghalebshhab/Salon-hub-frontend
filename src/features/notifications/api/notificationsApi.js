import httpClient from "../../../shared/api/httpClient.js";

export async function getNotificationsApi(
  { page = 0, size = 20 } = {},
  config = {},
) {
  const response = await httpClient.get("/notifications", {
    ...config,
    params: { page, size },
  });
  return response.data;
}

export async function getUnreadNotificationCountApi(config = {}) {
  const response = await httpClient.get("/notifications/unread-count", config);
  return response.data;
}

export async function markNotificationReadApi(notificationId) {
  const response = await httpClient.put(
    `/notifications/${notificationId}/read`,
  );
  return response.data;
}

export async function markAllNotificationsReadApi() {
  const response = await httpClient.put("/notifications/read-all");
  return response.data;
}
