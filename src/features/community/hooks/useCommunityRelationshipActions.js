import { useCallback } from "react";
import {
  acceptFriendRequestApi,
  declineFriendRequestApi,
  removeFriendshipApi,
  sendFriendRequestApi,
} from "../api/communityRelationshipsApi.js";
import useCommunityAction from "./useCommunityAction.js";
import { confirmAction } from "../../../shared/confirm/confirmStore.js";
import t from "../../../shared/i18n/t.js";

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
        successMessage: t("Friend request sent."),
      }),
    [execute],
  );

  const accept = useCallback(
    (friendshipId) =>
      execute({
        key: `accept-${friendshipId}`,
        action: () => acceptFriendRequestApi(friendshipId),
        successMessage: t("You are now connected."),
      }),
    [execute],
  );

  const decline = useCallback(
    async (friendshipId) =>
      (await confirmAction({
        title: t("Decline this friend request?"),
        message: t("The request will be removed."),
        confirmText: t("Decline"),
        danger: true,
      })) &&
      execute({
        key: `decline-${friendshipId}`,
        action: () => declineFriendRequestApi(friendshipId),
        successMessage: t("Friend request declined."),
      }),
    [execute],
  );

  const remove = useCallback(
    async (friendshipId) =>
      (await confirmAction({
        title: t("Remove this friend?"),
        message: t("You will no longer be connected in the community."),
        confirmText: t("Remove"),
        danger: true,
      })) &&
      execute({
        key: `remove-${friendshipId}`,
        action: () => removeFriendshipApi(friendshipId),
        successMessage: t("Community connection removed."),
      }),
    [execute],
  );

  return { busyAction, connect, accept, decline, remove };
}
