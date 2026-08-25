// src/pages/Notifications/NotificationsPage.jsx

import React, { useState, useEffect } from 'react';
import { 
  Bell, CheckCheck, Trash2, FileText, CheckCircle2, 
  XCircle, Info, Filter 
} from 'lucide-react';
import { 
  getNotifications, markAsRead, markAllAsRead, deleteNotification 
} from '../../services/notificationService';
import './Notifications.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const loadNotifications = () => {
    setNotifications(getNotifications());
  };

  useEffect(() => {
    loadNotifications();

    // Event listener for live updates
    window.addEventListener("notificationsUpdated", loadNotifications);
    return () => window.removeEventListener("notificationsUpdated", loadNotifications);
  }, []);

  const handleMarkRead = (id) => {
    markAsRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    loadNotifications();
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteNotification(id);
    loadNotifications();
  };

  const filteredList = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type) => {
    switch (type) {
      case 'application':
        return <div className="icon-box blue"><FileText size={18} /></div>;
      case 'approved':
        return <div className="icon-box green"><CheckCircle2 size={18} /></div>;
      case 'rejected':
        return <div className="icon-box red"><XCircle size={18} /></div>;
      default:
        return <div className="icon-box purple"><Info size={18} /></div>;
    }
  };

  return (
    <div className="notif-page-container">
      {/* Header */}
      <div className="notif-header">
        <div className="notif-title-area">
          <h2>Notifications</h2>
          {unreadCount > 0 && (
            <span className="unread-badge-count">{unreadCount} Unread</span>
          )}
        </div>

        <div className="notif-header-actions">
          <button className="btn-secondary" onClick={handleMarkAllRead}>
            <CheckCheck size={16} /> Mark all as read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="notif-filter-bar">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button 
          className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="notif-list">
        {filteredList.length === 0 ? (
          <div className="notif-empty-card">
            <Bell size={36} className="text-muted" />
            <p>No notifications to show</p>
          </div>
        ) : (
          filteredList.map((item) => (
            <div 
              key={item.id} 
              className={`notif-card ${!item.isRead ? 'unread' : ''}`}
              onClick={() => handleMarkRead(item.id)}
            >
              <div className="notif-left">
                {getIcon(item.type)}
                <div className="notif-content">
                  <div className="notif-title-row">
                    <h4>{item.title}</h4>
                    {!item.isRead && <span className="blue-dot"></span>}
                  </div>
                  <p>{item.message}</p>
                  <span className="notif-time">{item.timestamp}</span>
                </div>
              </div>

              <div className="notif-actions">
                <button 
                  className="btn-icon-delete"
                  title="Delete notification"
                  onClick={(e) => handleDelete(item.id, e)}
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
