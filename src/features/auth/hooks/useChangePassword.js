import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePasswordApi } from "../api/authApi.js";
import { getApiErrorMessage } from "../../../shared/api/response.js";
import { clearAuthData } from "../../../shared/auth/tokenStorage.js";
import useAuth from "../../../shared/auth/useAuth.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";

export default function useChangePassword() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await changePasswordApi(form);
      if (!response.success) throw new Error(response.message);

      const email = user?.email || "";
      clearAuthData();
      showSuccessToast(
        response.message || "Password changed. Please sign in again.",
      );
      navigate("/login", { replace: true, state: { email } });
    } catch (error) {
      showErrorToast(
        getApiErrorMessage(error, "Your password could not be changed."),
      );
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, handleChange, handleSubmit };
}
