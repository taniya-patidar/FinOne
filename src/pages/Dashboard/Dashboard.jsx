import React, { useState, useEffect } from 'react';
import LoanApplicationChart from './components/LoanApplicationChart';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer
} from 'recharts';

import './components/ChartsSection.css';
import DisbursementAndCollection from './components/DisbursementAndCollection';
import LoanDistributionChart from './components/LoanDistributionChart';
import TopLoanPRoducts from './components/TopLoanPRoducts';
import RecentLoanTable from './components/RecentLoanTable';
import RecentEmiPayment from './components/RecentEmiPayment';
import RecentNotification from './components/RecentNotification';
import DashboardTop from './components/DashboardTop';

const Dashboard = () => {
  const [statusChartData, setStatusChartData] = useState([
    { name: 'Approved', value: 0 },
    { name: 'Pending', value: 0 },
    { name: 'Rejected', value: 0 }
  ]);
  const [totalAppsCount, setTotalAppsCount] = useState(0);

  const calculateChartData = () => {
    const apps = JSON.parse(localStorage.getItem('loanApplications') || '[]');

    const approved = apps.filter(a => a.status?.toLowerCase() === 'approved').length;
    const pending = apps.filter(a => !a.status || a.status?.toLowerCase() === 'pending').length;
    const rejected = apps.filter(a => a.status?.toLowerCase() === 'rejected').length;

    setStatusChartData([
      { name: 'Approved', value: approved },
      { name: 'Pending', value: pending },
      { name: 'Rejected', value: rejected }
    ]);

    setTotalAppsCount(apps.length);
  };

  useEffect(() => {
    calculateChartData();
    window.addEventListener('storage', calculateChartData);
    window.addEventListener('notificationUpdated', calculateChartData);

    return () => {
      window.removeEventListener('storage', calculateChartData);
      window.removeEventListener('notificationUpdated', calculateChartData);
    };
  }, []);

  const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

  return (
    <section className="charts-section">
      <div className="DandC">
        <DashboardTop />
      </div>

      <LoanApplicationChart />

      {/* Dynamic Loan Status Chart */}
      <div className="chart-card">
        <div className="chart-header">
          <h2>Loan Status</h2>
          <p>Current loan application status</p>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart width={350} height={300}>
              <Pie
                data={statusChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index]} />
                ))}

                <Label
                  value={String(totalAppsCount)}
                  position="center"
                  fill="#111827"
                  fontSize={24}
                  fontWeight="700"
                />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="DandC">
        <DisbursementAndCollection />
      </div>

      <LoanDistributionChart />
      <TopLoanPRoducts />

      <div className="tables-container">
        <RecentLoanTable />
        <div className="right-side">
          <RecentEmiPayment />
          <RecentNotification />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;