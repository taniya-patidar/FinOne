// src/services/notificationService.js

const NOTIFICATION_KEY = "app_notifications";

// Initial Default Notifications agar LocalStorage khali ho
const initialNotifications = [
  {
    id: "NOTIF-101",
    title: "New Application Received",
    message: "Rahul Sharma applied for Home Loan of ₹25,00,000",
    type: "application",
    isRead: false,
    timestamp: "10 mins ago",
    createdAt: new Date().toISOString()
  },
  {
    id: "NOTIF-102",
    title: "Loan Sanctioned",
    message: "Application LA-10205 for Neha Verma was Approved",
    type: "approved",
    isRead: false,
    timestamp: "2 hours ago",
    createdAt: new Date().toISOString()
  },
  {
    id: "NOTIF-103",
    title: "Application Rejected",
    message: "Application LA-10108 rejected due to low CIBIL score",
    type: "rejected",
    isRead: true,
    timestamp: "1 day ago",
    createdAt: new Date().toISOString()
  }
];

// 1. Get All Notifications
export const getNotifications = () => {
  const data = localStorage.getItem(NOTIFICATION_KEY);
  if (!data) {
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(initialNotifications));
    return initialNotifications;
  }
  return JSON.parse(data);
};

// 2. Add New Notification (Dynamic Trigger Function)
// 2. Add New Notification (Dynamic Trigger Function)
export const addNotification = (title, message, type = "application") => {
  const existing = JSON.parse(localStorage.getItem("notifications") || "[]");
  
  const newNotif = {
    id: Date.now(),
    title,
    message,
    type,
    read: false,
    timestamp: new Date().toISOString(),
  };

  localStorage.setItem("notifications", JSON.stringify([newNotif, ...existing]));
};

// 3. Mark Single as Read
export const markAsRead = (id) => {
  const currentNotifs = getNotifications();
  const updated = currentNotifs.map(n => n.id === id ? { ...n, isRead: true } : n);
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("notificationsUpdated"));
};

// 4. Mark All as Read
export const markAllAsRead = () => {
  const currentNotifs = getNotifications();
  const updated = currentNotifs.map(n => ({ ...n, isRead: true }));
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("notificationsUpdated"));
};

// 5. Delete Notification
export const deleteNotification = (id) => {
  const currentNotifs = getNotifications();
  const updated = currentNotifs.filter(n => n.id !== id);
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("notificationsUpdated"));
};