import React, { useState, useEffect } from "react";
import "./RecentNotification.css";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Clock3,
  XCircle,
  UserPlus,
  CreditCard,
  Bell,
  FileText,
} from "lucide-react";
import { getNotifications } from "../../../services/notificationService";

function RecentNotification() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  // Type ke hisab se exact icon pick hoga
  const renderIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "approved":
      case "success":
        return <CheckCircle size={18} />;
      case "rejected":
      case "danger":
        return <XCircle size={18} />;
      case "application":
        return <FileText size={18} />;
      case "warning":
      case "pending":
        return <Clock3 size={18} />;
      case "payment":
      case "info":
        return <CreditCard size={18} />;
      default:
        return <Bell size={18} />;
    }
  };

  const loadNotifications = () => {
    // Direct service se data read hoga
    const data = getNotifications();

    const formatted = data.map((item, idx) => ({
      id: item.id || idx + 1,
      title: item.title || "Notification",
      message: item.message || "",
      time: item.timestamp || "Just now",
      type: (item.type || "info").toLowerCase(),
      isRead: item.isRead,
    }));

    // Dashboard ke liye strictly pehli 5 notifications
    setNotifications(formatted.slice(0, 5));
  };

  useEffect(() => {
    loadNotifications();

    // Service file ke dispatchEvent events ko listen karein
    window.addEventListener("notificationsUpdated", loadNotifications);
    window.addEventListener("storage", loadNotifications);
    window.addEventListener("focus", loadNotifications);

    return () => {
      window.removeEventListener("notificationsUpdated", loadNotifications);
      window.removeEventListener("storage", loadNotifications);
      window.removeEventListener("focus", loadNotifications);
    };
  }, []);

  return (
    <div className="notification-card">
      <div className="notification-header">
        <h3>Recent Notifications</h3>
        <button
          className="view-all-btn"
          onClick={() => navigate("/notifications")}
        >
          View All
        </button>
      </div>

      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <div
              className={`notification-item ${!item.isRead ? "unread" : ""}`}
              key={item.id}
            >
              <div className={`notification-icon ${item.type}`}>
                {renderIcon(item.type)}
              </div>

              <div className="notification-content">
                <h4>{item.title}</h4>
                <p>{item.message}</p>
              </div>

              <span className="notification-time">{item.time}</span>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "20px", color: "#888" }}>
            <Bell size={24} style={{ marginBottom: "8px", opacity: 0.6 }} />
            <p>No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentNotification;