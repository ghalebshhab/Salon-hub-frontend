import { createContext, useContext } from "react";
import t from "../../../shared/i18n/t.js";

export const NotificationContext = createContext(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      t("useNotifications must be used within NotificationProvider"),
    );
  return context;
}
