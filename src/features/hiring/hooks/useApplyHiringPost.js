import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { requireData } from "../../../shared/api/response.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";
import { getUserProfileApi } from "../../auth/api/authApi.js";
import { joinHiringPostApi } from "../api/hiringApi.js";

export default function useApplyHiringPost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [applicationNote, setApplicationNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const loader = useCallback(
    (signal) => getUserProfileApi({ signal }).then(requireData),
    [],
  );
  const { data: profile, loading } = useQuery(loader, {
    onError: showErrorToast,
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!profile?.careerProfileEnabled) {
      showErrorToast("Complete your career profile before applying.");
      return;
    }
    try {
      setSubmitting(true);
      const response = await joinHiringPostApi(postId, {
        applicationNote: applicationNote.trim(),
      });
      if (!response.success) {
        showErrorToast(response.message || "Failed to submit application.");
        return;
      }
      showSuccessToast(
        response.message || "Application submitted successfully.",
      );
      navigate("/hiring-posts");
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message || "Failed to submit application.",
      );
    } finally {
      setSubmitting(false);
    }
  };
  return {
    navigate,
    profile,
    applicationNote,
    setApplicationNote,
    loading,
    submitting,
    handleSubmit,
  };
}
