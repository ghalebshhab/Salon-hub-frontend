import { Bell, CheckCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext.js";
import {
  formatNotificationDate,
  getNotificationTitle,
} from "../model/notification.js";

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const {
    unreadCount,
    notifications,
    loading,
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  useEffect(() => {
    if (!open) return undefined;
    loadNotifications().catch(() => {});
    const closeOnOutsideClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    const refreshInterval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        loadNotifications().catch(() => {});
      }
    }, 30_000);
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      window.clearInterval(refreshInterval);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, loadNotifications]);

  const openNotification = async (notification) => {
    try {
      if (!notification.read) await markAsRead(notification.id);
    } catch {
      // The destination is still useful when marking the item read fails.
    }
    setOpen(false);
    const target = notification.targetPath;
    navigate(
      typeof target === "string" &&
        target.startsWith("/") &&
        !target.startsWith("//")
        ? target
        : "/my-bookings",
    );
  };

  const markAll = async () => {
    try {
      await markAllAsRead();
    } catch {
      // Keep the inbox open; the current unread state remains visible for retry.
    }
  };

  return (
    <div className="notification-bell-wrap" ref={wrapperRef}>
      <button
        className="notification-bell-button"
        type="button"
        aria-label={
          unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"
        }
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="notification-unread-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <section
          className="notification-popover"
          aria-label="Notifications"
          role="dialog"
        >
          <header className="notification-popover-header">
            <div>
              <h2>Notifications</h2>
              <span>
                {unreadCount ? `${unreadCount} unread` : "You're all caught up"}
              </span>
            </div>
            <button
              type="button"
              className="notification-mark-all"
              onClick={markAll}
              disabled={!unreadCount}
            >
              <CheckCheck size={16} /> Mark all read
            </button>
          </header>
          {loading && notifications.length === 0 ? (
            <p className="notification-feedback">Loading notifications…</p>
          ) : error && notifications.length === 0 ? (
            <p className="notification-feedback notification-feedback-error">
              {error}
            </p>
          ) : notifications.length === 0 ? (
            <p className="notification-feedback">
              Booking updates will appear here.
            </p>
          ) : (
            <div className="notification-list">
              {notifications.slice(0, 8).map((notification) => (
                <button
                  className={`notification-item${notification.read ? " is-read" : " is-unread"}`}
                  type="button"
                  key={notification.id}
                  onClick={() => openNotification(notification)}
                >
                  <span className="notification-item-dot" aria-hidden="true" />
                  <span className="notification-item-copy">
                    <strong>
                      {getNotificationTitle(notification.eventType)}
                    </strong>
                    <span>{notification.message}</span>
                    <time dateTime={notification.createdAt}>
                      {formatNotificationDate(notification.createdAt)}
                    </time>
                  </span>
                </button>
              ))}
            </div>
          )}
          <button
            className="notification-view-all"
            type="button"
            onClick={() => {
              setOpen(false);
              navigate("/notifications");
            }}
          >
            View all notifications
          </button>
        </section>
      )}
    </div>
  );
}

export default NotificationBell;
