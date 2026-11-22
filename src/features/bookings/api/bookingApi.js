import httpClient from "../../../shared/api/httpClient.js";

export const getBookingAvailabilityApi = async (
  availabilityData,
  config = {},
) => {
  const response = await httpClient.post(
    "/bookings/availability",
    availabilityData,
    { ...config, showLoading: false },
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

/** The customer says they will come to a confirmed appointment. */
export const confirmAttendanceApi = async (bookingId) => {
  const response = await httpClient.put(
    `/bookings/${bookingId}/confirm-attendance`,
  );
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

export const getAssignableEmployeesApi = async (bookingId, config = {}) => {
  const response = await httpClient.get(
    `/bookings/${bookingId}/assignable-employees`,
    { ...config, showLoading: false },
  );
  return response.data;
};

// ---------- live tracking ----------

const trackingPath = (bookingId) => `/bookings/${bookingId}/tracking`;
const quiet = { showLoading: false };

export const getBookingTrackingApi = async (bookingId, config = {}) => {
  const response = await httpClient.get(trackingPath(bookingId), {
    ...config,
    ...quiet,
  });
  return response.data;
};

export const startJourneyApi = async (bookingId, position = null) => {
  const response = await httpClient.post(
    `${trackingPath(bookingId)}/journey/start`,
    position,
    quiet,
  );
  return response.data;
};

export const updateJourneyPositionApi = async (bookingId, position) => {
  const response = await httpClient.put(
    `${trackingPath(bookingId)}/journey/position`,
    position,
    quiet,
  );
  return response.data;
};

export const markArrivedApi = async (bookingId) => {
  const response = await httpClient.post(
    `${trackingPath(bookingId)}/journey/arrived`,
    null,
    quiet,
  );
  return response.data;
};

export const stopJourneyApi = async (bookingId) => {
  const response = await httpClient.post(
    `${trackingPath(bookingId)}/journey/stop`,
    null,
    quiet,
  );
  return response.data;
};

export const startServiceApi = async (bookingId) => {
  const response = await httpClient.post(
    `${trackingPath(bookingId)}/service/start`,
    null,
    quiet,
  );
  return response.data;
};

export const extendServiceApi = async (bookingId, minutes) => {
  const response = await httpClient.post(
    `${trackingPath(bookingId)}/service/extend`,
    { minutes },
    quiet,
  );
  return response.data;
};

export const completeServiceApi = async (bookingId) => {
  const response = await httpClient.post(
    `${trackingPath(bookingId)}/service/complete`,
    null,
    quiet,
  );
  return response.data;
};

export const markNoShowApi = async (bookingId) => {
  const response = await httpClient.post(
    `${trackingPath(bookingId)}/no-show`,
    null,
    quiet,
  );
  return response.data;
};

// ---------- leave on time ----------

const departurePath = (bookingId) => `/bookings/${bookingId}/departure-plan`;

export const getDeparturePlanApi = async (bookingId, config = {}) => {
  const response = await httpClient.get(departurePath(bookingId), {
    ...config,
    ...quiet,
  });
  return response.data;
};

/** Saves where the customer leaves from and turns the leave alerts on. */
export const setDepartureOriginApi = async (bookingId, origin) => {
  const response = await httpClient.put(
    `${departurePath(bookingId)}/origin`,
    origin,
    quiet,
  );
  return response.data;
};

/** Forgets the saved place and turns the leave alerts off. */
export const clearDepartureOriginApi = async (bookingId) => {
  const response = await httpClient.delete(
    `${departurePath(bookingId)}/origin`,
    quiet,
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
    { ...config, showLoading: false },
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
