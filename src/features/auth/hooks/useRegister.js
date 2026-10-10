import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../shared/notifications/toast.jsx";
import { registerApi } from "../api/authApi.js";

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

      showSuccessToast("Registered successfully. Please login.");
      navigate("/login");
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "Register failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, handleChange, handleSubmit };
}
