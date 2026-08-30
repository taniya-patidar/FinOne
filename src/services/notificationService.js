// src/services/notificationService.js

const NOTIFICATION_KEY = "app_notifications";


// Get all notifications
export const getNotifications = () => {
  try {
    const data = localStorage.getItem(NOTIFICATION_KEY);

    if (!data) {
      return [];
    }

    const parsedData = JSON.parse(data);

    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.error("Failed to get notifications:", error);
    return [];
  }
};


// Add new notification
export const addNotification = (
  title,
  message,
  type = "application"
) => {
  try {
    const existingNotifications = getNotifications();

    const newNotification = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      type,
      isRead: false,
      timestamp: "Just now",
      createdAt: new Date().toISOString(),
    };

    const updatedNotifications = [
      newNotification,
      ...existingNotifications,
    ];

    localStorage.setItem(
      NOTIFICATION_KEY,
      JSON.stringify(updatedNotifications)
    );

    // Notify Header + Notification Page
    window.dispatchEvent(
      new Event("notificationsUpdated")
    );

    return newNotification;
  } catch (error) {
    console.error("Failed to add notification:", error);
    return null;
  }
};


// Mark one notification as read
export const markAsRead = (id) => {
  try {
    const notifications = getNotifications();

    const updatedNotifications = notifications.map(
      (notification) =>
        String(notification.id) === String(id)
          ? {
              ...notification,
              isRead: true,
            }
          : notification
    );

    localStorage.setItem(
      NOTIFICATION_KEY,
      JSON.stringify(updatedNotifications)
    );

    window.dispatchEvent(
      new Event("notificationsUpdated")
    );
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
};


// Mark all notifications as read
export const markAllAsRead = () => {
  try {
    const notifications = getNotifications();

    const updatedNotifications = notifications.map(
      (notification) => ({
        ...notification,
        isRead: true,
      })
    );

    localStorage.setItem(
      NOTIFICATION_KEY,
      JSON.stringify(updatedNotifications)
    );

    window.dispatchEvent(
      new Event("notificationsUpdated")
    );
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
  }
};


// Delete notification
export const deleteNotification = (id) => {
  try {
    const notifications = getNotifications();

    const updatedNotifications = notifications.filter(
      (notification) =>
        String(notification.id) !== String(id)
    );

    localStorage.setItem(
      NOTIFICATION_KEY,
      JSON.stringify(updatedNotifications)
    );

    window.dispatchEvent(
      new Event("notificationsUpdated")
    );
  } catch (error) {
    console.error("Failed to delete notification:", error);
  }
};


// Get unread notification count
export const getUnreadCount = () => {
  const notifications = getNotifications();

  return notifications.filter(
    (notification) => !notification.isRead
  ).length;
};