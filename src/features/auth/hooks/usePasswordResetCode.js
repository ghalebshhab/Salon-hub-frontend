import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyPasswordResetCodeApi } from "../api/authApi.js";
import { getApiErrorMessage } from "../../../shared/api/response.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";
import t from "../../../shared/i18n/t.js";

export default function usePasswordResetCode() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: location.state?.email || "",
    code: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === "code" ? value.replace(/\D/g, "").slice(0, 6) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await verifyPasswordResetCodeApi({
        email: form.email.trim(),
        code: form.code,
      });
      if (!response.success) throw new Error(response.message);
      showSuccessToast(response.message || t("Code accepted."));
      navigate("/reset-password", {
        replace: true,
        state: {
          resetToken: response.data?.resetToken,
          expiresInSeconds: response.data?.expiresInSeconds,
        },
      });
    } catch (error) {
      showErrorToast(
        getApiErrorMessage(error, t("The reset code could not be verified.")),
      );
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, handleChange, handleSubmit };
}
