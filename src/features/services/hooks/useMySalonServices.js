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
import t from "../../../shared/i18n/t.js";

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
      title: t("Disable this service?"),
      message: t("Customers will no longer be able to book it."),
      confirmText: t("Disable"),
      danger: true,
    });

    if (!confirmDelete) return;

    try {
      const response = await deleteSalonServiceApi(serviceId);

      if (response.success) {
        showSuccessToast(t("Service disabled successfully"));
        loadServices();
      } else {
        showErrorToast(response.message || t("Failed to disable service"));
      }
    } catch (error) {
      console.error(error);
      showErrorToast(error?.message || t("Failed to disable service"));
    }
  };

  return { services, loading, handleDelete };
}
