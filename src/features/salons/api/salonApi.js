import httpClient from "../../../shared/api/httpClient.js";

export const createSalonApi = async (data) => {
  const response = await httpClient.post("/salons/createSalon", data);
  return response.data;
};

export const getSalonByIdApi = async (salonId, config = {}) => {
  const response = await httpClient.get(`/salons/${salonId}`, config);
  return response.data;
};

export const getMySalonApi = async (config = {}) => {
  const response = await httpClient.get("/salons/my-salon", config);
  return response.data;
};

export const updateSalonApi = async (salonId, data) => {
  const response = await httpClient.put(`/salons/updateSalon/${salonId}`, data);
  return response.data;
};

export const deleteSalonApi = async () => {
  const response = await httpClient.delete("/salons/deleteSalon");
  return response.data;
};

export const getSalonEmployeesApi = async (salonId, config = {}) => {
  const response = await httpClient.get(`/salons/${salonId}/employees`, config);
  return response.data;
};
export const getAllSalonsApi = async (config = {}) => {
  const response = await httpClient.get("/salons", config);
  return response.data;
};
export const deleteMySalonApi = async () => {
  const response = await httpClient.delete("/salons/deleteSalon");
  return response.data;
};
