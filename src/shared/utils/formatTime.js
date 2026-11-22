import { dateLocale } from "../i18n/language.js";
export const formatTime = (time) => {
  if (!time) return "";
  return time.toString().slice(0, 5);
};

export const formatDateTime = (dateTime) => {
  if (!dateTime) return "";
  return new Date(dateTime).toLocaleString(dateLocale());
};
