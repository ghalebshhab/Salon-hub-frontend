import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPasswordApi } from "../api/authApi.js";
import { getApiErrorMessage } from "../../../shared/api/response.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";

export default function useForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await forgotPasswordApi({ email: email.trim() });
      if (!response.success) throw new Error(response.message);
      showSuccessToast(response.message || "Check your email for a reset code.");
      navigate("/verify-reset-code", {
        state: { email: email.trim() },
      });
    } catch (error) {
      showErrorToast(getApiErrorMessage(error, "Password recovery could not start."));
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, loading, handleSubmit };
}
