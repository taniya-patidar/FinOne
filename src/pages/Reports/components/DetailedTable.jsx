// src/pages/Reports/components/DetailedTable.jsx
import React from 'react';

const DetailedTable = ({ data = [] }) => {
  // Safe Number Parser: "₹ 25,00,000" -> 2500000
  const parseAmount = (val) => {
    if (!val) return 0;
    const cleanNum = String(val).replace(/[^0-9.]/g, '');
    return Number(cleanNum) || 0;
  };

  const formatCurrency = (val) => {
    const num = parseAmount(val);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="table-card">
      <h4>Detailed Report Data</h4>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Applicant Name</th>
              <th>Loan Type</th>
              <th>Loan Amount</th>
              <th>Tenure</th>
              <th>Status</th>
              <th>Approved By</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row, idx) => {
                const status = row.status || 'Pending';

                return (
                  <tr key={row.id || idx}>
                    <td className="font-semibold text-blue">{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.loanType}</td>
                    <td>{formatCurrency(row.loanAmount)}</td>
                    <td>{row.tenureMonths || 36} Months</td>
                    <td>
                      <span className={`status-badge ${status.toLowerCase()}`}>
                        {status}
                      </span>
                    </td>
                    <td>{row.approvedBy || 'Admin User'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailedTable;