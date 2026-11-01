import { useCallback, useState } from "react";
import { requireData } from "../../../shared/api/response.js";
import useAuth from "../../../shared/auth/useAuth.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import { showErrorToast, showSuccessToast } from "../../../shared/notifications/toast.jsx";
import { deleteWorkMediaApi, getSalonWorkMediaApi, publishWorkMediaApi, publishWorkMediaFromDriveApi } from "../api/mediaApi.js";

export default function useSalonWorkGallery(salonId) {
  const { user } = useAuth();
  const [selection, setSelection] = useState(null);
  const [caption, setCaption] = useState("");
  const [publishing, setPublishing] = useState(false);
  const loader = useCallback((signal) => getSalonWorkMediaApi(salonId, { signal }).then(requireData), [salonId]);
  const { data, loading, refetch } = useQuery(loader, { initialData: { items: [] }, onError: showErrorToast });
  const canPublish = user?.role === "Employee" && Number(user?.salonId) === Number(salonId);

  const publish = async () => {
    if (!selection?.file && !selection?.remoteUrl) {
      showErrorToast("Choose a work photo or video first.");
      return;
    }
    try {
      setPublishing(true);
      const response = selection.file
        ? await publishWorkMediaApi(selection.file, caption)
        : await publishWorkMediaFromDriveApi(selection.remoteUrl, caption);
      if (!response.success) {
        showErrorToast(response.message);
        return;
      }
      setSelection(null);
      setCaption("");
      refetch();
      showSuccessToast("Your work was published to the salon gallery.");
    } catch (error) {
      showErrorToast(error?.response?.data?.message || error?.message || "Could not publish this media.");
    } finally {
      setPublishing(false);
    }
  };

  const remove = async (mediaId) => {
    try {
      const response = await deleteWorkMediaApi(mediaId);
      if (!response.success) {
        showErrorToast(response.message);
        return;
      }
      refetch();
      showSuccessToast("Work media removed.");
    } catch (error) {
      showErrorToast(error?.response?.data?.message || error?.message || "Could not remove this media.");
    }
  };

  return {
    user,
    items: data?.items || [],
    loading,
    canPublish,
    selection,
    setSelection,
    caption,
    setCaption,
    publishing,
    publish,
    remove,
  };
}
