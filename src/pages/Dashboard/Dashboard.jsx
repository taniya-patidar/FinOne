import React from 'react';
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

  // Loan Status Data
  const loanStatusData = [
    { name: 'Approved', value: 215 },
    { name: 'Pending', value: 72 },
    { name: 'Rejected', value: 41 }
  ];

  // Colors for each status
  const COLORS = [
    '#22c55e', // Approved
    '#f59e0b', // Pending
    '#ef4444'  // Rejected
  ];

  return (
    <section className="charts-section">
      <div className="DandC">
        <DashboardTop/>
      </div>
      <LoanApplicationChart/>
    

      {/* Loan Status Chart */}
      <div className="chart-card">

        <div className="chart-header">
          <h2>Loan Status</h2>
          <p>Current loan application status</p>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
          <PieChart width={350} height={300}>

            <Pie
              data={loanStatusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
            >

              {loanStatusData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index]}
                />
              ))}

              <Label
                value="328"
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
        <DisbursementAndCollection/>
      </div>
     
        <LoanDistributionChart/>
        <TopLoanPRoducts/>
     
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