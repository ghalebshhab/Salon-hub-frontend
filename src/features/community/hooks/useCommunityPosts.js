import { useCallback, useEffect, useRef, useState } from "react";
import { requireData } from "../../../shared/api/response.js";
import { showApiErrorToast } from "../../../shared/notifications/toast.jsx";
import {
  createCommunityPostApi,
  deleteCommunityPostApi,
  getCommunityFeedApi,
  setCommunityPostLikeApi,
} from "../api/communityPostsApi.js";
import useCommunityAction from "./useCommunityAction.js";

export default function useCommunityPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedError, setFeedError] = useState(false);
  const feedControllerRef = useRef(null);
  const { busyAction, runAction } = useCommunityAction();

  const loadFeed = useCallback(() => {
    feedControllerRef.current?.abort();
    const controller = new AbortController();
    feedControllerRef.current = controller;
    setLoading(true);
    setFeedError(false);

    getCommunityFeedApi({}, { signal: controller.signal })
      .then((response) => {
        if (!controller.signal.aborted) setPosts(requireData(response)?.content || []);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setFeedError(true);
          showApiErrorToast(error, "The community feed could not be loaded.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted && feedControllerRef.current === controller) {
          setLoading(false);
          feedControllerRef.current = null;
        }
      });
  }, []);

  const retryFeed = useCallback(() => loadFeed(), [loadFeed]);

  useEffect(() => {
    Promise.resolve().then(loadFeed);
    return () => feedControllerRef.current?.abort();
  }, [loadFeed]);

  const createPost = useCallback(
    async (postDraft) => {
      const response = await runAction({
        key: "create-post",
        action: () => createCommunityPostApi(postDraft),
        successMessage: "Your post is live.",
      });
      const post = response && requireData(response);
      if (post) setPosts((current) => [post, ...current]);
      return Boolean(post);
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
      if (response?.success)
        setPosts((current) => current.filter((post) => post.id !== postId));
    },
    [runAction],
  );

  const toggleLike = useCallback(
    async (post) => {
      const response = await runAction({
        key: `like-${post.id}`,
        action: () => setCommunityPostLikeApi(post.id, !post.likedByMe),
      });
      const updatedPost = response && requireData(response);
      if (updatedPost)
        setPosts((current) =>
          current.map((item) => (item.id === post.id ? updatedPost : item)),
        );
    },
    [runAction],
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
    loading,
    feedError,
    retryFeed,
    busyAction,
    createPost,
    deletePost,
    toggleLike,
    incrementCommentCount,
  };
}
