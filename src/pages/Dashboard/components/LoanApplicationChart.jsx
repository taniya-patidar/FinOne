import React from 'react';
import './ChartsSection.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const LoanApplicationChart = () => {

    const data = [
  {
    date: '1 May',
    applications: 40,
    approved: 20,
    rejected: 5
  },
  {
    date: '8 May',
    applications: 65,
    approved: 35,
    rejected: 8
  },
  {
    date: '15 May',
    applications: 70,
    approved: 40,
    rejected: 10
  },
  {
    date: '22 May',
    applications: 85,
    approved: 50,
    rejected: 12
  },
  {
    date: '29 May',
    applications: 90,
    approved: 55,
    rejected: 15
  },
  {
    date: '2 Aug',
    applications: 98,
    approved: 62,
    rejected: 20
  }
];
  return (
    <section className="charts-sections">
    <div className="chart-card">
    <div className="chart-header">
      <h2>Loan Applications Overview</h2>
      </div>
      <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
      <LineChart width={600} height={300} data={data}>

  <CartesianGrid
    strokeDasharray="3 3"
    vertical={false}
  />

  <XAxis
    dataKey="date"
    tick={{ fontSize: 12 }}
  />

  <YAxis
    tick={{ fontSize: 12 }}
  />

  <Tooltip />

  <Legend />

  <Line
    type="monotone"
    dataKey="applications"
    stroke="#2563eb"
    strokeWidth={2}
    dot={true}
  />

  <Line
    type="monotone"
    dataKey="approved"
    stroke="#22c55e"
    strokeWidth={2}
    dot={true}
  />

  <Line
    type="monotone"
    dataKey="rejected"
    stroke="#ef4444"
    strokeWidth={2}
    dot={true}
  />

</LineChart>
</ResponsiveContainer>
</div>
</div>
    </section>
  );
};

export default LoanApplicationChart;