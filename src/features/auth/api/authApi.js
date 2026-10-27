import httpClient from "../../../shared/api/httpClient.js";

export const loginApi = async (data) => {
  const response = await httpClient.post("/auth/login", data);
  return response.data;
};

export const registerApi = async (data) => {
  const response = await httpClient.post("/auth/register", data);
  return response.data;
};

export const verifyEmailApi = async (data) => {
  const response = await httpClient.post("/auth/email/verify", data);
  return response.data;
};

export const resendEmailVerificationApi = async (data) => {
  const response = await httpClient.post("/auth/email/resend", data);
  return response.data;
};

export const forgotPasswordApi = async (data) => {
  const response = await httpClient.post("/auth/password/forgot", data);
  return response.data;
};

export const verifyPasswordResetCodeApi = async (data) => {
  const response = await httpClient.post("/auth/password/verify-code", data);
  return response.data;
};

export const resetPasswordApi = async (data) => {
  const response = await httpClient.post("/auth/password/reset", data);
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
