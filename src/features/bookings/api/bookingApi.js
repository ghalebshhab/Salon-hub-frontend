import httpClient from "../../../shared/api/httpClient.js";

export const createBookingApi = async (bookingData) => {
  const response = await httpClient.post("/bookings", bookingData);
  return response.data;
};

export const getMyBookingsApi = async (config = {}) => {
  const response = await httpClient.get("/bookings/my", config);
  return response.data;
};

export const getMySalonBookingsApi = async (config = {}) => {
  const response = await httpClient.get("/bookings/my-salon", config);
  return response.data;
};

export const getMySalonPendingBookingsApi = async (config = {}) => {
  const response = await httpClient.get("/bookings/my-salon/pending", config);
  return response.data;
};

export const acceptBookingApi = async (bookingId, actionData = {}) => {
  const response = await httpClient.put(
    `/bookings/${bookingId}/accept`,
    actionData,
  );
  return response.data;
};

export const rejectBookingApi = async (bookingId, actionData = {}) => {
  const response = await httpClient.put(
    `/bookings/${bookingId}/reject`,
    actionData,
  );
  return response.data;
};

export const cancelMyBookingApi = async (bookingId) => {
  const response = await httpClient.put(`/bookings/${bookingId}/cancel`);
  return response.data;
};

export const completeBookingApi = async (bookingId) => {
  const response = await httpClient.put(`/bookings/${bookingId}/complete`);
  return response.data;
};
export const getMyEmployeeBookingsApi = async (config = {}) => {
  const response = await httpClient.get("/bookings/employee/my", config);
  return response.data;
};

export const assignEmployeeToBookingApi = async (bookingId, employeeId) => {
  const response = await httpClient.put(
    `/bookings/${bookingId}/assign-employee/${employeeId}`,
  );
  return response.data;
};
