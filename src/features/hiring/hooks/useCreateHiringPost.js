import { useState } from "react";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";
import { createHiringPostApi } from "../api/hiringApi.js";
import t from "../../../shared/i18n/t.js";

const initialForm = {
  title: "",
  description: "",
  requiredSkills: "",
  minimumAge: 18,
  maximumAge: 65,
  employeeLocation: "",
  minimumYearsOfExperience: 0,
  numOfPositions: 1,
  expiresAt: "",
};

export default function useCreateHiringPost() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const handleChange = ({ target }) =>
    setForm((current) => ({ ...current, [target.name]: target.value }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await createHiringPostApi({
        ...form,
        requiredSkills: form.requiredSkills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        minimumAge: Number(form.minimumAge),
        maximumAge: Number(form.maximumAge),
        minimumYearsOfExperience: Number(form.minimumYearsOfExperience),
        numOfPositions: Number(form.numOfPositions),
        expiresAt: `${form.expiresAt}:00`,
      });
      if (!response.success) {
        showErrorToast(response.message || t("Failed to create hiring post"));
        return;
      }
      showSuccessToast(t("Hiring post created successfully"));
      setForm(initialForm);
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          t("Failed to create hiring post"),
      );
    } finally {
      setLoading(false);
    }
  };
  return { form, loading, handleChange, handleSubmit };
}
