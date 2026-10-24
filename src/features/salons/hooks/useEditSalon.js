import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requireData } from "../../../shared/api/response.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../../../shared/notifications/toast.jsx";
import { getMySalonApi, updateSalonApi } from "../api/salonApi.js";
import { toSalonPayload } from "../model/salonForm.js";

function toSalonForm(salon) {
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
  };
}

export default function useEditSalon() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const loader = useCallback(
    (signal) => getMySalonApi({ signal }).then(requireData),
    [],
  );
  const { data: salon, loading } = useQuery(loader, {
    onError: showErrorToast,
  });
  const form = draft || toSalonForm(salon);
  const setForm = (updater) =>
    setDraft((current) =>
      updater(typeof current === "object" && current ? current : form),
    );
  const handleChange = ({ target }) =>
    setDraft({ ...form, [target.name]: target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!salon?.salonId) return;
    if (form.description.trim().length < 10) {
      showWarningToast("Description must contain at least 10 characters.");
      return;
    }
    if (form.openTime >= form.closeTime) {
      showWarningToast("Closing time must be later than opening time.");
      return;
    }
    try {
      setSaving(true);
      const response = await updateSalonApi(
        salon.salonId,
        toSalonPayload(form),
      );
      if (!response.success) {
        showErrorToast(response.message || "Could not update salon.");
        return;
      }
      showSuccessToast("Salon details updated.");
      navigate("/owner/my-salon");
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message || "Could not update salon.",
      );
    } finally {
      setSaving(false);
    }
  };

  return { form, setForm, salon, loading, saving, handleChange, handleSubmit };
}
