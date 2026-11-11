import { useCallback, useState } from "react";
import { requireData } from "../../../shared/api/response.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../../../shared/notifications/toast.jsx";
import { getSalonEmployeesApi } from "../../employees/api/salonEmployeesApi.js";
import { getMySalonApi, updateSalonApi } from "../api/salonApi.js";
import { toSalonPayload } from "../model/salonForm.js";

export function toSalonForm(salon) {
  return {
    name: salon?.name || "",
    description: salon?.description || "",
    email: salon?.email || "",
    phoneNumber: salon?.phoneNumber || "",
    city: salon?.city || "",
    openTime: salon?.openTime || "09:00:00",
    closeTime: salon?.closeTime || "18:00:00",
    maxNumOfEmployees: salon?.maxNumOfEmployees ?? 1,
    profilePictureUrl: salon?.profilePictureUrl || salon?.images?.[0] || "",
    googleMapsUrl: salon?.googleMapsUrl || "",
    latitude: salon?.latitude ?? "",
    longitude: salon?.longitude ?? "",
  };
}

function isValid(form) {
  if (form.name.trim().length <= 3) {
    showWarningToast("Salon name must contain more than 3 characters.");
    return false;
  }
  if (form.description.trim().length <= 10) {
    showWarningToast("Description must contain more than 10 characters.");
    return false;
  }
  if (form.openTime >= form.closeTime) {
    showWarningToast("Closing time must be later than opening time.");
    return false;
  }
  if (Number(form.maxNumOfEmployees) < 1) {
    showWarningToast("Team capacity must be at least one.");
    return false;
  }
  return true;
}

export default function useEditSalon() {
  const [draft, setDraft] = useState(null);
  const [savedSalon, setSavedSalon] = useState(null);
  const [saving, setSaving] = useState(false);

  const loader = useCallback(async (signal) => {
    const salon = await getMySalonApi({ signal }).then(requireData);
    const employeeResponse = salon?.salonId
      ? await getSalonEmployeesApi(salon.salonId, { signal })
      : null;
    return {
      salon,
      employees: employeeResponse ? requireData(employeeResponse) || [] : [],
    };
  }, []);

  const { data, loading } = useQuery(loader, {
    onError: showErrorToast,
  });
  const salon = savedSalon || data?.salon || null;
  const form = draft || toSalonForm(salon);

  const setForm = (updater) =>
    setDraft((current) =>
      updater(current && typeof current === "object" ? current : form),
    );

  const handleChange = ({ target }) =>
    setDraft((current) => ({
      ...(current || form),
      [target.name]: target.value,
    }));

  const resetForm = () => setDraft(toSalonForm(salon));

  const save = async () => {
    if (!salon?.salonId || !isValid(form)) return false;
    try {
      setSaving(true);
      const response = await updateSalonApi(
        salon.salonId,
        toSalonPayload(form),
      );
      if (!response.success) {
        showErrorToast(response.message || "Could not update salon.");
        return false;
      }
      const updatedSalon = {
        ...salon,
        ...form,
        ...(response.data || {}),
        description: form.description,
        googleMapsUrl: form.googleMapsUrl,
        latitude: form.latitude,
        longitude: form.longitude,
        state: salon.state,
      };
      setSavedSalon(updatedSalon);
      setDraft(toSalonForm(updatedSalon));
      showSuccessToast("Salon section updated.");
      return true;
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          "Could not update salon.",
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    form,
    setForm,
    salon,
    employees: data?.employees || [],
    loading,
    saving,
    handleChange,
    resetForm,
    save,
  };
}
