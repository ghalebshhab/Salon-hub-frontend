import { useCallback, useState } from "react";
import { requireData } from "../../../shared/api/response.js";
import useQuery from "../../../shared/hooks/useQuery.js";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "../../../shared/notifications/toast.jsx";
import { getSalonEmployeesApi } from "../../employees/api/salonEmployeesApi.js";
import {
  getMySalonApi,
  updateSalonApi,
  updateSalonLocationApi,
} from "../api/salonApi.js";
import { SALON_CITIES } from "../model/salonCities.js";
import { fromSalonResponse, toSalonPayload } from "../model/salonForm.js";
import t from "../../../shared/i18n/t.js";

export function toSalonForm(salon) {
  return {
    name: salon?.name || "",
    description: salon?.description || "",
    descriptionAr: salon?.descriptionAr || "",
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

/**
 * Each section saves the whole salon, so a value the owner did not touch must
 * not block the save (for example a short description saved before the
 * current rule). New values still follow the rules; the server checks the same.
 */
export function isValid(form, saved = {}) {
  const changed = (field) => form[field].trim() !== (saved[field] || "").trim();
  if (changed("name") && form.name.trim().length <= 3) {
    showWarningToast(t("Salon name must contain more than 3 characters."));
    return false;
  }
  if (changed("description") && form.description.trim().length <= 10) {
    showWarningToast(t("Description must contain more than 10 characters."));
    return false;
  }
  if (form.openTime >= form.closeTime) {
    showWarningToast(t("Closing time must be later than opening time."));
    return false;
  }
  if (Number(form.maxNumOfEmployees) < 1) {
    showWarningToast(t("Team capacity must be at least one."));
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

  const persist = async (next, successMessage) => {
    if (!salon?.salonId || !isValid(next, toSalonForm(salon))) return false;
    try {
      setSaving(true);
      const response = await updateSalonApi(
        salon.salonId,
        toSalonPayload(next),
      );
      if (!response.success) {
        showErrorToast(response.message || t("Could not update salon."));
        return false;
      }
      const stored = response.data ? fromSalonResponse(response.data) : {};
      const updatedSalon = {
        ...salon,
        ...next,
        ...stored,
        salonId: salon.salonId,
        description: next.description,
        // A blank Arabic story is translated on the server in the background.
        descriptionAr: next.descriptionAr || salon.descriptionAr || "",
        // The server rebuilds the link from the coordinates; prefer its values.
        googleMapsUrl: response.data?.googleMapsUrl ?? next.googleMapsUrl,
        latitude: response.data?.latitude ?? next.latitude,
        longitude: response.data?.longitude ?? next.longitude,
        images: salon.images,
        state: salon.state,
      };
      setSavedSalon(updatedSalon);
      setDraft(toSalonForm(updatedSalon));
      showSuccessToast(successMessage);
      return true;
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          t("Could not update salon."),
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  const save = () => persist(form, t("Salon section updated."));

  /**
   * Saves only the map pin through its own endpoint, so other profile fields
   * never block it. Throws with the server message so the dialog can show it
   * (toasts render below a modal dialog).
   */
  const saveLocation = async ({ latitude, longitude, city }) => {
    if (!salon?.salonId) throw new Error(t("Salon not loaded yet."));
    setSaving(true);
    try {
      const response = await updateSalonLocationApi(salon.salonId, {
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        city: SALON_CITIES.includes(city) ? city : null,
      });
      if (!response.success || !response.data) {
        throw new Error(response.message || t("Could not save the location."));
      }
      const stored = response.data;
      const location = {
        city: stored.city,
        address: stored.address,
        latitude: stored.latitude,
        longitude: stored.longitude,
        googleMapsUrl: stored.googleMapsUrl,
      };
      setSavedSalon({ ...salon, ...location });
      // Keep any unsaved edits in other sections; only refresh location fields.
      setDraft((current) => (current ? { ...current, ...location } : current));
      showSuccessToast(
        latitude == null ? t("Map pin removed.") : t("Salon location saved."),
      );
      return true;
    } catch (error) {
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          t("Could not save the location."),
        { cause: error },
      );
    } finally {
      setSaving(false);
    }
  };

  const removeLocation = () =>
    saveLocation({ latitude: null, longitude: null });

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
    saveLocation,
    removeLocation,
  };
}
