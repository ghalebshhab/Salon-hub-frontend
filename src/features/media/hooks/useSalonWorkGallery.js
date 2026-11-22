import { useCallback, useState } from "react";
import { requireData } from "../../../shared/api/response.js";
import useAuth from "../../../shared/auth/useAuth.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";
import {
  deleteWorkMediaApi,
  getSalonWorkMediaApi,
  publishWorkMediaApi,
  publishWorkMediaFromDriveApi,
} from "../api/mediaApi.js";
import { confirmAction } from "../../../shared/confirm/confirmStore.js";
import { GALLERY_PAGE_SIZE } from "../model/workGallery.js";
import t from "../../../shared/i18n/t.js";

const apiMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

/**
 * The salon's published work. The first page loads with the page; more
 * pages load on request. Employees of this salon can publish and delete
 * their own work.
 */
export default function useSalonWorkGallery(salonId) {
  const { user } = useAuth();
  const [selection, setSelection] = useState(null);
  const [caption, setCaption] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [extra, setExtra] = useState({ items: [], page: 0 });
  const [loadingMore, setLoadingMore] = useState(false);

  const loader = useCallback(
    async (signal) => {
      const data = await getSalonWorkMediaApi(salonId, {
        signal,
        params: { page: 0, size: GALLERY_PAGE_SIZE },
      }).then(requireData);
      setExtra({ items: [], page: 0 });
      return data;
    },
    [salonId],
  );
  const { data, loading, error, refetch } = useQuery(loader, {
    initialData: { items: [] },
  });

  const firstPage = data?.items || [];
  const seen = new Set(firstPage.map((item) => item.id));
  const items = [
    ...firstPage,
    ...extra.items.filter((item) => !seen.has(item.id)),
  ];
  const totalItems = Math.max(Number(data?.totalItems) || 0, items.length);
  const hasMore = items.length < totalItems;

  const canPublish =
    user?.role === "Employee" && Number(user?.salonId) === Number(salonId);
  const isOwnItem = (item) =>
    user?.id != null && Number(user.id) === Number(item.employeeId);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    const page = extra.page + 1;
    try {
      setLoadingMore(true);
      const next = await getSalonWorkMediaApi(salonId, {
        params: { page, size: GALLERY_PAGE_SIZE },
      }).then(requireData);
      setExtra((current) => ({
        items: [...current.items, ...(next?.items || [])],
        page,
      }));
    } catch (loadError) {
      showErrorToast(apiMessage(loadError, t("Could not load more work.")));
    } finally {
      setLoadingMore(false);
    }
  };

  /** Returns true when the work is published. */
  const publish = async () => {
    if (!selection?.file && !selection?.remoteUrl) {
      showErrorToast(t("Choose a work photo or video first."));
      return false;
    }
    try {
      setPublishing(true);
      const response = selection.file
        ? await publishWorkMediaApi(selection.file, caption)
        : await publishWorkMediaFromDriveApi(selection.remoteUrl, caption);
      if (!response.success) {
        showErrorToast(response.message);
        return false;
      }
      setSelection(null);
      setCaption("");
      refetch();
      showSuccessToast(t("Your work was published to the salon gallery."));
      return true;
    } catch (publishError) {
      showErrorToast(
        apiMessage(publishError, t("Could not publish this media.")),
      );
      return false;
    } finally {
      setPublishing(false);
    }
  };

  /** Returns true when the work is deleted. */
  const remove = async (mediaId) => {
    const confirmed = await confirmAction({
      title: t("Delete this work?"),
      message: t("It will be removed from the salon gallery and from storage."),
      confirmText: t("Delete"),
      danger: true,
    });
    if (!confirmed) return false;
    try {
      const response = await deleteWorkMediaApi(mediaId);
      if (!response.success) {
        showErrorToast(response.message);
        return false;
      }
      refetch();
      showSuccessToast(t("Work removed from the gallery."));
      return true;
    } catch (removeError) {
      showErrorToast(
        apiMessage(removeError, t("Could not remove this media.")),
      );
      return false;
    }
  };

  return {
    items,
    totalItems,
    hasMore,
    loading,
    loadingMore,
    error,
    refetch,
    loadMore,
    canPublish,
    isOwnItem,
    selection,
    setSelection,
    caption,
    setCaption,
    publishing,
    publish,
    remove,
  };
}
