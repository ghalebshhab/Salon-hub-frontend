import { validateService, toServicePayload } from "../model/serviceForm.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import { requireData } from "../../../shared/api/response.js";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../shared/notifications/toast.jsx";
import {
  getMySalonServicesApi,
  updateSalonServiceApi,
} from "../api/salonServicesApi.js";

export default function useEditSalonService() {
  const { serviceId } = useParams();

  const navigate = useNavigate();

  const [draft, setFormData] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  const loader = useCallback(
    async (signal) => {
      const services = requireData(await getMySalonServicesApi({ signal }));
      const service = services?.find(
        (item) => String(item.id) === String(serviceId),
      );
      if (!service) throw new Error("Service not found");
      return service;
    },
    [serviceId],
  );
  const {
    data: service,
    loading,
    error,
  } = useQuery(loader, { onError: showErrorToast });
  const formData = draft ?? {
    name: service?.name || "",
    description: service?.description || "",
    price: service?.price ?? "",
    durationMinutes: service?.durationMinutes ?? "",
    isActive: service?.isActive ?? true,
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(() => ({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (error || loading) return;
    const validationError = validateService(formData);
    if (validationError) {
      showErrorToast(validationError);
      return;
    }

    const requestBody = toServicePayload(formData);

    try {
      setSubmitting(true);

      const response = await updateSalonServiceApi(serviceId, requestBody);

      if (response.success) {
        showSuccessToast("Service updated successfully");
        navigate("/owner/services");
      } else {
        showErrorToast(response.message || "Failed to update service");
      }
    } catch (error) {
      console.error(error);
      showErrorToast(
        error?.response?.data?.message || "Failed to update service",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return { formData, error, loading, submitting, handleChange, handleSubmit };
}
