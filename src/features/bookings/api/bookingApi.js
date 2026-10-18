import httpClient from "../../../shared/api/httpClient.js";

export const getBookingAvailabilityApi = async (
  availabilityData,
  config = {},
) => {
  const response = await httpClient.post(
    "/bookings/availability",
    availabilityData,
    config,
  );
  return response.data;
};

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

export const assignEmployeeToBookingApi = async (
  bookingId,
  employeeId,
  assignmentData = {},
) => {
  const response = await httpClient.put(
    `/bookings/${bookingId}/assign-employee/${employeeId}`,
    assignmentData,
  );
  return response.data;
};

export const getBookingRescheduleAvailabilityApi = async (
  bookingId,
  bookingDate,
  config = {},
) => {
  const response = await httpClient.post(
    `/bookings/${bookingId}/reschedule-availability`,
    { bookingDate },
    config,
  );
  return response.data;
};

export const proposeBookingRescheduleApi = async (bookingId, proposal) => {
  const response = await httpClient.post(
    `/bookings/${bookingId}/reschedule-proposals`,
    proposal,
  );
  return response.data;
};

export const acceptBookingRescheduleApi = async (bookingId, proposalId) => {
  const response = await httpClient.put(
    `/bookings/${bookingId}/reschedule-proposals/${proposalId}/accept`,
  );
  return response.data;
};

export const rejectBookingRescheduleApi = async (bookingId, proposalId) => {
  const response = await httpClient.put(
    `/bookings/${bookingId}/reschedule-proposals/${proposalId}/reject`,
  );
  return response.data;
};
