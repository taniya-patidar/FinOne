import React from 'react';

const DetailedTable = ({ data }) => {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(val) || 0);
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
                  <tr key={row.id || row.applicationId || idx}>
                    <td className="font-semibold text-blue">{row.id || row.applicationId || `LA-${1000 + idx}`}</td>
                    <td>{row.name || row.applicantName || 'Applicant'}</td>
                    <td>{row.loanType || 'Personal Loan'}</td>
                    <td>{formatCurrency(row.loanAmount || row.amount || 0)}</td>
                    <td>{row.tenure || row.tenureMonths || 36} Months</td>
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