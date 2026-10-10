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

export const addEmployeeToMySalonApi = async (employeeData) => {
  const response = await httpClient.post("/salon-employees", employeeData);
  return response.data;
};

export const resendEmployeeInvitationApi = async (employeeId) => {
  const response = await httpClient.post(
    `/salon-employees/${employeeId}/resend-invitation`,
  );
  return response.data;
};

export const removeEmployeeApi = async (employeeId) => {
  const response = await httpClient.delete(`/salon-employees/${employeeId}`);
  return response.data;
};

export const processApplicationApi = async (applicationId, accept) => {
  const response = await httpClient.put(
    `/salon-employees/applications/${applicationId}/process?accept=${accept}`,
  );
  return response.data;
};
