import { getMySalonBookingsApi } from "../../bookings/api/bookingApi.js";
import { getMySalonEmployeesApi } from "../../employees/api/salonEmployeesApi.js";
import {
  getSalonReviewsApi,
  getSalonReviewSummaryApi,
} from "../../reviews/api/reviewApi.js";
import { getMySalonApi } from "../../salons/api/salonApi.js";
import { getMySalonServicesApi } from "../../services/api/salonServicesApi.js";
import { requireData } from "../../../shared/api/response.js";

export async function getOwnerDashboardApi(signal) {
  const config = { signal };
  const [salonResponse, bookingsResponse, employeesResponse, servicesResponse] =
    await Promise.all([
      getMySalonApi(config),
      getMySalonBookingsApi(config),
      getMySalonEmployeesApi(config),
      getMySalonServicesApi(config),
    ]);

  const salon = requireData(salonResponse, "Your salon could not be loaded.");
  const salonId = salon?.salonId ?? salon?.id;
  const [reviewsResponse, reviewSummaryResponse] = await Promise.all([
    getSalonReviewsApi(salonId, config),
    getSalonReviewSummaryApi(salonId, config),
  ]);

  return {
    salon,
    bookings: requireData(bookingsResponse, "Bookings could not be loaded.") || [],
    employees: requireData(employeesResponse, "Employees could not be loaded.") || [],
    services: requireData(servicesResponse, "Services could not be loaded.") || [],
    reviews: requireData(reviewsResponse, "Reviews could not be loaded.") || [],
    reviewSummary:
      requireData(reviewSummaryResponse, "Rating summary could not be loaded.") || {},
  };
}
