import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../shared/notifications/toast.jsx";
import { loginApi } from "../api/authApi.js";
import { markSignedIn } from "../../../shared/auth/tokenStorage.js";
import { getApiErrorMessage } from "../../../shared/api/response.js";
import {
  startLoading,
  stopLoading,
} from "../../../shared/loading/loadingStore.js";
import t from "../../../shared/i18n/t.js";

// Safety net: the hand-off card never stays longer than this.
const HANDOFF_MAX_MS = 10000;

// Load the usual first page while the person types, so the switch is instant.
const preloadHome = () => import("../../home/pages/Home.jsx");

export default function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: location.state?.email || "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const handoffRef = useRef(null);

  useEffect(() => {
    preloadHome().catch(() => {});
    // React Router keeps this page on screen while the next one loads. The
    // hand-off card covers that moment and ends when this page unmounts.
    return () => stopLoading(handoffRef.current);
  }, []);

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
        showErrorToast(response.message || t("Login failed"));
        return;
      }

      // The server set the httpOnly session cookies; tell the app it is signed in.
      handoffRef.current = startLoading(t("Opening your SalonHub…"));
      const handoffId = handoffRef.current;
      window.setTimeout(() => stopLoading(handoffId), HANDOFF_MAX_MS);
      markSignedIn();

      showSuccessToast(t("Welcome back to SalonHub ✨"), t("Logged in"));
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
        getApiErrorMessage(error, t("Sign in could not be completed.")),
      );
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, handleChange, handleSubmit };
}
