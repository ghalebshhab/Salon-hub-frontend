import { useEffect, useRef, useState } from "react";
import { showErrorToast, showSuccessToast } from "../../../shared/notifications/toast.jsx";
import { uploadSalonCoverApi, uploadSalonCoverFromDriveApi } from "../api/mediaApi.js";

export default function useSalonCoverEditor(onUploaded) {
  const [selection, setSelection] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const request = useRef(null);

  useEffect(() => () => {
    request.current?.abort();
    request.current = null;
  }, []);

  const cancel = () => {
    request.current?.abort();
    request.current = null;
    setUploading(false);
    setProgress(null);
    setNotice("Upload request cancelled. The server may still finish saving; refresh your salon before retrying.");
  };

  const upload = async () => {
    if (request.current) return;
    if (!selection?.file && !selection?.remoteUrl) {
      showErrorToast("Choose a picture from your device or Google Drive first.");
      return;
    }
    const controller = new AbortController();
    request.current = controller;
    setProgress(null);
    setError("");
    setNotice("");
    try {
      setUploading(true);
      const config = {
        signal: controller.signal,
        showLoading: false,
        timeout: 120000,
        onUploadProgress: ({ loaded, total }) => {
          if (controller.signal.aborted || !selection.file) return;
          setProgress(total > 0 ? Math.min(100, Math.floor((loaded / total) * 100)) : null);
        },
      };
      const response = selection.file
        ? await uploadSalonCoverApi(selection.file, config)
        : await uploadSalonCoverFromDriveApi(selection.remoteUrl, config);
      if (controller.signal.aborted) return;
      if (!response.success) {
        const message = response.message || "Could not upload the salon picture.";
        setError(message);
        showErrorToast(message);
        return;
      }
      onUploaded?.(response.data?.secureUrl);
      setSelection(null);
      showSuccessToast("Salon profile picture updated.");
    } catch (error) {
      if (controller.signal.aborted) return;
      const message = error?.response?.data?.message || error?.message || "Could not upload the salon picture.";
      setError(message);
      showErrorToast(message);
    } finally {
      if (request.current === controller) {
        request.current = null;
        setUploading(false);
      }
    }
  };

  return { selection, setSelection, uploading, progress, error, notice, upload, cancel };
}
