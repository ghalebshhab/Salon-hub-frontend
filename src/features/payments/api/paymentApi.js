import httpClient from "../../../shared/api/httpClient.js";

const quiet = { showLoading: false };

/** Public: the methods a customer can choose at this salon. */
export const getPaymentOptionsApi = async (salonId, config = {}) => {
  const response = await httpClient.get(`/salons/${salonId}/payment-options`, {
    ...config,
    ...quiet,
  });
  return response.data;
};

/** Receipt and payment state for the customer, the employee or the owner. */
export const getBookingPaymentApi = async (bookingId, config = {}) => {
  const response = await httpClient.get(`/bookings/${bookingId}/payment`, {
    ...config,
    ...quiet,
  });
  return response.data;
};

/** The assigned employee or the owner records that the customer paid cash. */
export const recordCashPaymentApi = async (bookingId) => {
  const response = await httpClient.post(
    `/bookings/${bookingId}/payment/cash`,
    null,
    quiet,
  );
  return response.data;
};

/**
 * Only the salon owner confirms that a CliQ transfer arrived. The reference
 * (the bank's transfer number) is optional.
 */
export const recordCliqPaymentApi = async (bookingId, reference) => {
  const response = await httpClient.post(
    `/bookings/${bookingId}/payment/cliq`,
    reference ? { reference } : null,
    quiet,
  );
  return response.data;
};

/** The customer moves an unpaid booking between cash and CliQ. */
export const changePaymentMethodApi = async (bookingId, method) => {
  const response = await httpClient.put(
    `/bookings/${bookingId}/payment/method`,
    { method },
  );
  return response.data;
};

export const getPaymentSettingsApi = async (salonId, config = {}) => {
  const response = await httpClient.get(`/salons/${salonId}/payment-settings`, {
    ...config,
    ...quiet,
  });
  return response.data;
};

export const updatePaymentSettingsApi = async (salonId, settings) => {
  const response = await httpClient.put(
    `/salons/${salonId}/payment-settings`,
    settings,
  );
  return response.data;
};

export const getOwnerPaymentSummaryApi = async (
  { from, to } = {},
  config = {},
) => {
  const response = await httpClient.get("/owner/payments/summary", {
    ...config,
    ...quiet,
    params: { from: from || undefined, to: to || undefined },
  });
  return response.data;
};

export const getOwnerOutstandingPaymentsApi = async (
  { page = 0, size = 20 } = {},
  config = {},
) => {
  const response = await httpClient.get("/owner/payments/outstanding", {
    ...config,
    ...quiet,
    params: { page, size },
  });
  return response.data;
};
