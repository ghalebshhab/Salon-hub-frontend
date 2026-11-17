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
import { confirmAction } from "../../../shared/confirm/confirmStore.js";

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
    const confirmDelete = await confirmAction({
      title: "Disable this service?",
      message: "Customers will no longer be able to book it.",
      confirmText: "Disable",
      danger: true,
    });

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
