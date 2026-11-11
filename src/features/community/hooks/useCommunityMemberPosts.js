import { useCallback, useEffect, useState } from "react";
import { requireData } from "../../../shared/api/response.js";
import {
  deleteCommunityPostApi,
  getCommunityMemberPostsApi,
  setCommunityPostLikeApi,
} from "../api/communityPostsApi.js";
import useCommunityAction from "./useCommunityAction.js";

const PAGE_SIZE = 10;
const EMPTY_PAGE = { page: 0, totalElements: 0, totalPages: 0, last: true };
const isCanceled = (error) =>
  error?.name === "CanceledError" || error?.name === "AbortError";

function toPage(response) {
  const page = requireData(response, "Member posts could not be loaded.");
  return {
    posts: page.content || [],
    pagination: {
      page: page.page,
      totalElements: page.totalElements,
      totalPages: page.totalPages,
      last: page.last,
    },
  };
}

export default function useCommunityMemberPosts(userId, { onDelete } = {}) {
  const [posts, setPosts] = useState([]);
  const [postPage, setPostPage] = useState(EMPTY_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { busyAction, runAction } = useCommunityAction();

  const applyPage = useCallback((response, append = false) => {
    const next = toPage(response);
    setPosts((current) => (append ? [...current, ...next.posts] : next.posts));
    setPostPage(next.pagination);
  }, []);

  const loadPage = useCallback(
    async (page, { append = false, signal } = {}) => {
      const response = await getCommunityMemberPostsApi(
        userId,
        { page, size: PAGE_SIZE },
        signal ? { signal } : {},
      );
      applyPage(response, append);
    },
    [applyPage, userId],
  );

  useEffect(() => {
    const controller = new AbortController();
    Promise.resolve().then(() => {
      if (controller.signal.aborted) return;
      setPosts([]);
      setPostPage(EMPTY_PAGE);
      setError("");
      setLoading(true);
    });

    Promise.resolve()
      .then(() => loadPage(0, { signal: controller.signal }))
      .catch((requestError) => {
        if (!isCanceled(requestError)) {
          setError(requestError.message || "Member posts could not be loaded.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [loadPage]);

  const retry = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await loadPage(0);
    } catch (requestError) {
      setError(requestError.message || "Member posts could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [loadPage]);

  const loadMore = useCallback(async () => {
    if (loading || postPage.last) return;
    setLoading(true);
    setError("");
    try {
      await loadPage(postPage.page + 1, { append: true });
    } catch (requestError) {
      setError(requestError.message || "More posts could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [loadPage, loading, postPage.last, postPage.page]);

  const toggleLike = useCallback(
    async (post) => {
      const response = await runAction({
        key: `like-${post.id}`,
        action: () => setCommunityPostLikeApi(post.id, !post.likedByMe),
      });
      const updated = response && requireData(response);
      if (updated) {
        setPosts((current) =>
          current.map((item) => (item.id === post.id ? updated : item)),
        );
      }
    },
    [runAction],
  );

  const deletePost = useCallback(
    async (postId) => {
      const response = await runAction({
        key: `delete-${postId}`,
        action: () => deleteCommunityPostApi(postId),
        successMessage: "Post removed.",
      });
      if (!response?.success) return;
      setPosts((current) => current.filter((post) => post.id !== postId));
      setPostPage((current) => ({
        ...current,
        totalElements: Math.max(0, current.totalElements - 1),
      }));
      onDelete?.(postId);
    },
    [onDelete, runAction],
  );

  const incrementCommentCount = useCallback((postId) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? { ...post, commentCount: post.commentCount + 1 }
          : post,
      ),
    );
  }, []);

  return {
    posts,
    postPage,
    loading,
    error,
    busyAction,
    retry,
    loadMore,
    toggleLike,
    deletePost,
    incrementCommentCount,
  };
}
