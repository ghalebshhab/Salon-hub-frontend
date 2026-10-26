import { useState } from "react";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../shared/notifications/toast.jsx";
import { createMediaPostApi } from "../api/mediaApi.js";

export default function useCreateMediaPost() {
  const [form, setForm] = useState({
    caption: "",
    mediaUrl: "",
    mediaType: "IMAGE",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await createMediaPostApi(form);

      if (!response.success) {
        showErrorToast(response.message || "Failed to create media post");
        return;
      }

      showSuccessToast("Media posted successfully");
      setForm({ caption: "", mediaUrl: "", mediaType: "IMAGE" });
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create media post",
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, handleChange, handleSubmit };
}
