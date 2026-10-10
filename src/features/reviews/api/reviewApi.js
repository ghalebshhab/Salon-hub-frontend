import httpClient from "../../../shared/api/httpClient.js";

export const createReviewApi = async (reviewData) => {
  const response = await httpClient.post("/reviews", reviewData);
  return response.data;
};

export const getSalonReviewsApi = async (salonId, config = {}) => {
  const response = await httpClient.get(`/reviews/salon/${salonId}`, config);
  return response.data;
};

export const getSalonReviewSummaryApi = async (salonId, config = {}) => {
  const response = await httpClient.get(
    `/reviews/salon/${salonId}/summary`,
    config,
  );
  return response.data;
};

export const getMyReviewsApi = async (config = {}) => {
  const response = await httpClient.get("/reviews/my", config);
  return response.data;
};

export const deleteMyReviewApi = async (reviewId) => {
  const response = await httpClient.delete(`/reviews/${reviewId}`);
  return response.data;
};
