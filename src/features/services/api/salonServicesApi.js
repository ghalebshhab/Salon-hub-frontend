import httpClient from "../../../shared/api/httpClient.js";

export const createSalonServiceApi = async (serviceData) => {
  const response = await httpClient.post("/salon-services", serviceData);
  return response.data;
};

export const getActiveSalonServicesApi = async (salonId, config = {}) => {
  const response = await httpClient.get(
    `/salon-services/salon/${salonId}`,
    config,
  );
  return response.data;
};

export const getMySalonServicesApi = async (config = {}) => {
  const response = await httpClient.get("/salon-services/my-salon", config);
  return response.data;
};

export const updateSalonServiceApi = async (serviceId, serviceData) => {
  const response = await httpClient.put(
    `/salon-services/${serviceId}`,
    serviceData,
  );
  return response.data;
};

export const deleteSalonServiceApi = async (serviceId) => {
  const response = await httpClient.delete(`/salon-services/${serviceId}`);
  return response.data;
};
