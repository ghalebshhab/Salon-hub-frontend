import httpClient from "../../../shared/api/httpClient.js";

const payload = (response) => response.data;

export async function getCommunityFeedApi(
  { page = 0, size = 20 } = {},
  config = {},
) {
  return payload(
    await httpClient.get("/community/feed", {
      ...config,
      params: { page, size },
    }),
  );
}

export async function createCommunityPostApi(post) {
  return payload(await httpClient.post("/community/posts", post));
}

export async function deleteCommunityPostApi(postId) {
  return payload(await httpClient.delete(`/community/posts/${postId}`));
}

export async function setCommunityPostLikeApi(postId, liked) {
  const path = `/community/posts/${postId}/like`;
  return payload(
    liked ? await httpClient.put(path) : await httpClient.delete(path),
  );
}

export async function getCommunityPostLikesApi(postId, config = {}) {
  return payload(
    await httpClient.get(`/community/posts/${postId}/likes`, config),
  );
}

export async function getCommunityProfileApi(userId, config = {}) {
  return payload(await httpClient.get(`/community/people/${userId}`, config));
}

export async function getCommunityMemberPostsApi(
  userId,
  { page = 0, size = 10 } = {},
  config = {},
) {
  return payload(
    await httpClient.get(`/community/people/${userId}/posts`, {
      ...config,
      params: { page, size },
    }),
  );
}

export async function getCommunityCommentsApi(postId, config = {}) {
  return payload(
    await httpClient.get(`/community/posts/${postId}/comments`, {
      ...config,
      params: { page: 0, size: 50 },
    }),
  );
}

export async function addCommunityCommentApi(postId, content) {
  return payload(
    await httpClient.post(`/community/posts/${postId}/comments`, { content }),
  );
}

export async function deleteCommunityCommentApi(postId, commentId) {
  return payload(
    await httpClient.delete(`/community/posts/${postId}/comments/${commentId}`),
  );
}
