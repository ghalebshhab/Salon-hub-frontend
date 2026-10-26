import { toast } from "react-toastify";
import AppToast from "../components/AppToast.jsx";
import { getApiErrorMessage } from "../api/response.js";

const toastOptions = {
  closeButton: false,
  icon: false,
};

export const showSuccessToast = (message, title = "Success") => {
  toast.success(
    <AppToast type="success" title={title} message={message} />,
    toastOptions,
  );
};

export const showErrorToast = (message, title = "Something went wrong") => {
  toast.error(
    <AppToast type="error" title={title} message={message} />,
    toastOptions,
  );
};

export const showApiErrorToast = (
  error,
  fallback,
  title = "Something went wrong",
) => showErrorToast(getApiErrorMessage(error, fallback), title);

export const showInfoToast = (message, title = "Note") => {
  toast.info(
    <AppToast type="info" title={title} message={message} />,
    toastOptions,
  );
};

export const showWarningToast = (message, title = "Warning") => {
  toast.warning(
    <AppToast type="warning" title={title} message={message} />,
    toastOptions,
  );
};
