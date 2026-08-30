import React, { useState, useEffect } from "react";
import "./ChartsSection.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const fallbackData = [
  { date: "01 May 2026", applications: 40, approved: 20, rejected: 5 },
  { date: "08 May 2026", applications: 65, approved: 35, rejected: 8 },
  { date: "15 May 2026", applications: 70, approved: 40, rejected: 10 },
  { date: "22 May 2026", applications: 85, approved: 50, rejected: 12 },
  { date: "29 May 2026", applications: 90, approved: 55, rejected: 15 },
  { date: "02 Aug 2026", applications: 98, approved: 62, rejected: 20 },
];

const LoanApplicationChart = () => {
  const [chartData, setChartData] = useState(fallbackData);
  // Default view ko 'Daily' rakha hai taaki exact date dikhe
  const [viewMode, setViewMode] = useState("Daily");

  // Helper function to robustly parse dates
  const parseAppDate = (rawDateStr) => {
    if (!rawDateStr) return new Date();
    const parsed = new Date(rawDateStr);
    if (!isNaN(parsed.getTime())) return parsed;

    const parts = String(rawDateStr).trim().split(/\s+/);
    if (parts.length >= 2) {
      const day = parts[0];
      const month = parts[1];
      const year = parts[2] || new Date().getFullYear();
      const reParsed = new Date(`${day} ${month} ${year}`);
      if (!isNaN(reParsed.getTime())) return reParsed;
    }
    return new Date();
  };

  const calculateExactDynamicData = () => {
    const savedApps = JSON.parse(
      localStorage.getItem("loanApplications") || "[]"
    );

    if (!savedApps || savedApps.length === 0) {
      setChartData(fallbackData);
      return;
    }

    // Step 1: Parse and sort all applications chronologically
    const parsedApps = savedApps.map((app) => {
      const rawDate = app.appliedOn || app.date || app.appliedDate || app.createdAt || "Recent";
      const dateObj = parseAppDate(rawDate);
      return {
        ...app,
        dateObj,
        status: String(app.status || "").toLowerCase().trim(),
      };
    });

    parsedApps.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    // Step 2: Determine effective mode if 'Auto' is selected
    let effectiveMode = viewMode;

    if (viewMode === "Auto") {
      const minTime = parsedApps[0].dateObj.getTime();
      const maxTime = parsedApps[parsedApps.length - 1].dateObj.getTime();
      const totalDaysSpan = Math.max(
        1,
        Math.ceil((maxTime - minTime) / (1000 * 60 * 60 * 24))
      );

      if (parsedApps.length > 100 || totalDaysSpan > 365) {
        effectiveMode = "Yearly";
      } else if (parsedApps.length > 50 || totalDaysSpan > 90) {
        effectiveMode = "Monthly";
      } else if (parsedApps.length > 20 || totalDaysSpan > 30) {
        effectiveMode = "Weekly";
      } else {
        effectiveMode = "Daily";
      }
    }

    // Step 3: Grouping Data based on view mode
    const bucketsMap = {};

    parsedApps.forEach((app) => {
      let bucketKey = "";

      if (effectiveMode === "Yearly") {
        bucketKey = app.dateObj.getFullYear().toString();
      } else if (effectiveMode === "Monthly") {
        bucketKey = app.dateObj.toLocaleDateString("en-GB", {
          month: "short",
          year: "numeric",
        });
      } else if (effectiveMode === "Weekly") {
        const dayOfMonth = app.dateObj.getDate();
        const startDay = Math.floor((dayOfMonth - 1) / 7) * 7 + 1;
        const month = app.dateObj.toLocaleDateString("en-GB", {
          month: "short",
        });
        bucketKey = `${startDay}-${startDay + 6} ${month}`;
      } else {
        // Daily: Exact date format (e.g. "25 Aug 2026")
        bucketKey = app.dateObj.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }

      if (!bucketsMap[bucketKey]) {
        // Normalized timestamp start-of-day for accurate sorting
        const dayTimestamp = new Date(
          app.dateObj.getFullYear(),
          app.dateObj.getMonth(),
          app.dateObj.getDate()
        ).getTime();

        bucketsMap[bucketKey] = {
          date: bucketKey,
          applications: 0,
          approved: 0,
          rejected: 0,
          timestamp: dayTimestamp,
        };
      }

      bucketsMap[bucketKey].applications += 1;
      if (app.status === "approved") {
        bucketsMap[bucketKey].approved += 1;
      } else if (app.status === "rejected") {
        bucketsMap[bucketKey].rejected += 1;
      }
    });

    const formattedData = Object.values(bucketsMap).sort(
      (a, b) => a.timestamp - b.timestamp
    );

    setChartData(formattedData.length > 0 ? formattedData : fallbackData);
  };

  useEffect(() => {
    calculateExactDynamicData();
  }, [viewMode]);

  useEffect(() => {
    window.addEventListener("storage", calculateExactDynamicData);
    window.addEventListener("focus", calculateExactDynamicData);

    return () => {
      window.removeEventListener("storage", calculateExactDynamicData);
      window.removeEventListener("focus", calculateExactDynamicData);
    };
  }, [viewMode]);

  return (
    <section className="charts-sections">
      <div className="chart-card">
        <div
          className="chart-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", color: "#111827" }}>
              Loan Applications Overview
            </h2>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              Showing {viewMode} view
            </span>
          </div>

          {/* Dynamic View Filter Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label
              htmlFor="chart-view-select"
              style={{ fontSize: "13px", color: "#374151", fontWeight: "500" }}
            >
              Filter View:
            </label>
            <select
              id="chart-view-select"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                backgroundColor: "#ffffff",
                fontSize: "13px",
                color: "#1f2937",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="Daily">Daily (Exact Dates)</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
              <option value="Auto">Auto (Smart Interval)</option>
            </select>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              width={600}
              height={320}
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={true}
                stroke="#e5e7eb"
              />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#4b5563" }}
                interval="preserveStartEnd"
                minTickGap={15}
              />

              <YAxis tick={{ fontSize: 12, fill: "#4b5563" }} />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e5e7eb",
                }}
              />

              <Legend wrapperStyle={{ paddingTop: "10px" }} />

              <Line
                type="monotone"
                dataKey="applications"
                name="Applications"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4, stroke: "#2563eb", strokeWidth: 2, fill: "#ffffff" }}
                activeDot={{ r: 6 }}
              />

              <Line
                type="monotone"
                dataKey="approved"
                name="Approved"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4, stroke: "#22c55e", strokeWidth: 2, fill: "#ffffff" }}
                activeDot={{ r: 6 }}
              />

              <Line
                type="monotone"
                dataKey="rejected"
                name="Rejected"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4, stroke: "#ef4444", strokeWidth: 2, fill: "#ffffff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default LoanApplicationChart;