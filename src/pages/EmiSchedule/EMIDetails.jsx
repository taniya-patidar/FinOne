import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  Building,
  Percent,
  TrendingDown,
  DollarSign,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./EMIDetails.css";

const EMIDetails = ({ loanData, onBack }) => {
  const [activeTab, setActiveTab] = useState("schedule");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Fallback / Dummy Data Setup if loanData properties are missing
  const customer = {
    name: loanData?.customerName || "Rahul Sharma",
    id: loanData?.customerId || "CUST-1001",
    phone: loanData?.phone || "9876543210",
    email: loanData?.email || "rahul@gmail.com",
    initials: loanData?.customerName
      ? loanData.customerName.split(" ").map((n) => n[0]).join("").toUpperCase()
      : "RS",
  };

  const loanInfo = {
    id: loanData?.id || "LA-10021",
    type: loanData?.loanType || "Home Loan",
    amount: Number(loanData?.loanAmount) || 1000000,
    rate: loanData?.interestRate || "10.50",
    tenure: loanData?.tenureMonths || 24,
    startDate: loanData?.startDate || "21 Jan 2025",
    disbursementDate: loanData?.disbursementDate || "21 Jan 2025",
    status: loanData?.status || "Active",
    emiAmount: Number(loanData?.emiAmount) || 48750,
  };

  // Dynamic Generation of 24 EMI Rows based on loan info
  const emiScheduleList = useMemo(() => {
    const list = [];
    const totalTenure = loanInfo.tenure;
    const paidCount = loanData?.paidEmis || 8; // Default mock 8 paid EMIs
    const baseDate = new Date(2025, 0, 21); // Jan 21, 2025

    let currentPrincipal = loanInfo.amount;

    for (let i = 1; i <= totalTenure; i++) {
      const dueDateObj = new Date(baseDate);
      dueDateObj.setMonth(baseDate.getMonth() + (i - 1));

      const dueDateFormatted = dueDateObj.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const isPaid = i <= paidCount;
      const interestComp = Math.round((currentPrincipal * (10.5 / 100)) / 12);
      const principalComp = loanInfo.emiAmount - interestComp;

      list.push({
        emiNo: String(i).padStart(2, "0"),
        dueDate: dueDateFormatted,
        principal: principalComp > 0 ? principalComp : 32500 + i * 200,
        interest: interestComp > 0 ? interestComp : 16250 - i * 200,
        amount: loanInfo.emiAmount,
        status: isPaid ? "Paid" : "Upcoming",
        paymentDate: isPaid ? dueDateFormatted : "-",
      });

      currentPrincipal -= principalComp;
    }
    return list;
  }, [loanInfo, loanData]);

  // Derived KPI Metrics
  const paidEMIs = emiScheduleList.filter((e) => e.status === "Paid").length;
  const remainingEMIs = loanInfo.tenure - paidEMIs;
  const totalPaidAmount = paidEMIs * loanInfo.emiAmount;
  const outstandingAmount = loanInfo.amount - totalPaidAmount > 0 ? loanInfo.amount - totalPaidAmount : 0;

  // Pagination Logic
  const totalPages = Math.ceil(emiScheduleList.length / rowsPerPage);
  const paginatedSchedule = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return emiScheduleList.slice(start, start + rowsPerPage);
  }, [emiScheduleList, currentPage]);

  // Mock Payment History Ledger
  const paymentHistory = [
    { date: "21 Jul 2025", amount: loanInfo.emiAmount, method: "UPI", ref: "UPI5123698" },
    { date: "21 Jun 2025", amount: loanInfo.emiAmount, method: "NEFT", ref: "NEFT4587963" },
    { date: "21 May 2025", amount: loanInfo.emiAmount, method: "UPI", ref: "UPI4587962" },
    { date: "21 Apr 2025", amount: loanInfo.emiAmount, method: "IMPS", ref: "IMPS3256987" },
    { date: "21 Mar 2025", amount: loanInfo.emiAmount, method: "NEFT", ref: "NEFT1256987" },
  ];

  return (
    <div className="emi-details-wrapper">
      {/* HEADER SECTION */}
      <div className="details-header">
        <div>
          <div className="breadcrumb">
            <span onClick={onBack} className="crumb-link">EMI Schedule</span>
            <span className="crumb-sep">&gt;</span>
            <span className="crumb-active">EMI Details</span>
          </div>
          <h1 className="details-title">EMI Details</h1>
          <p className="details-subtitle">View complete EMI schedule and payment history</p>
        </div>
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={16} /> Back to EMI Schedule
        </button>
      </div>

      {/* LOAN & CUSTOMER OVERVIEW CARD */}
      <div className="overview-card">
        <h3 className="card-section-title">Loan & Customer Overview</h3>
        <div className="overview-grid">
          {/* Customer Bio */}
          <div className="customer-profile-block">
            <div className="avatar-circle">{customer.initials}</div>
            <div className="profile-info">
              <h4>{customer.name}</h4>
              <span className="cust-id-badge">{customer.id}</span>
              <p>{customer.phone}</p>
              <p>{customer.email}</p>
            </div>
          </div>

          {/* Quick Metrics Columns */}
          <div className="info-meta-item">
            <div className="meta-icon bg-blue"><FileText size={16} /></div>
            <div>
              <label>Loan ID</label>
              <strong>{loanInfo.id}</strong>
            </div>
          </div>

          <div className="info-meta-item">
            <div className="meta-icon bg-slate"><Building size={16} /></div>
            <div>
              <label>Loan Type</label>
              <strong>{loanInfo.type}</strong>
            </div>
          </div>

          <div className="info-meta-item">
            <div className="meta-icon bg-green"><CreditCard size={16} /></div>
            <div>
              <label>Loan Amount</label>
              <strong>₹{loanInfo.amount.toLocaleString("en-IN")}</strong>
            </div>
          </div>

          <div className="info-meta-item">
            <div className="meta-icon bg-indigo"><Percent size={16} /></div>
            <div>
              <label>Interest Rate</label>
              <strong>{loanInfo.rate}% p.a.</strong>
            </div>
          </div>

          <div className="info-meta-item">
            <div className="meta-icon bg-blue"><Clock size={16} /></div>
            <div>
              <label>Tenure</label>
              <strong>{loanInfo.tenure} Months</strong>
            </div>
          </div>

          <div className="info-meta-item">
            <div className="meta-icon bg-slate"><Calendar size={16} /></div>
            <div>
              <label>Loan Start Date</label>
              <strong>{loanInfo.startDate}</strong>
            </div>
          </div>

          <div className="info-meta-item">
            <div className="meta-icon bg-slate"><Calendar size={16} /></div>
            <div>
              <label>Disbursement Date</label>
              <strong>{loanInfo.disbursementDate}</strong>
            </div>
          </div>

          <div className="info-meta-item">
            <div className="meta-icon bg-green"><CheckCircle2 size={16} /></div>
            <div>
              <label>Loan Status</label>
              <span className="status-tag active">{loanInfo.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 KPI STATS CARDS */}
      <div className="kpi-cards-grid">
        <div className="kpi-mini-card">
          <div className="kpi-icon-wrapper blue-icon"><FileText size={20} /></div>
          <div>
            <span className="kpi-label">EMI Amount</span>
            <h3 className="kpi-value">₹{loanInfo.emiAmount.toLocaleString("en-IN")}</h3>
          </div>
        </div>

        <div className="kpi-mini-card">
          <div className="kpi-icon-wrapper purple-icon"><CreditCard size={20} /></div>
          <div>
            <span className="kpi-label">Total EMIs</span>
            <h3 className="kpi-value">{loanInfo.tenure}</h3>
          </div>
        </div>

        <div className="kpi-mini-card">
          <div className="kpi-icon-wrapper green-icon"><CheckCircle2 size={20} /></div>
          <div>
            <span className="kpi-label">Paid EMIs</span>
            <h3 className="kpi-value">{paidEMIs}</h3>
          </div>
        </div>

        <div className="kpi-mini-card">
          <div className="kpi-icon-wrapper orange-icon"><Clock size={20} /></div>
          <div>
            <span className="kpi-label">Remaining EMIs</span>
            <h3 className="kpi-value">{remainingEMIs}</h3>
          </div>
        </div>

        <div className="kpi-mini-card">
          <div className="kpi-icon-wrapper red-icon"><TrendingDown size={20} /></div>
          <div>
            <span className="kpi-label">Outstanding Amount</span>
            <h3 className="kpi-value">₹{outstandingAmount.toLocaleString("en-IN")}</h3>
          </div>
        </div>

        <div className="kpi-mini-card">
          <div className="kpi-icon-wrapper cyan-icon"><Calendar size={20} /></div>
          <div>
            <span className="kpi-label">Next EMI Due</span>
            <h3 className="kpi-value">21 Aug 2025</h3>
            <span className="kpi-subtext">In 5 days</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT WORKSPACE (2-COLUMN LAYOUT) */}
      <div className="details-content-split">
        {/* LEFT COLUMN: EMI SCHEDULE TABLE */}
        <div className="left-panel-card">
          {/* TABS */}
          <div className="detail-tabs">
            <button
              className={`d-tab-btn ${activeTab === "schedule" ? "active" : ""}`}
              onClick={() => setActiveTab("schedule")}
            >
              EMI Schedule
            </button>
            <button
              className={`d-tab-btn ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              Payment History
            </button>
          </div>

          <h3 className="panel-inner-title">EMI Schedule</h3>

          {/* TABLE */}
          <div className="table-wrapper">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>EMI No.</th>
                  <th>Due Date</th>
                  <th>Principal (₹)</th>
                  <th>Interest (₹)</th>
                  <th>EMI Amount (₹)</th>
                  <th>Status</th>
                  <th>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSchedule.map((row) => (
                  <tr key={row.emiNo}>
                    <td className="emi-no-col">{row.emiNo}</td>
                    <td className="date-col">{row.dueDate}</td>
                    <td className="num-col">₹{row.principal.toLocaleString("en-IN")}</td>
                    <td className="num-col">₹{row.interest.toLocaleString("en-IN")}</td>
                    <td className="num-col bold">₹{row.amount.toLocaleString("en-IN")}</td>
                    <td>
                      <span className={`status-pill ${row.status.toLowerCase()}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="date-col">{row.paymentDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TABLE PAGINATION */}
          <div className="sub-pagination">
            <span>
              Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
              {Math.min(currentPage * rowsPerPage, emiScheduleList.length)} of{" "}
              {emiScheduleList.length} EMIs
            </span>
            <div className="p-arrows">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`p-num ${currentPage === p ? "active" : ""}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SUMMARY & HISTORY PANELS */}
        <div className="right-panel-stack">
          {/* PAYMENT SUMMARY BOX */}
          <div className="side-card">
            <h3 className="side-card-title">Payment Summary</h3>
            <div className="summary-list">
              <div className="summary-row">
                <span>Total Payment Made</span>
                <strong className="text-green">₹3,90,000</strong>
              </div>
              <div className="summary-row">
                <span>Total Interest Paid</span>
                <strong className="text-purple">₹1,10,000</strong>
              </div>
              <div className="summary-row">
                <span>Principal Paid</span>
                <strong className="text-blue">₹2,80,000</strong>
              </div>
              <div className="summary-row">
                <span>Remaining Principal</span>
                <strong className="text-orange">₹7,20,000</strong>
              </div>
              <div className="summary-row">
                <span>Next EMI Due</span>
                <strong className="text-blue">21 Aug 2025</strong>
              </div>
              <div className="summary-row">
                <span>Days Remaining</span>
                <strong className="text-red">5 Days</strong>
              </div>
            </div>
          </div>

          {/* PAYMENT HISTORY BOX */}
          <div className="side-card">
            <div className="side-card-header">
              <h3 className="side-card-title">Payment History</h3>
              <button className="btn-link">View All</button>
            </div>
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Payment Date</th>
                    <th>Amount (₹)</th>
                    <th>Method</th>
                    <th>Reference No.</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((h, index) => (
                    <tr key={index}>
                      <td>{h.date}</td>
                      <td className="bold">₹{h.amount.toLocaleString("en-IN")}</td>
                      <td>
                        <span className={`method-badge ${h.method.toLowerCase()}`}>
                          {h.method}
                        </span>
                      </td>
                      <td className="ref-no">{h.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMIDetails;