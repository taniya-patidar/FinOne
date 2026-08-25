// src/pages/Reports/ReportsPage.jsx
import React, { useState, useEffect } from 'react';
import ReportFilters from './components/ReportFilters';
import MetricCards from './components/MetricCards';
import AnalyticsCharts from './components/AnalyticsCharts';
import DetailedTable from './components/DetailedTable';
import './Reports.css';

const ReportsPage = () => {
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const savedApps = JSON.parse(localStorage.getItem("loanApplications")) || [];
    
    // Sirf wahi array elements filter karo jinke paas valid loan ID hai (e.g. LA-10301)
    const validApplicationsOnly = savedApps.filter(app => app.id && app.id.startsWith("LA-"));

    setRawData(validApplicationsOnly);
    setFilteredData(validApplicationsOnly);
  }, []);

  return (
    <div className="reports-page-container">
      <div className="reports-header">
        <div>
          <h2>Reports & Analytics</h2>
          <p>View application metrics and performance charts</p>
        </div>
      </div>

      <ReportFilters rawData={rawData} onFilterChange={setFilteredData} />
      <MetricCards data={filteredData} />
      <AnalyticsCharts data={filteredData} />
      <DetailedTable data={filteredData} />
    </div>
  );
};

export default ReportsPage;