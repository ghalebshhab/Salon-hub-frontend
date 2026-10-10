const STATUS_CLASSES = {
  ACCEPTED: "active-tag",
  PENDING: "pending-tag",
  COMPLETED: "active-tag",
  REJECTED: "inactive-tag",
  CANCELLED: "inactive-tag",
};
export const getStatusClass = (status) =>
  STATUS_CLASSES[status] || "pending-tag";
export const canCancel = (booking) =>
  ["PENDING", "ACCEPTED"].includes(booking.status);
export function getTodayDate(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}
