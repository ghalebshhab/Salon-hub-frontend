import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requireData } from "../../../shared/api/response.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../shared/notifications/toast.jsx";
import {
  deleteMySalonApi,
  getMySalonApi,
  resubmitSalonApi,
} from "../api/salonApi.js";

export default function useMySalon() {
  const navigate = useNavigate();
  const [deleteSalonModalOpen, setDeleteSalonModalOpen] = useState(false);
  const [deletingSalon, setDeletingSalon] = useState(false);
  const [resubmittingSalon, setResubmittingSalon] = useState(false);
  const loader = useCallback(
    (signal) => getMySalonApi({ signal }).then(requireData),
    [],
  );
  const {
    data: salon,
    loading,
    error: queryError,
    refetch,
  } = useQuery(loader, { onError: () => {} });

  const handleResubmitSalon = async () => {
    if (!salon?.salonId) return;
    try {
      setResubmittingSalon(true);
      const response = await resubmitSalonApi(salon.salonId);
      if (!response.success) {
        showErrorToast(response.message || "Could not resubmit salon.");
        return;
      }
      showSuccessToast("Salon resubmitted for administrator review.");
      await refetch();
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message || "Could not resubmit salon.",
      );
    } finally {
      setResubmittingSalon(false);
    }
  };

  const handleDeleteSalon = async () => {
    try {
      setDeletingSalon(true);
      const response = await deleteMySalonApi(salon.salonId);
      if (!response.success) {
        showErrorToast(response.message || "Could not delete salon.");
        return;
      }
      showSuccessToast("Salon deleted successfully.");
      navigate("/owner/dashboard");
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message || "Could not delete salon.",
      );
    } finally {
      setDeletingSalon(false);
    }
  };
  return {
    salon,
    loading,
    error:
      queryError?.response?.status === 404
        ? "You haven't created a salon yet."
        : queryError?.message,
    deleteSalonModalOpen,
    setDeleteSalonModalOpen,
    deletingSalon,
    resubmittingSalon,
    handleResubmitSalon,
    handleDeleteSalon,
  };
}
