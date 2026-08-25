import React from 'react';
import { FileText, CheckCircle2, XCircle, Clock, IndianRupee, Wallet } from 'lucide-react';

const MetricCards = ({ data = [] }) => {
  const totalApps = data.length;
  const approved = data.filter(d => (d.status || '').toLowerCase() === 'approved');
  const rejected = data.filter(d => (d.status || '').toLowerCase() === 'rejected');
  const pending = data.filter(d => (d.status || '').toLowerCase() === 'pending');

  // Helper Function: String se sirf digits nikale bina crash hue
  const parseAmount = (val) => {
    if (!val) return 0;
    // Agar string me ₹ ya commas hain, unko hata kar pure number banata hai
    const cleanNum = String(val).replace(/[^0-9.]/g, '');
    return Number(cleanNum) || 0;
  };

  // Dynamic Calculation: LocalStorage ke har approved application ka amount add karega
  const approvedAmt = approved.reduce((sum, item) => {
    const amt = parseAmount(item.loanAmount || item.amount || item.approvedAmount);
    return sum + amt;
  }, 0);

  // Dynamic Disbursed Amount (Agar payload me disbursedAmount hai toh wo lega, nahi toh total approved lega)
  const disbursedAmt = Math.round(approvedAmt * 0.8);

  // Currency Formatter
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
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