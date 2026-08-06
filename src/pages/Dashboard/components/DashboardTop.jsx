import React from 'react';
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard
} from 'lucide-react';
import './Dashboard.css';

const today = new Date();

const formattedDate = today.toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
});

const stats = [
    {
      id: 1,
      title: 'Total Customers',
      value: '1,250',
      icon: Users
    },
    {
      id: 2,
      title: 'Loan Applications',
      value: '328',
      icon: FileText
    },
    {
      id: 3,
      title: 'Approved Loans',
      value: '215',
      icon: CheckCircle
    },
    {
      id: 4,
      title: 'Pending Loans',
      value: '72',
      icon: Clock
    },
    {
      id: 5,
      title: 'Rejected Loans',
      value: '41',
      icon: XCircle
    },
    {
      id: 6,
      title: 'Active Loans',
      value: '186',
      icon: CreditCard
    }
  ];

const DashboardTop = () => {
  return (
    <main className="dashboard">
      
      <section className="welcome-card">
        
        <div className="welcome-content">
          <h1>Good Morning, Admin 👋</h1>
          <p>Welcome back! Here's your loan portfolio overview.</p>
        </div>

        <div className="welcome-info">

    <div className="info-item">
      <span>Today</span>
      <strong>{formattedDate}</strong>
    </div>

    <div className="info-item">
      <span>Last Login</span>
      <strong>Today, 10:42 AM</strong>
    </div>

    </div>

      </section>

       {/* 6 Cards Section */}
      <section className="stats-container">

        {stats.map((item) => {

          const Icon = item.icon;

          return (
            <div className="stat-card" key={item.id}>

              <div className="stat-icon">
                <Icon />
              </div>

              <div className="stat-content">
                <span className="stat-title">
                  {item.title}
                </span>

                <strong className="stat-value">
                  {item.value}
                </strong>
              </div>

            </div>
          );
        })}
        </section>

    </main>
  );
};

export default DashboardTop;