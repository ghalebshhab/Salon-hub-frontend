const STATUS_MESSAGES = {
  400: "The request contains invalid information. Please review it and try again.",
  401: "Your session is missing or expired. Please sign in and try again.",
  403: "Your account does not have permission to perform this action.",
  404: "The requested information could not be found.",
  409: "This action conflicts with the latest saved information. Refresh and try again.",
  429: "Too many requests were sent. Please wait a moment and try again.",
  500: "The server could not complete this request. Please try again shortly.",
  502: "The service is temporarily unavailable. Please try again shortly.",
  503: "The service is temporarily unavailable. Please try again shortly.",
  504: "The server took too long to respond. Please try again.",
};

const hasText = (value) => typeof value === "string" && value.trim();

function validationMessage(errors) {
  if (!Array.isArray(errors)) return "";
  return errors
    .map((item) =>
      hasText(item) ? item.trim() : item?.defaultMessage || item?.message,
    )
    .filter(hasText)
    .join(" ");
}

export function getApiErrorMessage(
  error,
  fallback = "The request could not be completed.",
) {
  const payload = error?.response?.data;
  const apiMessage =
    (hasText(payload?.message) && payload.message.trim()) ||
    validationMessage(payload?.errors) ||
    (hasText(payload?.error) && payload.error.trim());

  if (apiMessage) return apiMessage;
  if (error?.code === "ECONNABORTED")
    return "The request timed out. Check your connection and try again.";
  if (!error?.response && (error?.request || error?.code === "ERR_NETWORK"))
    return "The server could not be reached. Check your connection and try again.";

  const statusMessage = STATUS_MESSAGES[error?.response?.status];
  if (statusMessage) return statusMessage;
  if (hasText(error?.message) && error.message !== "Network Error")
    return error.message.trim();
  return fallback;
}

export function requireData(response, fallback = "Request failed") {
  if (!response?.success) throw new Error(response?.message || fallback);
  return response.data;
}
