import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../shared/notifications/toast.jsx";
import { registerApi } from "../api/authApi.js";
import { getApiErrorMessage } from "../../../shared/api/response.js";

export default function useRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    phoneNumber: "",
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
      const response = await registerApi(form);

      if (!response.success) {
        showErrorToast(response.message || "Register failed");
        return;
      }

      showSuccessToast(response.message || "Account created. Check your email.");
      navigate("/verify-email", {
        replace: true,
        state: {
          email: response.data?.email || form.email.trim(),
          resendAvailableInSeconds:
            response.data?.resendAvailableInSeconds ?? 60,
        },
      });
    } catch (error) {
      showErrorToast(getApiErrorMessage(error, "Registration could not be completed."));
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, handleChange, handleSubmit };
}
