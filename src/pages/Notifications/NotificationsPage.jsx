// src/pages/Notifications/NotificationsPage.jsx

import React, { useEffect, useState } from "react";

import {
  Bell,
  CheckCheck,
  Trash2,
  FileText,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../../services/notificationService";

import "./Notifications.css";


const NotificationsPage = () => {

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");


  // Load notifications
  const loadNotifications = () => {
    const data = getNotifications();

    setNotifications(data);
  };


  // Initial load + live updates
  useEffect(() => {

    loadNotifications();

    const handleNotificationsUpdate = () => {
      loadNotifications();
    };

    window.addEventListener(
      "notificationsUpdated",
      handleNotificationsUpdate
    );

    return () => {
      window.removeEventListener(
        "notificationsUpdated",
        handleNotificationsUpdate
      );
    };

  }, []);


  // Mark single notification as read
  const handleMarkRead = (id) => {

    markAsRead(id);

    loadNotifications();
  };


  // Mark all as read
  const handleMarkAllRead = () => {

    markAllAsRead();

    loadNotifications();
  };


  // Delete notification
  const handleDelete = (id, event) => {

    event.stopPropagation();

    deleteNotification(id);

    loadNotifications();
  };


  // Filter notifications
  const filteredNotifications =
    notifications.filter((notification) => {

      if (filter === "unread") {
        return !notification.isRead;
      }

      return true;
    });


  // Unread count
  const unreadCount =
    notifications.filter(
      (notification) => !notification.isRead
    ).length;


  // Notification icon
  const getIcon = (type) => {

    switch (type) {

      case "application":
        return (
          <div className="icon-box blue">
            <FileText size={18} />
          </div>
        );


      case "approved":
        return (
          <div className="icon-box green">
            <CheckCircle2 size={18} />
          </div>
        );


      case "rejected":
        return (
          <div className="icon-box red">
            <XCircle size={18} />
          </div>
        );


      default:
        return (
          <div className="icon-box purple">
            <Info size={18} />
          </div>
        );
    }
  };


  return (

    <div className="notif-page-container">

      {/* Header */}

      <div className="notif-header">

        <div className="notif-title-area">

          <h2>Notifications</h2>

          {unreadCount > 0 && (
            <span className="unread-badge-count">
              {unreadCount} Unread
            </span>
          )}

        </div>


        <div className="notif-header-actions">

          {unreadCount > 0 && (

            <button
              className="btn-secondary"
              onClick={handleMarkAllRead}
            >
              <CheckCheck size={16} />

              Mark all as read
            </button>

          )}

        </div>

      </div>


      {/* Filter */}

      <div className="notif-filter-bar">

        <button
          className={`filter-tab ${
            filter === "all" ? "active" : ""
          }`}
          onClick={() => setFilter("all")}
        >
          All ({notifications.length})
        </button>


        <button
          className={`filter-tab ${
            filter === "unread" ? "active" : ""
          }`}
          onClick={() => setFilter("unread")}
        >
          Unread ({unreadCount})
        </button>

      </div>


      {/* Notification List */}

      <div className="notif-list">

        {filteredNotifications.length === 0 ? (

          <div className="notif-empty-card">

            <Bell
              size={36}
              className="text-muted"
            />

            <p>
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications to show"}
            </p>

          </div>

        ) : (

          filteredNotifications.map((notification) => (

            <div
              key={notification.id}
              className={`notif-card ${
                !notification.isRead
                  ? "unread"
                  : ""
              }`}
              onClick={() =>
                handleMarkRead(notification.id)
              }
            >

              <div className="notif-left">

                {getIcon(notification.type)}


                <div className="notif-content">

                  <div className="notif-title-row">

                    <h4>
                      {notification.title}
                    </h4>


                    {!notification.isRead && (
                      <span className="blue-dot"></span>
                    )}

                  </div>


                  <p>
                    {notification.message}
                  </p>


                  <span className="notif-time">
                    {notification.timestamp}
                  </span>

                </div>

              </div>


              <div className="notif-actions">

                <button
                  className="btn-icon-delete"
                  title="Delete notification"
                  onClick={(event) =>
                    handleDelete(
                      notification.id,
                      event
                    )
                  }
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
};


export default NotificationsPage;