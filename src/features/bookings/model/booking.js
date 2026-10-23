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

export function getEarliestBookingTime(date = new Date()) {
  const earliest = new Date(date);
  earliest.setSeconds(0, 0);
  earliest.setMinutes(earliest.getMinutes() + 1);
  return `${String(earliest.getHours()).padStart(2, "0")}:${String(earliest.getMinutes()).padStart(2, "0")}`;
}

export function canEmployeePerformServices(employee, serviceIds) {
  if (!serviceIds.length) return true;
  const capabilities = new Set((employee.serviceIds || []).map(Number));
  return serviceIds.every((serviceId) => capabilities.has(Number(serviceId)));
}

export function getEligibleEmployees(booking, employees) {
  const serviceIds =
    booking.services?.map((service) => service.serviceId ?? service.id) || [];
  return employees.filter((employee) =>
    canEmployeePerformServices(employee, serviceIds),
  );
}
