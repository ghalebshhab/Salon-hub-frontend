import httpClient from "../../../shared/api/httpClient.js";
import { fromSalonResponse } from "../model/salonForm.js";

const mapSalonResponse = (response) => ({
  ...response,
  data: {
    ...response.data,
    data: Array.isArray(response.data.data)
      ? response.data.data.map(fromSalonResponse)
      : fromSalonResponse(response.data.data),
  },
});

export const createSalonApi = async (data) => {
  const response = await httpClient.post("/salons/create", data);
  return mapSalonResponse(response).data;
};

export const getSalonByIdApi = async (salonId, config = {}) => {
  const response = await httpClient.get(`/salons/${salonId}`, config);
  return mapSalonResponse(response).data;
};

export const getMySalonApi = async (config = {}) => {
  const response = await httpClient.get("/salons/mine", config);
  return mapSalonResponse(response).data;
};

export const updateSalonApi = async (salonId, data) => {
  const response = await httpClient.put(`/salons/${salonId}/edit`, data);
  return mapSalonResponse(response).data;
};

export const resubmitSalonApi = async (salonId) => {
  const response = await httpClient.post(`/salons/${salonId}/resubmit`);
  return mapSalonResponse(response).data;
};

export const deleteSalonApi = async (salonId) => {
  const response = await httpClient.delete(`/salons/${salonId}`);
  return response.data;
};

export const getAllSalonsApi = async (config = {}) => {
  const response = await httpClient.get("/salons/active", config);
  return mapSalonResponse(response).data;
};
export const deleteMySalonApi = deleteSalonApi;
