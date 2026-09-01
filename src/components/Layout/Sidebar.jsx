import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  FileText,
  ShieldCheck,
  BarChart3,
  Bell
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ collapsed, currentPage, onPageChange }) => {
  const navigate= useNavigate();
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customer Management', icon: Users },
    { id: 'loanApplication', label: 'Loan Application', icon: FileText },
    { id: 'loanApproval', label: 'Loan Approval', icon: ShieldCheck },
    { id: 'emiSchedule', label: 'EMI Schedule', icon: FileText },
    { id: 'reports', label: 'Reports & Charts', icon: BarChart3 },
    { id: 'notification', label: 'Notification', icon:Bell},
    // { id: 'profile', label: 'Profile & settings', icon: Settings },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div>
        {/* Logo Section */}
        <div className="sidebar-header">
          <div className="logo-box">
            <div className="logo-icon">A</div>
            {!collapsed && <span className="logo-text">AdminPanel</span>}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {onPageChange(item.id);
                  if(item.id==='customers'){
                    navigate('/customers');
                  }
                  if(item.id==='dashboard'){
                    navigate('/dashboard');
                  }
                  if(item.id==='loanApplication'){
                    navigate('loanApplication');
                  }
                  if(item.id==='loanApproval'){
                    navigate('/loan-approval')
                  }
                  if(item.id==='emiSchedule'){
                    navigate('/EmiSchedule')
                  }
                  if(item.id==='reports'){
                    navigate('/reports')
                  }
                  if(item.id==='notification'){
                    navigate('/notifications')
                  }
                }}
                className={`nav-item ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <Icon className="nav-icon" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Section */}
      <div className="sidebar-footer">
        <button onClick={()=> navigate("/logout") } className="footer-btn" title={collapsed ? 'Logout' : ''}>
          <LogOut className="nav-icon" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
