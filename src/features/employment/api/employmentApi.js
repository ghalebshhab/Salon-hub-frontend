import httpClient from "../../../shared/api/httpClient.js";

const data = (response) => response.data;

export const getMyEmploymentRequestsApi = (config = {}) =>
  httpClient.get("/employment/me", { params: { page: 0, size: 100 }, ...config }).then(data);

export const getOwnedSalonEmploymentRequestsApi = (config = {}) =>
  httpClient
    .get("/employment/my-salon", { params: { page: 0, size: 100 }, ...config })
    .then(data);

export const getMyLeaveRequestsApi = (config = {}) =>
  httpClient
    .get("/employment/leave/me", { params: { page: 0, size: 100 }, ...config })
    .then(data);

export const getOwnedSalonLeaveRequestsApi = (config = {}) =>
  httpClient
    .get("/employment/leave/my-salon", {
      params: { page: 0, size: 100 },
      ...config,
    })
    .then(data);

export const searchEmploymentCandidatesApi = (search = "", config = {}) =>
  httpClient
    .get("/employment/candidates", {
      params: { search, page: 0, size: 50 },
      ...config,
    })
    .then(data);

export const requestToJoinSalonApi = (salonId) =>
  httpClient.post("/employment/join", { salonId }).then(data);

export const inviteEmploymentCandidateApi = (salonId, userId) =>
  httpClient.post(`/employment/invite/${salonId}`, { userId }).then(data);

export const acceptEmploymentRequestApi = (requestId) =>
  httpClient.post("/employment/accept", { requestId }).then(data);

export const rejectEmploymentRequestApi = (requestId, rejectionReason) =>
  httpClient
    .post("/employment/reject", { requestId, rejectionReason })
    .then(data);

export const cancelEmploymentRequestApi = (requestId) =>
  httpClient.post("/employment/cancel", { requestId }).then(data);

export const createLeaveRequestApi = (reason) =>
  httpClient.post("/employment/leave/request", { reason }).then(data);

export const acceptLeaveRequestApi = (requestId) =>
  httpClient.post(`/employment/leave/accept/${requestId}`).then(data);

export const cancelLeaveRequestApi = (requestId) =>
  httpClient.post(`/employment/leave/cancel/${requestId}`).then(data);
