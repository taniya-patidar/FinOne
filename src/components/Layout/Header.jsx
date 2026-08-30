import React, { useEffect, useState } from "react";

import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getUnreadCount,
} from "../../services/notificationService";

import "./Header.css";


const Header = ({
  onToggleSidebar,
  darkMode,
  setDarkMode,
}) => {

  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);


  // Load unread notification count
  const loadUnreadCount = () => {

    const count = getUnreadCount();

    setUnreadCount(count);
  };


  // Initial load + live updates
  useEffect(() => {

    loadUnreadCount();

    const handleNotificationsUpdate = () => {
      loadUnreadCount();
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


  // Open notification page
  const handleNotificationClick = () => {

    navigate("/notifications");
  };


  return (

    <header className="header">

      {/* Left Section */}

      <div className="header-left">

        <button
          onClick={onToggleSidebar}
          className="icon-btn"
        >
          <Menu className="icon" />
        </button>


        <div className="search-container">

          <Search className="search-icon" />

          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />

        </div>

      </div>


      {/* Right Section */}

      <div className="header-right">

        {/* Dark Mode */}

        <button
          onClick={() =>
            setDarkMode(!darkMode)
          }
          className="icon-btn"
        >

          {darkMode ? (
            <Sun className="icon sun-icon" />
          ) : (
            <Moon className="icon" />
          )}

        </button>


        {/* Notifications */}

        <button
          className="icon-btn notification-btn"
          onClick={handleNotificationClick}
          title="Notifications"
        >

          <Bell className="icon" />


          {unreadCount > 0 && (

            <span className="badge">
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>

          )}

        </button>


        {/* User */}

        <div className="user-profile">

          <div className="avatar">

            <User
              style={{
                width: "1rem",
                height: "1rem",
              }}
            />

          </div>


          <span className="user-name">
            Admin
          </span>

        </div>

      </div>

    </header>
  );
};


export default Header;