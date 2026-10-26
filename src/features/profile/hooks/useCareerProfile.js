import { useCallback, useState } from "react";
import { requireData } from "../../../shared/api/response.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";
import {
  getUserProfileApi,
  updateUserProfileApi,
} from "../../auth/api/authApi.js";

const listText = (value) => (value || []).join(", ");
export default function useCareerProfile() {
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const loader = useCallback(
    (signal) => getUserProfileApi({ signal }).then(requireData),
    [],
  );
  const { data: profile, loading } = useQuery(loader, {
    onError: showErrorToast,
  });
  const form = draft || {
    dateOfBirth: profile?.dateOfBirth || "",
    yearsOfExperience: profile?.yearsOfExperience ?? 0,
    skills: listText(profile?.skills),
    preferredWorkLocations: listText(profile?.preferredWorkLocations),
    resumeUrl: profile?.resumeUrl || "",
    portfolioUrl: profile?.portfolioUrl || "",
    professionalBio: profile?.professionalBio || "",
  };
  const handleChange = ({ target }) =>
    setDraft({ ...form, [target.name]: target.value });
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...form,
        yearsOfExperience: Number(form.yearsOfExperience),
        skills: form.skills
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
        preferredWorkLocations: form.preferredWorkLocations
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
      };
      const response = await updateUserProfileApi(payload);
      if (!response.success) {
        showErrorToast(response.message || "Could not save career profile");
        return;
      }
      setDraft(null);
      showSuccessToast("Career profile saved.");
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Could not save career profile",
      );
    } finally {
      setSaving(false);
    }
  };
  return { form, profile, loading, saving, handleChange, handleSubmit };
}
