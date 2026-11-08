import { useCallback, useState } from "react";
import { requireData } from "../../../shared/api/response.js";
import {
  addCommunityCommentApi,
  getCommunityCommentsApi,
} from "../api/communityPostsApi.js";
import useCommunityAction from "./useCommunityAction.js";

export default function useCommunityComments({ onCommentAdded } = {}) {
  const [commentsByPost, setCommentsByPost] = useState({});
  const { busyAction, runAction } = useCommunityAction();

  const loadComments = useCallback(
    async (postId) => {
      const response = await runAction({
        key: `comments-${postId}`,
        action: () => getCommunityCommentsApi(postId),
        errorMessage: "Comments could not be loaded.",
      });
      const page = response && requireData(response);
      if (page)
        setCommentsByPost((current) => ({
          ...current,
          [postId]: page.content || [],
        }));
    },
    [runAction],
  );

  const addComment = useCallback(
    async (postId, content) => {
      const response = await runAction({
        key: `comment-${postId}`,
        action: () => addCommunityCommentApi(postId, content),
      });
      const comment = response && requireData(response);
      if (!comment) return false;
      setCommentsByPost((current) => ({
        ...current,
        [postId]: [...(current[postId] || []), comment],
      }));
      onCommentAdded?.(postId);
      return true;
    },
    [onCommentAdded, runAction],
  );

  return { commentsByPost, busyAction, loadComments, addComment };
}
