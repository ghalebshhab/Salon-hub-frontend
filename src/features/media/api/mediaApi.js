import httpClient from "../../../shared/api/httpClient.js";

// Legacy adapters remain available until their older screens migrate to the
// authenticated Cloudinary work-gallery contract below.
export const createMediaPostApi = async (data) => {
  const response = await httpClient.post("/salon-media", data);
  return response.data;
};

export const getSalonMediaApi = async (salonId, config = {}) => {
  const response = await httpClient.get(`/salon-media/salon/${salonId}`, config);
  return response.data;
};

export const getSalonVideosApi = async (salonId, config = {}) => {
  const response = await httpClient.get(`/salon-media/salon/${salonId}/videos`, config);
  return response.data;
};

export const deleteMediaPostApi = async (mediaPostId) => {
  const response = await httpClient.delete(`/salon-media/${mediaPostId}`);
  return response.data;
};

export async function uploadSalonCoverApi(file) {
  const body = new FormData();
  body.append("file", file);
  const response = await httpClient.post("/media/salon-cover", body);
  return response.data;
}

export async function uploadSalonCoverFromDriveApi(url) {
  const response = await httpClient.post("/media/salon-cover/drive", { url });
  return response.data;
}

export async function getSalonWorkMediaApi(salonId, config = {}) {
  const response = await httpClient.get(`/media/salons/${salonId}/work`, {
    ...config,
    params: { page: 0, size: 24, ...(config.params || {}) },
    skipAuth: true,
  });
  return response.data;
}

export async function publishWorkMediaApi(file, caption) {
  const body = new FormData();
  body.append("file", file);
  if (caption?.trim()) body.append("caption", caption.trim());
  const response = await httpClient.post("/media/work", body);
  return response.data;
}

export async function publishWorkMediaFromDriveApi(url, caption) {
  const response = await httpClient.post("/media/work/drive", {
    url,
    caption: caption?.trim() || null,
  });
  return response.data;
}

export async function deleteWorkMediaApi(mediaId) {
  const response = await httpClient.delete(`/media/work/${mediaId}`);
  return response.data;
}
