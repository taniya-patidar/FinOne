import React from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import './ChartsSection.css';

const loanTypeData = [
  { type: "Personal", loans: 120 },
  { type: "Home", loans: 90 },
  { type: "Business", loans: 65 },
  { type: "Vehicle", loans: 40 },
  { type: "Education", loans: 25 },
];

const LoanDistributionChart = () => {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h2>Loan Distribution by Type</h2>
        <p>Loan categories overview</p>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={loanTypeData}
            layout="vertical"
            barCategoryGap="25%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
            />

            <XAxis type="number" />

            <YAxis
              type="category"
              dataKey="type"
            />

            <Tooltip
              formatter={(value) => `${value} Loans`}
            />

            <Bar
              dataKey="loans"
              fill="#2563eb"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LoanDistributionChart;