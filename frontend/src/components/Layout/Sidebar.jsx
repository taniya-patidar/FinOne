import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, LogOut, FileText, ShieldCheck,
  BarChart3, Bell, CalendarClock, ChevronLeft, ChevronRight
} from 'lucide-react';
import './Sidebar.css';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/loanApplication', label: 'Loan Applications', icon: FileText },
  { to: '/loan-approval', label: 'Loan Approval', icon: ShieldCheck },
  { to: '/EmiSchedule', label: 'EMI Schedule', icon: CalendarClock },
  { to: '/reports', label: 'Reports & Analytics', icon: BarChart3 },
  { to: '/notifications', label: 'Notifications', icon: Bell },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} aria-label="Primary navigation">
      <div>
        <div className="sidebar-header">
          <button className="brand" onClick={() => navigate('/dashboard')} aria-label="Open dashboard">
            <span className="brand-mark">F</span>
            {!collapsed && <span className="brand-copy"><strong>FinOne</strong><small>Loan operations</small></span>}
          </button>
          <button
            className="sidebar-collapse"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>
        </div>

        {!collapsed && <div className="nav-label">Workspace</div>}
        <nav className="sidebar-nav">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item ${isActive || (to === '/loanApplication' && location.pathname.startsWith('/loans')) ? 'active' : ''}`}
              title={collapsed ? label : undefined}
            >
              <Icon className="nav-icon" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <button onClick={() => navigate('/logout')} className="footer-btn" title={collapsed ? 'Logout' : undefined}>
          <LogOut className="nav-icon" />
          {!collapsed && <span>Sign out</span>}
        </button>
       
      </div>
    </aside>
  );
};

export default Sidebar;
