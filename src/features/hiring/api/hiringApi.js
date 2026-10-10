import httpClient from "../../../shared/api/httpClient.js";

export const createHiringPostApi = async (data) => {
  const response = await httpClient.post("/hiring-posts", data);
  return response.data;
};

export const getOpenHiringPostsApi = async (config = {}) => {
  const response = await httpClient.get("/hiring-posts/open", config);
  return response.data;
};

export const joinHiringPostApi = async (postId, data) => {
  const response = await httpClient.post(`/hiring-posts/${postId}/join`, data);
  return response.data;
};

export const closeHiringPostApi = async (postId) => {
  const response = await httpClient.put(`/hiring-posts/${postId}/close`);
  return response.data;
};
