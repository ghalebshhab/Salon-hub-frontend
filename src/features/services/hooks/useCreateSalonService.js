import { validateService, toServicePayload } from "../model/serviceForm.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../shared/notifications/toast.jsx";
import { createSalonServiceApi } from "../api/salonServicesApi.js";

export default function useCreateSalonService() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    durationMinutes: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateService(formData);
    if (validationError) {
      showErrorToast(validationError);
      return;
    }

    const requestBody = toServicePayload(formData);

    try {
      setSubmitting(true);

      const response = await createSalonServiceApi(requestBody);

      if (response.success) {
        showSuccessToast("Service created successfully");
        navigate("/owner/services");
      } else {
        showErrorToast(response.message || "Failed to create service");
      }
    } catch (error) {
      console.error(error);
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create service",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return { formData, submitting, handleChange, handleSubmit };
}
