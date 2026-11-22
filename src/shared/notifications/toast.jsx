import { toast } from "react-toastify";
import AppToast from "../components/AppToast.jsx";
import { getApiErrorMessage } from "../api/response.js";
import t from "../i18n/t.js";

// Same type + title + message = same toastId. While one is on screen,
// react-toastify ignores the copies (for example, when several requests
// fail together because the backend is down).
const show = (type, title, message) => {
  const toastId = `${type}:${title}:${message}`;
  if (toast.isActive(toastId)) return;
  toast[type](<AppToast type={type} title={t(title)} message={t(message)} />, {
    closeButton: false,
    icon: false,
    toastId,
  });
};

export const showSuccessToast = (message, title = t("Success")) =>
  show("success", title, message);

export const showErrorToast = (message, title = t("Something went wrong")) =>
  show("error", title, message);

export const showApiErrorToast = (
  error,
  fallback,
  title = t("Something went wrong"),
) => showErrorToast(getApiErrorMessage(error, fallback), title);

export const showInfoToast = (message, title = t("Note")) =>
  show("info", title, message);

export const showWarningToast = (message, title = t("Warning")) =>
  show("warning", title, message);
