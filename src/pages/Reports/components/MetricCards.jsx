import React from 'react';
import { FileText, CheckCircle2, XCircle, Clock, IndianRupee, Wallet } from 'lucide-react';

const MetricCards = ({ data }) => {
  const totalApps = data.length;
  const approved = data.filter(d => d.status === 'Approved');
  const rejected = data.filter(d => d.status === 'Rejected');
  const pending = data.filter(d => d.status === 'Pending');

  const approvedAmt = approved.reduce((sum, item) => sum + Number(item.loanAmount || item.amount || 0), 0);
  const disbursedAmt = approvedAmt * 0.85; // Example calculated disbursement

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-icon blue"><FileText size={22} /></div>
        <div className="metric-info">
          <span>Total Applications</span>
          <h3>{totalApps}</h3>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon green"><CheckCircle2 size={22} /></div>
        <div className="metric-info">
          <span>Approved Loans</span>
          <h3>{approved.length}</h3>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon red"><XCircle size={22} /></div>
        <div className="metric-info">
          <span>Rejected Loans</span>
          <h3>{rejected.length}</h3>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon orange"><Clock size={22} /></div>
        <div className="metric-info">
          <span>Pending Applications</span>
          <h3>{pending.length}</h3>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon purple"><IndianRupee size={22} /></div>
        <div className="metric-info">
          <span>Total Approved Amount</span>
          <h3>{formatCurrency(approvedAmt)}</h3>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon teal"><Wallet size={22} /></div>
        <div className="metric-info">
          <span>Total Disbursed Amount</span>
          <h3>{formatCurrency(disbursedAmt)}</h3>
        </div>
      </div>
    </div>
  );
};

export default MetricCards;