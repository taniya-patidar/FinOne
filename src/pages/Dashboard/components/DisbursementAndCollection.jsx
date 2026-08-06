import React from 'react'
// import './ChartsSection.css'
import './DisbursementAndCollection.css'
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar
} from 'recharts';

const DisbursementAndCollection = () => {

    const disbursementData = [
  {
    month: 'Jan',
    disbursed: 40,
    collected: 25
  },
  {
    month: 'Feb',
    disbursed: 60,
    collected: 45
  },
  {
    month: 'Mar',
    disbursed: 48,
    collected: 38
  },
  {
    month: 'Apr',
    disbursed: 70,
    collected: 45
  },
  {
    month: 'May',
    disbursed: 62,
    collected: 52
  },
  {
    month: 'Jun',
    disbursed: 80,
    collected: 60
  },
  {
    month: 'Jul',
    disbursed: 85,
    collected: 63
  },
  {
    month: 'Aug',
    disbursed: 88,
    collected: 68
  }
];

const formatAmount = (value) => {
  return `₹${value}L`;
};
  return (
    <section className="charts-sectionsss">
    <div className="chart-card">
    <div className="chart-header">
  <div>
    <h2>Disbursement vs Collection</h2>
    <p>Monthly loan disbursement and recovery performance</p>
  </div>
</div>
      <div className="chart-container">
<ResponsiveContainer width="100%" height={300}>
    <BarChart data={disbursementData}>

  <CartesianGrid
    strokeDasharray="3 3"
    vertical={false}
  />

  <XAxis dataKey="month" />

  <YAxis />

  <Tooltip />

  <Legend />

  <Bar
    dataKey="disbursed"
    fill="#2563eb"
    radius={[6, 6, 0, 0]}
    barSize={24}
  />

  <Bar
    dataKey="collected"
    fill="#22c55e"
    radius={[6, 6, 0, 0]}
    barSize={24}
  />

</BarChart>
</ResponsiveContainer></div>
      </div>
      </section>
  )
}

export default DisbursementAndCollection
