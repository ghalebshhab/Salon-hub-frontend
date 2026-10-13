import httpClient from "../../../shared/api/httpClient.js";

export const getMySalonEmployeesApi = async (config = {}) => {
  const response = await httpClient.get("/salon-employees/my-salon", config);
  return response.data;
};

export const getSalonEmployeesApi = async (salonId, config = {}) => {
  const response = await httpClient.get(
    `/salon-employees/salon/${salonId}`,
    config,
  );
  return response.data;
};

export const getEmployeeServicesApi = async (employeeId, config = {}) => {
  const response = await httpClient.get(
    `/salon-employees/${employeeId}/services`,
    config,
  );
  return response.data;
};

export const updateEmployeeServicesApi = async (employeeId, serviceIds) => {
  const response = await httpClient.put(
    `/salon-employees/${employeeId}/services`,
    { serviceIds },
  );
  return response.data;
};

export const getEmployeeScheduleApi = async (employeeId, config = {}) => {
  const response = await httpClient.get(
    `/salon-employees/${employeeId}/schedule`,
    config,
  );
  return response.data;
};

export const updateEmployeeScheduleApi = async (employeeId, periods) => {
  const response = await httpClient.put(
    `/salon-employees/${employeeId}/schedule`,
    { periods },
  );
  return response.data;
};
