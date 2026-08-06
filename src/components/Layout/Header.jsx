import React from 'react'
import { Menu, Search, Bell, Sun, Moon, User } from 'lucide-react';
import './Header.css';

const Header = ({ onToggleSidebar, darkMode, setDarkMode }) => {

  return (
    <>
      <header className="header">
      {/* Left Section */}
      <div className="header-left">
        <button onClick={onToggleSidebar} className="icon-btn">
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
        {/* Dark Mode Toggle */}
        <button onClick={() => setDarkMode(!darkMode)} className="icon-btn">
          {darkMode ? <Sun className="icon sun-icon" /> : <Moon className="icon" />}
        </button>

        {/* Notifications */}
        <button className="icon-btn notification-btn">
          <Bell className="icon" />
          <span className="badge"></span>
        </button>

        {/* User Profile */}
        <div className="user-profile">
          <div className="avatar">
            <User style={{ width: '1rem', height: '1rem' }} />
          </div>
          <span className="user-name">Admin</span>
        </div>
      </div>
    </header>
  
    </>
  );
};

export default Header
