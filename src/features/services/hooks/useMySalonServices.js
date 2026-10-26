import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { useCallback } from "react";

import {
  showSuccessToast,
  showErrorToast,
} from "../../../shared/notifications/toast.jsx";

import {
  getMySalonServicesApi,
  deleteSalonServiceApi,
} from "../api/salonServicesApi.js";

export default function useMySalonServices() {
  const loader = useCallback(
    async (signal) =>
      requireData(await getMySalonServicesApi({ signal })) || [],
    [],
  );
  const {
    data: services,
    loading,
    refetch: loadServices,
  } = useQuery(loader, { initialData: [], onError: showErrorToast });

  const handleDelete = async (serviceId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to disable this service?",
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteSalonServiceApi(serviceId);

      if (response.success) {
        showSuccessToast("Service disabled successfully");
        loadServices();
      } else {
        showErrorToast(response.message || "Failed to disable service");
      }
    } catch (error) {
      console.error(error);
      showErrorToast(error?.message || "Failed to disable service");
    }
  };

  return { services, loading, handleDelete };
}
