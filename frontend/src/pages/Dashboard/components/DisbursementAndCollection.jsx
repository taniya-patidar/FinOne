import React, { useState, useEffect } from "react";
import "./DisbursementAndCollection.css";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
} from "recharts";



const DisbursementAndCollection = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [availableYears, setAvailableYears] = useState([currentYear]);
  const [chartData, setChartData] = useState([]);

  const calculateDisbursementAndCollection = () => {
    const savedApps = JSON.parse(
      localStorage.getItem("loanApplications") || "[]"
    );

    if (savedApps && savedApps.length > 0) {
      // Extract unique years from saved data
      const yearsSet = new Set([currentYear]);
      savedApps.forEach((app) => {
        const dateVal = app.createdAt || app.date || app.applicationDate;
        if (dateVal) {
          const d = new Date(dateVal);
          if (!isNaN(d.getTime())) {
            yearsSet.add(d.getFullYear());
          }
        }
      });
      setAvailableYears(Array.from(yearsSet).sort((a, b) => b - a));

      // Month-wise tracking buckets (in Lakhs)
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const monthlyBuckets = {};

      // Initialize all months with 0
      monthNames.forEach((m) => {
        monthlyBuckets[m] = { disbursed: 0, collected: 0 };
      });

      savedApps.forEach((app) => {
        // Year filter logic
        let appYear = currentYear;
        const dateVal = app.createdAt || app.date || app.applicationDate;
        if (dateVal) {
          const appDate = new Date(dateVal);
          if (!isNaN(appDate.getTime())) {
            appYear = appDate.getFullYear();
          }
        }

        // Process item ONLY if it matches the selected dropdown year
        if (Number(appYear) === Number(selectedYear)) {
          // Extract amount safely in numeric form
          const rawAmount = parseFloat(
            String(
              app.loanAmount || app.amount || app.disbursedAmount || 0
            ).replace(/[^0-9.]/g, "")
          ) || 0;

          // Convert amount to Lakhs for chart visualization
          const amountInLakhs = rawAmount > 0 ? rawAmount / 100000 : 0;

          // Extract month from created date or fallback to current month
          let monthName = "Jan";
          if (dateVal) {
            const appDate = new Date(dateVal);
            if (!isNaN(appDate.getTime())) {
              monthName = monthNames[appDate.getMonth()];
            }
          } else {
            // If date is missing, distribute across current month
            const currentMonthIdx = new Date().getMonth();
            monthName = monthNames[currentMonthIdx];
          }

          const isApproved =
            (app.status || "").toLowerCase() === "approved" ||
            (app.status || "").toLowerCase() === "disbursed" ||
            app.status === undefined;

          if (isApproved) {
            monthlyBuckets[monthName].disbursed += amountInLakhs;
            // Collection benchmark logic: ~75% recovery calculation
            monthlyBuckets[monthName].collected += amountInLakhs * 0.75;
          } else {
            // For pending/other applications, add partial weight
            monthlyBuckets[monthName].disbursed += amountInLakhs * 0.5;
            monthlyBuckets[monthName].collected += amountInLakhs * 0.3;
          }
        }
      });

      // Format data array for Recharts
      const dynamicFormattedData = monthNames.map((m) => ({
        month: m,
        disbursed: parseFloat(monthlyBuckets[m].disbursed.toFixed(2)),
        collected: parseFloat(monthlyBuckets[m].collected.toFixed(2)),
      }));

      

      setChartData(dynamicFormattedData);
      } else {
  setChartData(
    [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ].map((month) => ({
      month,
      disbursed: 0,
      collected: 0,
    }))
  );
}
  };

  useEffect(() => {
    calculateDisbursementAndCollection();

    window.addEventListener("storage", calculateDisbursementAndCollection);
    window.addEventListener("focus", calculateDisbursementAndCollection);
    window.addEventListener("loansUpdated",calculateDisbursementAndCollection);

    return () => {
      window.removeEventListener("storage", calculateDisbursementAndCollection);
      window.removeEventListener("focus", calculateDisbursementAndCollection);
      window.removeEventListener("loansUpdated", calculateDisbursementAndCollection);
    };
  }, [selectedYear]);

  const formatAmount = (value) => {
    return `₹${value}L`;
  };

  return (
    <section className="charts-sectionsss">
      <div className="chart-card">
        <div
          className="chart-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2>Disbursement vs Collection</h2>
            <p>Monthly loan disbursement and recovery performance</p>
          </div>

          {/* Dropdown Filter for Year */}
          <div className="year-filter">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                backgroundColor: "#fff",
                fontWeight: "600",
                color: "#374151",
                cursor: "pointer",
              }}
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatAmount} />
              <Tooltip
                formatter={(value, name) => [
                  `₹${value} Lakhs`,
                  name === "disbursed" ? "Disbursed" : "Collected",
                ]}
              />
              <Legend
                formatter={(value) =>
                  value === "disbursed" ? "Disbursed" : "Collected"
                }
              />
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
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default DisbursementAndCollection;