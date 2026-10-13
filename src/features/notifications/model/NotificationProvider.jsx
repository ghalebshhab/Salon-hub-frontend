import { useCallback, useEffect, useState } from "react";
import { requireData } from "../../../shared/api/response.js";
import { NotificationContext } from "../context/NotificationContext.js";
import {
  getNotificationsApi,
  getUnreadNotificationCountApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
} from "../api/notificationsApi.js";

export function NotificationProvider({ children, enabled = true }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshUnreadCount = useCallback(async (config = {}) => {
    const response = await getUnreadNotificationCountApi(config);
    const data = requireData(response, "Unable to load unread notifications");
    setUnreadCount(Number(data?.unreadCount) || 0);
    return data;
  }, []);

  const loadNotifications = useCallback(
    async ({ page = 0, append = false, signal } = {}) => {
      setLoading(true);
      setError("");
      try {
        const response = await getNotificationsApi(
          { page, size: 20 },
          { signal },
        );
        const data = requireData(response, "Unable to load notifications");
        const items = Array.isArray(data?.content) ? data.content : [];
        setNotifications((current) => {
          if (!append) return items;
          const existingIds = new Set(current.map((item) => item.id));
          return [
            ...current,
            ...items.filter((item) => !existingIds.has(item.id)),
          ];
        });
        setPageInfo(data);
        return data;
      } catch (loadError) {
        if (
          loadError?.name !== "CanceledError" &&
          loadError?.name !== "AbortError"
        ) {
          setError(loadError?.message || "Unable to load notifications");
        }
        throw loadError;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const markAsRead = useCallback(
    async (notificationId) => {
      const response = await markNotificationReadApi(notificationId);
      const updated = requireData(response, "Unable to update notification");
      setNotifications((current) =>
        current.map((notification) => {
          if (notification.id !== notificationId) return notification;
          return { ...notification, ...updated, read: true };
        }),
      );
      await refreshUnreadCount().catch(() => {});
      return updated;
    },
    [refreshUnreadCount],
  );

  const markAllAsRead = useCallback(async () => {
    const response = await markAllNotificationsReadApi();
    const data = requireData(response, "Unable to update notifications");
    setUnreadCount(Number(data?.unreadCount) || 0);
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    );
    return data;
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    const controller = new AbortController();
    const refresh = () =>
      refreshUnreadCount({ signal: controller.signal }).catch(() => {});
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") refresh();
    };
    refresh();
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, 30_000);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      controller.abort();
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [enabled, refreshUnreadCount]);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        pageInfo,
        loading,
        error,
        refreshUnreadCount,
        loadNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
