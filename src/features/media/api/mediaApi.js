import httpClient from "../../../shared/api/httpClient.js";

export const createMediaPostApi = async (data) => {
  const response = await httpClient.post("/salon-media", data);
  return response.data;
};

export const getSalonMediaApi = async (salonId, config = {}) => {
  const response = await httpClient.get(
    `/salon-media/salon/${salonId}`,
    config,
  );
  return response.data;
};

export const getSalonVideosApi = async (salonId, config = {}) => {
  const response = await httpClient.get(
    `/salon-media/salon/${salonId}/videos`,
    config,
  );
  return response.data;
};

export const deleteMediaPostApi = async (mediaPostId) => {
  const response = await httpClient.delete(`/salon-media/${mediaPostId}`);
  return response.data;
};
