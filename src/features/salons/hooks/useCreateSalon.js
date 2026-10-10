import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../../../shared/notifications/toast.jsx";
import { createSalonApi } from "../api/salonApi.js";
import { toSalonPayload } from "../model/salonForm.js";

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
      showSuccessToast("Salon request submitted for review.");
      navigate("/owner/my-salon");
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message || "Failed to submit salon",
      );
    } finally {
      setLoading(false);
    }
  };

  return { form, setForm, loading, handleChange, handleSubmit };
}
