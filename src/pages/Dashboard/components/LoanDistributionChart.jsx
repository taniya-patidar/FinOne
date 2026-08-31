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



const LoanDistributionChart = () => {
  const [chartData, setChartData] = useState([]);

  const calculateDistribution = () => {
    const savedApps = JSON.parse(
      localStorage.getItem("loanApplications") || "[]"
    );

    if (savedApps && savedApps.length > 0) {
      const counts = {
        Personal: 0,
        Home: 0,
        Business: 0,
        Vehicle: 0,
        Education: 0,
      };

      savedApps.forEach((app) => {
        // Safe string parsing and cleanup
        const rawType = (
          app.loanType ||
          app.type ||
          app.category ||
          ""
        )
          .toString()
          .toLowerCase()
          .trim();

        // Flexibly match variations in spelling or casing
        if (rawType.includes("home") || rawType.includes("house")) {
          counts.Home += 1;
        } else if (
          rawType.includes("vehicle") ||
          rawType.includes("car") ||
          rawType.includes("auto")
        ) {
          counts.Vehicle += 1;
        } else if (
          rawType.includes("business") ||
          rawType.includes("biz")
        ) {
          counts.Business += 1;
        } else if (
          rawType.includes("education") ||
          rawType.includes("student") ||
          rawType.includes("study")
        ) {
          counts.Education += 1;
        } else {
          // Default to Personal if empty or explicitly personal
          counts.Personal += 1;
        }
      });

      const formatted = Object.keys(counts).map((key) => ({
        type: key,
        loans: counts[key],
      }));

      setChartData(formatted);
    } else {
  setChartData([
    { type: "Personal", loans: 0 },
    { type: "Home", loans: 0 },
    { type: "Business", loans: 0 },
    { type: "Vehicle", loans: 0 },
    { type: "Education", loans: 0 },
  ]);
}
  };

  useEffect(() => {
    calculateDistribution();

    // Listen to storage changes and window focus
    window.addEventListener("storage", calculateDistribution);
    window.addEventListener("focus", calculateDistribution);
    window.addEventListener("loansUpdated", calculateDistribution);

    return () => {
      window.removeEventListener("storage", calculateDistribution);
      window.removeEventListener("focus", calculateDistribution);
      window.removeEventListener("loansUpdated", calculateDistribution);
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
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="type" />
              <Tooltip formatter={(value) => [`${value} Loans`, "Total"]} />
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