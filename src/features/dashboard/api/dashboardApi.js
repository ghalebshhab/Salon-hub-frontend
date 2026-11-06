import httpClient from "../../../shared/api/httpClient.js";
import { requireData } from "../../../shared/api/response.js";
import { fromSalonResponse } from "../../salons/model/salonForm.js";

export async function getOwnerDashboardApi(signal) {
  const response = await httpClient.get("/owner/dashboard", { signal });
  const dashboard = requireData(
    response.data,
    "The owner dashboard could not be loaded.",
  );
  return {
    ...dashboard,
    salon: fromSalonResponse(dashboard.salon),
    bookings: dashboard.bookings || [],
    employees: dashboard.employees || [],
    services: dashboard.services || [],
    reviews: dashboard.reviews || [],
    reviewSummary: dashboard.reviewSummary || {},
  };
}
