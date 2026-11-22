import { useState } from "react";
import { showWarningToast } from "../../../shared/notifications/toast.jsx";
import { uploadProfilePictureApi } from "../api/mediaApi.js";
import t from "../../../shared/i18n/t.js";

const UPLOADERS = {
  profilePicture: uploadProfilePictureApi,
};

/** Uploads one picked file and returns its Cloudinary URL, or null. */
export default function usePhotoUpload(target = "profilePicture") {
  const [uploading, setUploading] = useState(false);

  const upload = async (file) => {
    setUploading(true);
    try {
      const response = await UPLOADERS[target](file);
      if (!response?.success || !response.data?.secureUrl) {
        showWarningToast(response?.message || t("Could not upload the photo."));
        return null;
      }
      return response.data.secureUrl;
    } catch (error) {
      showWarningToast(
        error?.response?.data?.message || t("Could not upload the photo."),
      );
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploading, upload };
}
