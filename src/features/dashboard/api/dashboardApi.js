import httpClient from "../../../shared/api/httpClient.js";
import { requireData } from "../../../shared/api/response.js";
import { fromSalonResponse } from "../../salons/model/salonForm.js";

/** Salon, team, services, reviews and the bookings of one period. */
export async function getOwnerDashboardApi(signal, { from, to } = {}) {
  const response = await httpClient.get("/owner/dashboard", {
    signal,
    params: { from, to },
  });
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

/** Totals counted on the server for a period and the period it is compared with. */
export async function getOwnerDashboardSummaryApi(signal, params) {
  const response = await httpClient.get("/owner/dashboard/summary", {
    signal,
    params,
  });
  return requireData(
    response.data,
    "The dashboard totals could not be loaded.",
  );
}
