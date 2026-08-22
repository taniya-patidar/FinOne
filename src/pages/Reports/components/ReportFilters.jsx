import React, { useState } from 'react';
import { Download, RefreshCw, Filter } from 'lucide-react';

const ReportFilters = ({ rawData, onFilterChange }) => {
  const [loanType, setLoanType] = useState('All');
  const [status, setStatus] = useState('All');

  const handleApplyFilter = () => {
    let filtered = [...rawData];

    if (loanType !== 'All') {
      filtered = filtered.filter(item => (item.loanType || '') === loanType);
    }
    if (status !== 'All') {
      filtered = filtered.filter(item => (item.status || '') === status);
    }

    onFilterChange(filtered);
  };

  const handleReset = () => {
    setLoanType('All');
    setStatus('All');
    onFilterChange(rawData);
  };

  return (
    <div className="reports-filter-card">
      <div className="filter-row">
        <div className="filter-group">
          <label>Loan Type</label>
          <select value={loanType} onChange={(e) => setLoanType(e.target.value)}>
            <option value="All">All Loan Types</option>
            <option value="Home Loan">Home Loan</option>
            <option value="Personal Loan">Personal Loan</option>
            <option value="Business Loan">Business Loan</option>
            <option value="Education Loan">Education Loan</option>
            <option value="Vehicle Loan">Vehicle Loan</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="filter-actions">
          <button className="btn-secondary" onClick={handleReset}>
            <RefreshCw size={16} /> Reset
          </button>
          <button className="btn-primary" onClick={handleApplyFilter}>
            <Filter size={16} /> Apply Filter
          </button>
        </div>
      </div>

      <div className="export-actions">
        <button className="btn-outline">
          <Download size={16} /> Export PDF
        </button>
        <button className="btn-success">
          <Download size={16} /> Export Excel
        </button>
      </div>
    </div>
  );
};

export default ReportFilters;