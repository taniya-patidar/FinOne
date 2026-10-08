import React, { useEffect, useState } from 'react';
import { Menu, Search, Bell, Sun, Moon, ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUnreadCount } from '../../services/notificationService';
import './Header.css';

const titleMap = [
  ['/dashboard', 'Dashboard', 'Portfolio overview'],
  ['/customers', 'Customers', 'Customer management'],
  ['/loanApplication', 'Loan Applications', 'Applications and pipeline'],
  ['/loan-approval', 'Loan Approval', 'Review and decisioning'],
  ['/EmiSchedule', 'EMI Schedule', 'Collections and repayments'],
  ['/reports', 'Reports & Analytics', 'Performance insights'],
  ['/notifications', 'Notifications', 'Updates and alerts'],
];

const Header = ({ onToggleSidebar, darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const load = () => {
      try { setCurrentUser(JSON.parse(localStorage.getItem('currentUser') || 'null')); } catch { setCurrentUser(null); }
      try { setUnreadCount(Number(getUnreadCount()) || 0); } catch { setUnreadCount(0); }
    };
    load();
    const sync = () => load();
    window.addEventListener('storage', sync);
    window.addEventListener('currentUserUpdated', sync);
    window.addEventListener('notificationsUpdated', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('currentUserUpdated', sync);
      window.removeEventListener('notificationsUpdated', sync);
    };
  }, []);

  const match = [...titleMap].reverse().find(([path]) => location.pathname === path || location.pathname.startsWith(`${path}/`));
  const pageTitle = match?.[1] || 'FinOne';
  const pageSubtitle = match?.[2] || 'Loan operations workspace';
  const displayName = currentUser?.fullName || currentUser?.name || currentUser?.username || currentUser?.email?.split('@')[0] || 'Admin';
  const initial = displayName.trim().charAt(0).toUpperCase() || 'A';

  return (
    <header className="header">
      <div className="header-left">
        <button onClick={onToggleSidebar} className="icon-btn menu-btn" aria-label="Toggle sidebar"><Menu /></button>
        <div className="header-title"><h1>{pageTitle}</h1><span>{pageSubtitle}</span></div>
      </div>

      <div className="header-actions">
        <div className="header-search">
          <Search size={16} />
          <input aria-label="Search" placeholder="Search customers, loans..." />
          <kbd>⌘ K</kbd>
        </div>
        <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="icon-btn notification-btn" onClick={() => navigate('/notifications')} aria-label="Notifications">
          <Bell size={18} />
          {unreadCount > 0 && <span className="badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
        </button>
        <div className="profile-wrap">
          <button className="user-profile" onClick={() => setProfileOpen(!profileOpen)} aria-expanded={profileOpen}>
            <span className="avatar">{initial}</span>
            <span className="user-copy"><strong>{displayName}</strong><small>Administrator</small></span>
            <ChevronDown size={15} />
          </button>
          {profileOpen && (
            <div className="profile-menu">
              <div className="profile-menu-head"><span className="avatar large">{initial}</span><div><strong>{displayName}</strong><small>{currentUser?.email || 'Administrator'}</small></div></div>
              <button onClick={() => navigate('/logout')}>Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
