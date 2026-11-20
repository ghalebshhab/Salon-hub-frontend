import httpClient from "../../../shared/api/httpClient.js";
import { requireData } from "../../../shared/api/response.js";

/** The owner's salon plan: plan in use, status, days left and limits. */
export async function getMySubscriptionApi(signal) {
  const response = await httpClient.get("/owner/subscription", { signal });
  return requireData(response.data, "Your plan could not be loaded.");
}

/** The public price list of every plan. */
export async function getSubscriptionPlansApi(signal) {
  const response = await httpClient.get("/subscription-plans", { signal });
  return requireData(response.data, "The plans could not be loaded.");
}

/** Asks for a paid plan; an admin turns it on after the payment. */
export async function requestPlanApi(payload) {
  const response = await httpClient.post(
    "/owner/subscription/requests",
    payload,
  );
  return requireData(response.data, "Your request could not be sent.");
}

/** Cancels a request that is still waiting. */
export async function cancelPlanRequestApi(requestId) {
  const response = await httpClient.delete(
    `/owner/subscription/requests/${requestId}`,
  );
  return requireData(response.data, "Your request could not be cancelled.");
}
