import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { deleteMySalonApi } from "../api/salonApi.js";
import { showErrorToast } from "../../../shared/notifications/toast.jsx";
import { showSuccessToast } from "../../../shared/notifications/toast.jsx";
import { getMySalonApi } from "../api/salonApi.js";
import { getSalonEmployeesApi } from "../../employees/api/salonEmployeesApi.js";
import { getSalonMediaApi } from "../../media/api/mediaApi.js";

export default function useMySalon() {
  const navigate = useNavigate();
  const [deleteSalonModalOpen, setDeleteSalonModalOpen] = useState(false);
  const [deletingSalon, setDeletingSalon] = useState(false);
  const formatTime = (time) => {
    if (!time) return "—";
    return time.toString().slice(0, 5);
  };
  const handleDeleteSalon = async () => {
    try {
      setDeletingSalon(true);

      const response = await deleteMySalonApi();

      if (response.success) {
        showSuccessToast("Salon deleted successfully.", "Deleted");
        setDeleteSalonModalOpen(false);
        navigate("/owner/dashboard");
      } else {
        showErrorToast(
          response.message || "Could not delete salon.",
          "Delete failed",
        );
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Could not delete salon.", "Delete failed");
    } finally {
      setDeletingSalon(false);
    }
  };

  const getImages = (salonData) => {
    return salonData?.Images || salonData?.images || [];
  };

  const loader = useCallback(async (signal) => {
    const salon = requireData(await getMySalonApi({ signal }));
    const [employees, mediaPosts] = await Promise.all([
      getSalonEmployeesApi(salon.salonId, { signal })
        .then(requireData)
        .catch(() => []),
      getSalonMediaApi(salon.salonId, { signal })
        .then(requireData)
        .catch(() => []),
    ]);
    return { salon, employees: employees || [], mediaPosts: mediaPosts || [] };
  }, []);
  const {
    data,
    loading,
    error: queryError,
  } = useQuery(loader, { initialData: {}, onError: showErrorToast });
  const { salon = null, employees = [], mediaPosts = [] } = data;
  const error =
    queryError?.response?.status === 404
      ? "You haven't created a salon yet."
      : queryError?.message;

  return {
    salon,
    employees,
    mediaPosts,
    loading,
    error,
    deleteSalonModalOpen,
    setDeleteSalonModalOpen,
    deletingSalon,
    formatTime,
    handleDeleteSalon,
    getImages,
  };
}
