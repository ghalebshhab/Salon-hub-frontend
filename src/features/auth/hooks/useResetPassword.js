import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPasswordApi } from "../api/authApi.js";
import { getApiErrorMessage } from "../../../shared/api/response.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";

export default function useResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const resetToken = location.state?.resetToken || "";
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!resetToken) {
      showErrorToast("Request and verify a new password reset code first.");
      navigate("/forgot-password", { replace: true });
      return;
    }
    try {
      setLoading(true);
      const response = await resetPasswordApi({ resetToken, ...form });
      if (!response.success) throw new Error(response.message);
      showSuccessToast(response.message || "Password updated successfully.");
      navigate("/login", { replace: true });
    } catch (error) {
      showErrorToast(getApiErrorMessage(error, "The password could not be reset."));
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    hasResetAuthorization: Boolean(resetToken),
    handleChange,
    handleSubmit,
  };
}
