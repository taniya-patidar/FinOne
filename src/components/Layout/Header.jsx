
import React, {
  useEffect,
  useState,
} from "react";

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

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [currentUser, setCurrentUser] =
    useState(null);

  /*
   * ============================================================
   * LOAD CURRENT USER
   * ============================================================
   */

  const loadCurrentUser = () => {

    try {

      const savedUser =
        localStorage.getItem(
          "currentUser"
        );

      if (!savedUser) {

        setCurrentUser(null);

        return;
      }

      const parsedUser =
        JSON.parse(savedUser);

      setCurrentUser(parsedUser);

    } catch (error) {

      console.error(
        "Failed to load current user:",
        error
      );

      setCurrentUser(null);
    }
  };

  /*
   * ============================================================
   * LOAD UNREAD NOTIFICATIONS
   * ============================================================
   */

  const loadUnreadCount = () => {

    try {

      const count =
        getUnreadCount();

      setUnreadCount(
        Number.isFinite(count)
          ? count
          : 0
      );

    } catch (error) {

      console.error(
        "Failed to load unread notifications:",
        error
      );

      setUnreadCount(0);
    }
  };

  /*
   * ============================================================
   * INITIAL LOAD + LIVE SYNC
   * ============================================================
   */

  useEffect(() => {

    loadCurrentUser();
    loadUnreadCount();

    const handleNotificationsUpdate =
      () => {
        loadUnreadCount();
      };

    const handleCurrentUserUpdate =
      () => {
        loadCurrentUser();
      };

    window.addEventListener(
      "notificationsUpdated",
      handleNotificationsUpdate
    );

    window.addEventListener(
      "currentUserUpdated",
      handleCurrentUserUpdate
    );

    window.addEventListener(
      "storage",
      handleCurrentUserUpdate
    );

    return () => {

      window.removeEventListener(
        "notificationsUpdated",
        handleNotificationsUpdate
      );

      window.removeEventListener(
        "currentUserUpdated",
        handleCurrentUserUpdate
      );

      window.removeEventListener(
        "storage",
        handleCurrentUserUpdate
      );
    };

  }, []);

  /*
   * ============================================================
   * NOTIFICATION CLICK
   * ============================================================
   */

  const handleNotificationClick = () => {

    navigate(
      "/notifications"
    );
  };

  /*
   * ============================================================
   * USER DISPLAY NAME
   * ============================================================
   */

  const displayName =
    currentUser?.fullName ||
    currentUser?.name ||
    currentUser?.username ||
    currentUser?.email?.split("@")[0] ||
    "Admin";

  /*
   * ============================================================
   * USER INITIAL
   * ============================================================
   */

  const userInitial =
    displayName
      .trim()
      .charAt(0)
      .toUpperCase() || "U";

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (

    <header className="header">

      {/* ======================================================
          LEFT SECTION
          ====================================================== */}

      <div className="header-left">

        <button
          onClick={
            onToggleSidebar
          }
          className="icon-btn"
          title="Toggle Sidebar"
          aria-label="Toggle Sidebar"
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

      {/* ======================================================
          RIGHT SECTION
          ====================================================== */}

      <div className="header-right">

        {/* ====================================================
            DARK MODE
            ==================================================== */}

        <button
          onClick={() =>
            setDarkMode(
              !darkMode
            )
          }
          className="icon-btn"
          title={
            darkMode
              ? "Switch to Light Mode"
              : "Switch to Dark Mode"
          }
          aria-label={
            darkMode
              ? "Switch to Light Mode"
              : "Switch to Dark Mode"
          }
        >

          {darkMode ? (
            <Sun className="icon sun-icon" />
          ) : (
            <Moon className="icon" />
          )}

        </button>

        {/* ====================================================
            NOTIFICATIONS
            ==================================================== */}

        <button
          className="icon-btn notification-btn"
          onClick={
            handleNotificationClick
          }
          title="Notifications"
          aria-label="Notifications"
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

        {/* ====================================================
            USER PROFILE
            ==================================================== */}

        <div
          className="user-profile"
          title={`Logged in as ${displayName}`}
        >

          <div className="avatar">

            {currentUser?.avatar ? (

              <img
                src={currentUser.avatar}
                alt={displayName}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

            ) : (

              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                {userInitial}
              </span>

            )}

          </div>

          <span className="user-name">
            {displayName}
          </span>

        </div>

      </div>

    </header>
  );
};

export default Header;

