import httpClient from "../../../shared/api/httpClient.js";

export const loginApi = async (data) => {
  const response = await httpClient.post("/auth/login", data);
  return response.data;
};

export const registerApi = async (data) => {
  const response = await httpClient.post("/auth/register", data);
  return response.data;
};
export const logoutApi = async (data) => {
  const response = await httpClient.post("/auth/logout", data);
  return response.data;
};

export const getUserProfileApi = async (config = {}) => {
  const response = await httpClient.get("/profile", config);
  return response.data;
};

export const updateUserProfileApi = async (data) => {
  const response = await httpClient.put("/profile/career", data);
  return response.data;
};
