import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../shared/notifications/toast.jsx";
import { getUserProfileApi } from "../../auth/api/authApi.js";
import { joinHiringPostApi } from "../api/hiringApi.js";

export default function useApplyHiringPost() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [draft, setForm] = useState(null);
  const emptyForm = {
    fullName: "",
    phoneNumber: "",
    cv: "",
    age: "",
    experienceYears: "",
  };

  const [submitting, setSubmitting] = useState(false);

  const loader = useCallback(
    async (signal) => requireData(await getUserProfileApi({ signal })),
    [],
  );
  const { data: profile, loading } = useQuery(loader, {
    onError: showErrorToast,
  });
  const form =
    draft ??
    (profile
      ? {
          fullName: [profile.firstName, profile.lastName]
            .filter(Boolean)
            .join(" "),
          phoneNumber: profile.phoneNumber || "",
          cv: profile.cv || "",
          age: profile.age ?? "",
          experienceYears: profile.experienceYears ?? "",
        }
      : emptyForm);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName.trim()) {
      showErrorToast("Full name is required.");
      return;
    }

    if (!form.phoneNumber.trim()) {
      showErrorToast("Phone number is required.");
      return;
    }

    if (!form.age) {
      showErrorToast("Age is required.");
      return;
    }

    if (form.experienceYears === "") {
      showErrorToast("Experience years is required.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        cv: form.cv.trim(),
        age: parseInt(form.age, 10),
        experienceYears: parseInt(form.experienceYears, 10),
      };

      const response = await joinHiringPostApi(postId, payload);

      if (response.success) {
        showSuccessToast(
          response.message || "Application submitted successfully!",
        );
        navigate("/hiring-posts");
      } else {
        showErrorToast(response.message || "Failed to submit application.");
      }
    } catch (error) {
      console.error(error);
      showErrorToast(
        error?.response?.data?.message || "Failed to submit application.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return { navigate, form, loading, submitting, handleChange, handleSubmit };
}
