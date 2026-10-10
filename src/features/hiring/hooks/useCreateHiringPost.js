import { useState } from "react";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../shared/notifications/toast.jsx";
import { createHiringPostApi } from "../api/hiringApi.js";

export default function useCreateHiringPost() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    numOfEmps: 1,
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

      const response = await createHiringPostApi({
        ...form,
        numOfEmps: Number(form.numOfEmps),
      });

      if (!response.success) {
        showErrorToast(response.message || "Failed to create hiring post");
        return;
      }

      showSuccessToast("Hiring post created successfully");
      setForm({ title: "", description: "", numOfEmps: 1 });
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message || "Failed to create hiring post",
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, handleChange, handleSubmit };
}
