import { useCallback } from "react";
import { mergeCommunityActions } from "./useCommunityAction.js";
import useCommunityMember from "./useCommunityMember.js";
import useCommunityMemberPosts from "./useCommunityMemberPosts.js";
import useCommunityRelationshipActions from "./useCommunityRelationshipActions.js";

export default function useCommunityProfile(userId) {
  const member = useCommunityMember(userId);
  const { decrementPostCount, refresh } = member;
  const handlePostDelete = useCallback(
    () => decrementPostCount(),
    [decrementPostCount],
  );
  const posts = useCommunityMemberPosts(userId, { onDelete: handlePostDelete });
  const relationships = useCommunityRelationshipActions({
    afterSuccess: refresh,
  });

  return {
    profile: member.profile,
    loading: member.loading,
    error: member.error,
    posts: posts.posts,
    postPage: posts.postPage,
    postsLoading: posts.loading,
    postsError: posts.error,
    busyAction: mergeCommunityActions(
      posts.busyAction,
      relationships.busyAction,
    ),
    connect: relationships.connect,
    accept: relationships.accept,
    decline: relationships.decline,
    remove: relationships.remove,
    toggleLike: posts.toggleLike,
    deletePost: posts.deletePost,
    incrementCommentCount: posts.incrementCommentCount,
    loadMorePosts: posts.loadMore,
    retryPosts: posts.retry,
  };
}
