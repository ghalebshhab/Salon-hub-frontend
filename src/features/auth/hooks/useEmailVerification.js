import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  resendEmailVerificationApi,
  verifyEmailApi,
} from "../api/authApi.js";
import { getApiErrorMessage } from "../../../shared/api/response.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";

export default function useEmailVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: location.state?.email || "",
    code: "",
  });
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(
    Number(location.state?.resendAvailableInSeconds || 0),
  );

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = window.setInterval(
      () => setCooldown((seconds) => Math.max(0, seconds - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [cooldown]);

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
      const response = await verifyEmailApi({
        email: form.email.trim(),
        code: form.code,
      });
      if (!response.success) throw new Error(response.message);
      showSuccessToast(response.message || "Email verified successfully.");
      navigate("/login", { replace: true, state: { email: form.email.trim() } });
    } catch (error) {
      showErrorToast(getApiErrorMessage(error, "Email verification failed."));
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (resending || cooldown > 0) return;
    try {
      setResending(true);
      const response = await resendEmailVerificationApi({
        email: form.email.trim(),
      });
      if (!response.success) throw new Error(response.message);
      setCooldown(60);
      showSuccessToast(response.message || "A new verification code was sent.");
    } catch (error) {
      showErrorToast(getApiErrorMessage(error, "The code could not be resent."));
    } finally {
      setResending(false);
    }
  };

  return {
    form,
    loading,
    resending,
    cooldown,
    handleChange,
    handleSubmit,
    resend,
  };
}
