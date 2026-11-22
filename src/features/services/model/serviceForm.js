import t from "../../../shared/i18n/t.js";
export function validateService(form) {
  if (!form.name.trim()) return t("Service name is required");
  if (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0)
    return t("Price must be greater than 0");
  if (
    !Number.isFinite(Number(form.durationMinutes)) ||
    Number(form.durationMinutes) <= 0
  )
    return t("Duration must be greater than 0");
  return null;
}
export function toServicePayload(form) {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    // Blank Arabic asks the server to translate the English with Claude.
    ...(Object.hasOwn(form, "nameAr") ? { nameAr: form.nameAr.trim() } : {}),
    ...(Object.hasOwn(form, "descriptionAr")
      ? { descriptionAr: form.descriptionAr.trim() }
      : {}),
    price: Number(form.price),
    durationMinutes: Number(form.durationMinutes),
    ...(Object.hasOwn(form, "isActive") ? { isActive: form.isActive } : {}),
  };
}
