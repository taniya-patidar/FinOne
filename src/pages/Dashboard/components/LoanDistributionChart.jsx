import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./ChartsSection.css";

const defaultLoanTypeData = [
  { type: "Personal", loans: 120 },
  { type: "Home", loans: 90 },
  { type: "Business", loans: 65 },
  { type: "Vehicle", loans: 40 },
  { type: "Education", loans: 25 },
];

const LoanDistributionChart = () => {
  const [chartData, setChartData] = useState(defaultLoanTypeData);

  const calculateDistribution = () => {
    const savedApps = JSON.parse(localStorage.getItem("loanApplications") || "[]");

    if (savedApps.length > 0) {
      const counts = {
        Personal: 0,
        Home: 0,
        Business: 0,
        Vehicle: 0,
        Education: 0,
      };

      savedApps.forEach((app) => {
        const type = app.loanType || "Personal";
        if (counts[type] !== undefined) {
          counts[type] += 1;
        } else {
          counts["Personal"] += 1;
        }
      });

      const formatted = Object.keys(counts).map((key) => ({
        type: key,
        loans: counts[key],
      }));

      setChartData(formatted);
    } else {
      setChartData(defaultLoanTypeData);
    }
  };

  useEffect(() => {
    calculateDistribution();
    window.addEventListener("storage", calculateDistribution);
    window.addEventListener("focus", calculateDistribution);

    return () => {
      window.removeEventListener("storage", calculateDistribution);
      window.removeEventListener("focus", calculateDistribution);
    };
  }, []);

  return (
    <section className="chart-section">
      <div className="chart-card">
        <div className="chart-header">
          <h2>Loan Distribution by Type</h2>
          <p>Loan categories overview</p>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
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
    </section>
  );
};

export default LoanDistributionChart;