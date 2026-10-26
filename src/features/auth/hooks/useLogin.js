import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../shared/notifications/toast.jsx";
import { loginApi } from "../api/authApi.js";
import { saveToken } from "../../../shared/auth/tokenStorage.js";

export default function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
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
      const response = await loginApi(form);

      if (!response.success) {
        showErrorToast(response.message || "Login failed");
        return;
      }

      saveToken(response.data.token);

      showSuccessToast("Welcome back to SalonHub ✨", "Logged in");
      const from = location.state?.from;
      navigate(
        typeof from === "string" &&
          from.startsWith("/") &&
          !from.startsWith("//")
          ? from
          : "/",
        { replace: true },
      );
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message || error?.message || "Login failed",
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, handleChange, handleSubmit };
}
