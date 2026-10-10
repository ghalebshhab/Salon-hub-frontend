export function validateService(form) {
  if (!form.name.trim()) return "Service name is required";
  if (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0)
    return "Price must be greater than 0";
  if (
    !Number.isFinite(Number(form.durationMinutes)) ||
    Number(form.durationMinutes) <= 0
  )
    return "Duration must be greater than 0";
  return null;
}
export function toServicePayload(form) {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    durationMinutes: Number(form.durationMinutes),
    ...(Object.hasOwn(form, "isActive") ? { isActive: form.isActive } : {}),
  };
}
