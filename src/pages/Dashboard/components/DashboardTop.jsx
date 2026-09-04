import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard
} from 'lucide-react';
import './Dashboard.css';

const DashboardTop = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [statsData, setStatsData] = useState({
    totalCustomers: 0,
    totalApplications: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    active: 0
  });

  /*
   * ============================================================
   * LOAD CURRENT USER FROM LOCALSTORAGE
   * ============================================================
   */
  const loadCurrentUser = () => {
    try {
      const savedUser = localStorage.getItem("currentUser");
      if (!savedUser) {
        setCurrentUser(null);
        return;
      }
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
    } catch (error) {
      console.error("Failed to load current user:", error);
      setCurrentUser(null);
    }
  };

  /*
   * ============================================================
   * LOAD DYNAMIC STATS
   * ============================================================
   */
  const loadDynamicStats = () => {
    const apps = JSON.parse(localStorage.getItem('loanApplications') || '[]');
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');

    const approvedCount = apps.filter(a => a.status?.toLowerCase() === 'approved').length;
    const pendingCount = apps.filter(a => !a.status || a.status?.toLowerCase() === 'pending').length;
    const rejectedCount = apps.filter(a => a.status?.toLowerCase() === 'rejected').length;

    setStatsData({
      totalCustomers: customers.length,
      totalApplications: apps.length,
      approved: approvedCount,
      pending: pendingCount,
      rejected: rejectedCount,
      active: approvedCount
    });
  };

  /*
   * ============================================================
   * INITIAL LOAD + LIVE LISTENERS
   * ============================================================
   */
  useEffect(() => {
    loadCurrentUser();
    loadDynamicStats();

    const handleCurrentUserUpdate = () => {
      loadCurrentUser();
    };

    const handleStatsUpdate = () => {
      loadDynamicStats();
    };

    // Events for live updating
    window.addEventListener('currentUserUpdated', handleCurrentUserUpdate);
    window.addEventListener('storage', handleCurrentUserUpdate);
    window.addEventListener('notificationsUpdated', handleStatsUpdate);
    window.addEventListener('loansUpdated', handleStatsUpdate);

    return () => {
      window.removeEventListener('currentUserUpdated', handleCurrentUserUpdate);
      window.removeEventListener('storage', handleCurrentUserUpdate);
      window.removeEventListener('notificationsUpdated', handleStatsUpdate);
      window.removeEventListener('loansUpdated', handleStatsUpdate);
    };
  }, []);

  // Display Name Priority Logic
  const displayName =
    currentUser?.fullName ||
    currentUser?.name ||
    currentUser?.username ||
    currentUser?.email?.split("@")[0] ||
    "Admin";

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const stats = [
    { id: 1, title: 'Total Customers', value: statsData.totalCustomers.toLocaleString(), icon: Users },
    { id: 2, title: 'Loan Applications', value: statsData.totalApplications.toLocaleString(), icon: FileText },
    { id: 3, title: 'Approved Loans', value: statsData.approved.toLocaleString(), icon: CheckCircle },
    { id: 4, title: 'Pending Loans', value: statsData.pending.toLocaleString(), icon: Clock },
    { id: 5, title: 'Rejected Loans', value: statsData.rejected.toLocaleString(), icon: XCircle },
    { id: 6, title: 'Active Loans', value: statsData.active.toLocaleString(), icon: CreditCard }
  ];

  return (
    <main className="dashboard">
      <section className="welcome-card">
        <div className="welcome-content">
          <h1>Good Morning, {displayName}👋</h1>
          <p>Monitor your lending operations, customer pipeline and collections from one workspace.</p>
        </div>

        <div className="welcome-info">
          <div className="info-item">
            <span>Today</span>
            <strong>{formattedDate}</strong>
          </div>
          <div className="info-item">
            <span>Last Login</span>
            <strong>Today, {today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
          </div>
        </div>
      </section>

      <section className="stats-container">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div className="stat-card" key={item.id}>
              <div className="stat-icon">
                <Icon />
              </div>
              <div className="stat-content">
                <span className="stat-title">{item.title}</span>
                <strong className="stat-value">{item.value}</strong>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default DashboardTop;