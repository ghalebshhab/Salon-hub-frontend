import httpClient from "../../../shared/api/httpClient.js";

export const getMySalonEmployeesApi = async (config = {}) => {
  const response = await httpClient.get("/salon-employees/my-salon", config);
  return response.data;
};

export const getSalonEmployeesApi = async (salonId, config = {}) => {
  const response = await httpClient.get(`/salon-employees/salon/${salonId}`, {
    ...config,
    skipAuth: true,
  });
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

export const getEmployeeTimeOffApi = async (employeeId, config = {}) => {
  const response = await httpClient.get(
    `/salon-employees/${employeeId}/time-off`,
    config,
  );
  return response.data;
};

export const addEmployeeTimeOffApi = async (employeeId, timeOff) => {
  const response = await httpClient.post(
    `/salon-employees/${employeeId}/time-off`,
    timeOff,
  );
  return response.data;
};

export const removeEmployeeTimeOffApi = async (timeOffId) => {
  const response = await httpClient.delete(
    `/salon-employees/time-off/${timeOffId}`,
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

/** Owner only: give (true) or remove (false) the salon manager role. */
export const setSalonManagerApi = async (employeeId, manager) => {
  const response = await httpClient.put(
    `/salon-employees/${employeeId}/manager`,
    { manager },
    { loadingMessage: manager ? "Adding a manager…" : "Removing the manager…" },
  );
  return response.data;
};
