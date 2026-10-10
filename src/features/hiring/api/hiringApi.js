import httpClient from "../../../shared/api/httpClient.js";

export const createHiringPostApi = async (data) => {
  const response = await httpClient.post("/hiring-posts", data);
  return response.data;
};

export const getOpenHiringPostsApi = async (config = {}) => {
  const response = await httpClient.get("/hiring-posts", config);
  const page = response.data.data;
  return {
    ...response.data,
    data: (page?.content || []).map((item) => {
      const post = item.hiringPost || item;
      return {
        ...post,
        salonCity: post.salonLocation,
        neededEmployees: post.numOfPositions,
        matchLevel: item.matchLevel,
        matchScore: item.matchScore,
      };
    }),
    pagination: page
      ? {
          page: page.page,
          totalPages: page.totalPages,
          totalElements: page.totalElements,
        }
      : null,
  };
};

export const joinHiringPostApi = async (postId, data) => {
  const response = await httpClient.post(
    `/hiring-posts/${postId}/applications`,
    data,
  );
  return response.data;
};

export const closeHiringPostApi = async (postId) => {
  const response = await httpClient.post(`/hiring-posts/owner/${postId}/close`);
  return response.data;
};

export const getOwnerHiringPostsApi = async (config = {}) => {
  const response = await httpClient.get("/hiring-posts/owner", config);
  return response.data;
};

export const getHiringPostApplicationsApi = async (postId, config = {}) => {
  const response = await httpClient.get(
    `/hiring-posts/${postId}/applications`,
    config,
  );
  return response.data;
};

export const acceptHiringApplicationApi = async (applicationId) => {
  const response = await httpClient.post(
    `/hiring-posts/applications/${applicationId}/accept`,
  );
  return response.data;
};

export const rejectHiringApplicationApi = async (
  applicationId,
  rejectionReason,
) => {
  const response = await httpClient.post(
    `/hiring-posts/applications/${applicationId}/reject`,
    { rejectionReason },
  );
  return response.data;
};
