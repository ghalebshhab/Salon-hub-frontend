import { CheckCheck, ChevronDown, Bell } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext.js";
import {
  formatNotificationDate,
  getNotificationTitle,
} from "../model/notification.js";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const {
    unreadCount,
    notifications,
    pageInfo,
    loading,
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  useEffect(() => {
    loadNotifications().catch(() => {});
  }, [loadNotifications, unreadCount]);

  const openNotification = async (notification) => {
    try {
      if (!notification.read) await markAsRead(notification.id);
    } catch {
      // The destination is still useful when marking the item read fails.
    }
    const target = notification.targetPath;
    navigate(
      typeof target === "string" &&
        target.startsWith("/") &&
        !target.startsWith("//")
        ? target
        : "/my-bookings",
    );
  };

  return (
    <section className="notifications-page container">
      <header className="notifications-page-header">
        <div className="notifications-page-title">
          <span className="notifications-page-icon">
            <Bell size={22} />
          </span>
          <div>
            <p className="notifications-eyebrow">SALONHUP UPDATES</p>
            <h1>Notifications</h1>
            <p>Keep up with changes to your bookings.</p>
          </div>
        </div>
        <button
          className="notification-mark-all page-mark-all"
          type="button"
          onClick={() => markAllAsRead().catch(() => {})}
          disabled={!unreadCount}
        >
          <CheckCheck size={17} /> Mark all as read
        </button>
      </header>
      {error && (
        <p className="notifications-page-error" role="alert">
          {error}
        </p>
      )}
      {loading && notifications.length === 0 ? (
        <div className="notifications-page-empty">
          Loading your notifications…
        </div>
      ) : notifications.length === 0 ? (
        <div className="notifications-page-empty">
          <Bell size={27} />
          <h2>Nothing new yet</h2>
          <p>Booking decisions and updates from your salon will show here.</p>
        </div>
      ) : (
        <div className="notifications-page-list">
          {notifications.map((notification) => (
            <button
              className={`notifications-page-item${notification.read ? " is-read" : " is-unread"}`}
              type="button"
              key={notification.id}
              onClick={() => openNotification(notification)}
            >
              <span className="notification-item-dot" aria-hidden="true" />
              <span className="notifications-page-item-copy">
                <span className="notifications-page-item-heading">
                  <strong>
                    {getNotificationTitle(notification.eventType)}
                  </strong>
                  <time dateTime={notification.createdAt}>
                    {formatNotificationDate(notification.createdAt)}
                  </time>
                </span>
                <span>{notification.message}</span>
                <span className="notifications-page-salon">
                  {notification.salonName}
                </span>
              </span>
              <ChevronDown size={17} className="notifications-page-arrow" />
            </button>
          ))}
        </div>
      )}
      {pageInfo && !pageInfo.last && (
        <button
          className="notifications-load-more"
          type="button"
          disabled={loading}
          onClick={() =>
            loadNotifications({ page: pageInfo.page + 1, append: true }).catch(
              () => {},
            )
          }
        >
          {loading ? "Loading…" : "Load more"}
        </button>
      )}
    </section>
  );
}
