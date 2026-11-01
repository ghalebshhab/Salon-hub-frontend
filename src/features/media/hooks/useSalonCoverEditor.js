import { useState } from "react";
import { showErrorToast, showSuccessToast } from "../../../shared/notifications/toast.jsx";
import { uploadSalonCoverApi, uploadSalonCoverFromDriveApi } from "../api/mediaApi.js";

export default function useSalonCoverEditor(onUploaded) {
  const [selection, setSelection] = useState(null);
  const [uploading, setUploading] = useState(false);

  const upload = async () => {
    if (!selection?.file && !selection?.remoteUrl) {
      showErrorToast("Choose a picture from your device or Google Drive first.");
      return;
    }
    try {
      setUploading(true);
      const response = selection.file
        ? await uploadSalonCoverApi(selection.file)
        : await uploadSalonCoverFromDriveApi(selection.remoteUrl);
      if (!response.success) {
        showErrorToast(response.message);
        return;
      }
      onUploaded?.(response.data?.secureUrl);
      setSelection(null);
      showSuccessToast("Salon profile picture updated.");
    } catch (error) {
      showErrorToast(error?.response?.data?.message || error?.message || "Could not upload the salon picture.");
    } finally {
      setUploading(false);
    }
  };

  return { selection, setSelection, uploading, upload };
}
