import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../../../shared/notifications/toast.jsx";
import { createSalonApi } from "../api/salonApi.js";
import { toSalonPayload } from "../model/salonForm.js";
import {
  uploadSalonCoverApi,
  uploadSalonCoverFromDriveApi,
} from "../../media/api/mediaApi.js";

const initialForm = {
  name: "",
  description: "",
  email: "",
  phoneNumber: "",
  city: "",
  openTime: "09:00:00",
  closeTime: "18:00:00",
  maxNumOfEmployees: 5,
  profilePictureUrl: "",
  googleMapsUrl: "",
  latitude: "",
  longitude: "",
  coverFile: null,
  coverDriveUrl: "",
  coverPreviewUrl: "",
};

export default function useCreateSalon() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = ({ target }) =>
    setForm((current) => ({ ...current, [target.name]: target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.description.trim().length < 10) {
      showWarningToast("Description must contain at least 10 characters.");
      return;
    }
    if (form.openTime >= form.closeTime) {
      showWarningToast("Closing time must be later than opening time.");
      return;
    }
    try {
      setLoading(true);
      const response = await createSalonApi(toSalonPayload(form));
      if (!response.success) {
        showErrorToast(response.message || "Failed to submit salon");
        return;
      }
      let imageUploaded = true;
      if (form.coverFile) {
        const mediaResponse = await uploadSalonCoverApi(form.coverFile);
        imageUploaded = mediaResponse.success;
        if (!imageUploaded) showErrorToast(mediaResponse.message);
      } else if (form.coverDriveUrl) {
        const mediaResponse = await uploadSalonCoverFromDriveApi(form.coverDriveUrl);
        imageUploaded = mediaResponse.success;
        if (!imageUploaded) showErrorToast(mediaResponse.message);
      }
      showSuccessToast(
        imageUploaded
          ? "Salon request submitted for review."
          : "Salon request was submitted, but its picture still needs to be uploaded.",
      );
      navigate("/owner/my-salon");
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit salon",
      );
    } finally {
      setLoading(false);
    }
  };

  return { form, setForm, loading, handleChange, handleSubmit };
}
