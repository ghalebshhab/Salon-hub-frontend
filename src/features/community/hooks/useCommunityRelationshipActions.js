import { useCallback } from "react";
import {
  acceptFriendRequestApi,
  declineFriendRequestApi,
  removeFriendshipApi,
  sendFriendRequestApi,
} from "../api/communityRelationshipsApi.js";
import useCommunityAction from "./useCommunityAction.js";

export default function useCommunityRelationshipActions({ afterSuccess } = {}) {
  const { busyAction, runAction } = useCommunityAction();

  const execute = useCallback(
    async ({ key, action, successMessage }) => {
      const response = await runAction({ key, action, successMessage });
      if (response?.success) await afterSuccess?.();
      return Boolean(response?.success);
    },
    [afterSuccess, runAction],
  );

  const connect = useCallback(
    (userId) =>
      execute({
        key: `connect-${userId}`,
        action: () => sendFriendRequestApi(userId),
        successMessage: "Friend request sent.",
      }),
    [execute],
  );

  const accept = useCallback(
    (friendshipId) =>
      execute({
        key: `accept-${friendshipId}`,
        action: () => acceptFriendRequestApi(friendshipId),
        successMessage: "You are now connected.",
      }),
    [execute],
  );

  const decline = useCallback(
    (friendshipId) =>
      execute({
        key: `decline-${friendshipId}`,
        action: () => declineFriendRequestApi(friendshipId),
        successMessage: "Friend request declined.",
      }),
    [execute],
  );

  const remove = useCallback(
    (friendshipId) =>
      execute({
        key: `remove-${friendshipId}`,
        action: () => removeFriendshipApi(friendshipId),
        successMessage: "Community connection removed.",
      }),
    [execute],
  );

  return { busyAction, connect, accept, decline, remove };
}
