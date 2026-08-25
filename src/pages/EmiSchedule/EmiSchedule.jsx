import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Filter,
  Download,
  Calculator,
  MoreVertical,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Home,
  User,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Send,
  FileText,
  CheckCircle,
} from "lucide-react";
import EMIDetails from "./EMIDetails";
import "./EMISchedule.css";

// Helper: Status Computation Logic
const getEMIStatus = (dueDateStr, paymentDateStr) => {
  if (paymentDateStr) return "Paid";

  const today = new Date();
  const dueDate = new Date(dueDateStr);

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  if (dueDate < today) return "Overdue";
  if (dueDate.getTime() === today.getTime()) return "Pending";
  return "Upcoming";
};

const EMISchedule = () => {
  // State Initialization
  const [emiData, setEmiData] = useState(() => {
    const saved = localStorage.getItem("approvedEMISchedules");
    return saved ? JSON.parse(saved) : [];
  });

  // View Mode Navigation State ('list' vs 'details')
  const [viewMode, setViewMode] = useState("list");
  const [selectedLoan, setSelectedLoan] = useState(null);

  // Filters & Tabs State
  const [activeTab, setActiveTab] = useState("All EMIs");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLoanId, setSelectedLoanId] = useState("All Loans");
  const [selectedLoanType, setSelectedLoanType] = useState("All Types");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All Status");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Modals & Active Action Menu State
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);

  // Calculator State
  const [calcAmount, setCalcAmount] = useState(500000);
  const [calcRate, setCalcRate] = useState(10.5);
  const [calcTenure, setCalcTenure] = useState(24);
  const [calcResult, setCalcResult] = useState({ emi: 23448, interest: 62761, total: 562761 });

  const dropdownRef = useRef(null);

  // Close Action Menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveActionMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  

  // Auto-Sync Effect with localStorage & Window Focus
  useEffect(() => {
    const loadApprovedEMIs = () => {
      const saved = localStorage.getItem("approvedEMISchedules");
      if (saved) {
        setEmiData(JSON.parse(saved));
      }
    };

    loadApprovedEMIs();
    window.addEventListener("focus", loadApprovedEMIs);
    return () => window.removeEventListener("focus", loadApprovedEMIs);
  }, []);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLoanId, selectedLoanType, selectedStatusFilter, activeTab]);

  // Calculator Logic
  const handleCalculate = () => {
    const P = Number(calcAmount) || 0;
    const r = (Number(calcRate) || 0) / 12 / 100;
    const n = Number(calcTenure) || 0;

    if (P > 0 && r > 0 && n > 0) {
      const emi = Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
      const total = emi * n;
      const interest = total - P;
      setCalcResult({ emi, interest, total });
    }
  };

  // Process Statuses for active data
  const processedData = useMemo(() => {
    return emiData.map((item) => ({
      ...item,
      computedStatus: getEMIStatus(item.dueDate, item.paymentDate),
    }));
  }, [emiData]);

  // Unique Loan IDs
  const uniqueLoanIds = useMemo(() => {
    const ids = processedData.map((item) => item.id).filter(Boolean);
    return Array.from(new Set(ids));
  }, [processedData]);

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalLoans = processedData.length;
    let paidCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;
    let totalEMI = 0;

    processedData.forEach((item) => {
      totalEMI += Number(item.emiAmount) || 0;
      if (item.computedStatus === "Paid") paidCount++;
      else if (item.computedStatus === "Overdue") overdueCount++;
      else pendingCount++;
    });

    const paidPercentage = totalLoans > 0 ? ((paidCount / totalLoans) * 100).toFixed(2) : "0.00";
    const pendingPercentage = totalLoans > 0 ? ((pendingCount / totalLoans) * 100).toFixed(2) : "0.00";
    const overduePercentage = totalLoans > 0 ? ((overdueCount / totalLoans) * 100).toFixed(2) : "0.00";

    const nextDueItem = processedData.find((i) => i.computedStatus !== "Paid");

    return {
      totalLoans,
      totalEMI,
      paidEMI: paidCount,
      pendingEMI: pendingCount,
      overdueEMI: overdueCount,
      paidPercentage,
      pendingPercentage,
      overduePercentage,
      nextDueDate: nextDueItem ? `₹${Number(nextDueItem.emiAmount).toLocaleString("en-IN")}` : "N/A",
    };
  }, [processedData]);

  // Table Filtering Logic
  const filteredData = useMemo(() => {
    return processedData.filter((item) => {
      if (activeTab !== "All" && activeTab !== "All EMIs") {
        if (activeTab === "Paid" && item.computedStatus !== "Paid") return false;
        if (activeTab === "Pending" && item.computedStatus !== "Pending") return false;
        if (activeTab === "Overdue" && item.computedStatus !== "Overdue") return false;
        if (activeTab === "Upcoming" && item.computedStatus !== "Upcoming") return false;
      }

      if (selectedLoanId !== "All Loans" && item.id !== selectedLoanId) return false;
      if (selectedStatusFilter !== "All Status" && item.computedStatus !== selectedStatusFilter) return false;
      if (selectedLoanType !== "All Types" && item.loanType !== selectedLoanType) return false;

      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesId = String(item.id || "").toLowerCase().includes(query);
        const matchesName = String(item.customerName || "").toLowerCase().includes(query);
        const matchesPhone = String(item.phone || "").includes(query);
        return matchesId || matchesName || matchesPhone;
      }

      return true;
    });
  }, [processedData, activeTab, selectedLoanId, selectedStatusFilter, selectedLoanType, searchTerm]);

  // Dynamic Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage]);

  // Actions Logic
  const handleAction = (actionType, item) => {
    setActiveActionMenuId(null);
    if (actionType === "sendLink") {
      alert(`Payment link dispatched to ${item.customerName} (${item.phone}).`);
    } else if (actionType === "markPaid") {
      const updated = emiData.map((e) =>
        e.id === item.id ? { ...e, paymentDate: new Date().toISOString().slice(0, 10) } : e
      );
      setEmiData(updated);
      localStorage.setItem("approvedEMISchedules", JSON.stringify(updated));
    } else if (actionType === "downloadInvoice") {
      alert(`Generating EMI Receipt PDF for Loan ID: ${item.id}`);
    }
  };

  // Open Full Dedicated Details Page
  const handleOpenDetails = (row) => {
    setSelectedLoan(row);
    setViewMode("details");
  };

  // CSV Export
  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = ["Loan ID", "Customer Name", "Phone", "Loan Type", "EMI Amount", "Due Date", "Principal", "Interest", "Status", "Payment Date"];
    const rows = filteredData.map((item) => [
      item.id,
      `"${item.customerName}"`,
      item.phone,
      `"${item.loanType}"`,
      item.emiAmount,
      item.dueDate,
      item.principal || 0,
      item.interest || 0,
      item.computedStatus,
      item.paymentDate || "-",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EMI_Schedule_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getLoanIcon = (type = "") => {
    if (type.includes("Home")) return <Home size={15} className="type-icon home" />;
    if (type.includes("Personal")) return <User size={15} className="type-icon personal" />;
    if (type.includes("Business")) return <Briefcase size={15} className="type-icon business" />;
    if (type.includes("Education")) return <GraduationCap size={15} className="type-icon edu" />;
    return <Home size={15} />;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return <span className="status-badge badge-paid">Paid</span>;
      case "Upcoming":
        return <span className="status-badge badge-upcoming">Upcoming</span>;
      case "Pending":
      case "Due":
        return <span className="status-badge badge-pending">Due</span>;
      case "Overdue":
        return <span className="status-badge badge-overdue">Overdue</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "-") return "-";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  // Render Dedicated EMI Details View if active
  if (viewMode === "details") {
    return (
      <EMIDetails
        loanData={selectedLoan}
        onBack={() => {
          setViewMode("list");
          setSelectedLoan(null);
        }}
      />
    );
  }

  return (
    <div className="emi-schedule-container">
      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h1 className="page-title">EMI Schedule</h1>
          <p className="page-subtitle">View and manage EMI schedules for all loans</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setIsCalcOpen(true)}>
            <Calculator size={16} /> EMI Calculator
          </button>
          <button className="btn-primary" onClick={handleExportCSV}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* SUMMARY METRICS */}
      <div className="summary-cards-row">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Total Loans</span>
            <div className="metric-icon icon-blue"><Calendar size={18} /></div>
          </div>
          <div className="metric-value">{summaryMetrics.totalLoans}</div>
          <div className="metric-subtext">All active approved loans</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Total EMI</span>
            <div className="metric-icon icon-green"><CheckCircle2 size={18} /></div>
          </div>
          <div className="metric-value">₹{summaryMetrics.totalEMI.toLocaleString("en-IN")}</div>
          <div className="metric-subtext">All EMIs scheduled</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Paid EMI</span>
            <div className="metric-icon icon-amber"><TrendingUp size={18} /></div>
          </div>
          <div className="metric-value">{summaryMetrics.paidEMI}</div>
          <div className="metric-subtext green-text">{summaryMetrics.paidPercentage}% of total</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Pending EMI</span>
            <div className="metric-icon icon-red"><Clock size={18} /></div>
          </div>
          <div className="metric-value">{summaryMetrics.pendingEMI}</div>
          <div className="metric-subtext red-text">{summaryMetrics.pendingPercentage}% of total</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Overdue EMI</span>
            <div className="metric-icon icon-purple"><AlertCircle size={18} /></div>
          </div>
          <div className="metric-value">{summaryMetrics.overdueEMI}</div>
          <div className="metric-subtext purple-text">{summaryMetrics.overduePercentage}% of total</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Next EMI Due</span>
            <div className="metric-icon icon-cyan"><Clock size={18} /></div>
          </div>
          <div className="metric-value">{summaryMetrics.nextDueDate}</div>
          <div className="metric-subtext green-text">Upcoming Installment</div>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Loan ID, Customer Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-dropdowns">
          <div className="filter-group">
            <label>Loan / Application</label>
            <select value={selectedLoanId} onChange={(e) => setSelectedLoanId(e.target.value)}>
              <option value="All Loans">All Loans</option>
              {uniqueLoanIds.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Loan Type</label>
            <select value={selectedLoanType} onChange={(e) => setSelectedLoanType(e.target.value)}>
              <option value="All Types">All Types</option>
              <option value="Home Loan">Home Loan</option>
              <option value="Personal Loan">Personal Loan</option>
              <option value="Business Loan">Business Loan</option>
              <option value="Education Loan">Education Loan</option>
            </select>
          </div>

          <div className="filter-group">
            <label>EMI Status</label>
            <select value={selectedStatusFilter} onChange={(e) => setSelectedStatusFilter(e.target.value)}>
              <option value="All Status">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Pending">Pending / Due</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <button
            className={`btn-filter-icon ${showAdvancedFilters ? "active" : ""}`}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* ADVANCED FILTER PANEL */}
      {showAdvancedFilters && (
        <div className="advanced-filter-panel">
          <p className="filter-hint">Active Filters Applied: <strong>{filteredData.length}</strong> matching records found.</p>
          <button className="btn-reset-filters" onClick={() => {
            setSearchTerm("");
            setSelectedLoanId("All Loans");
            setSelectedLoanType("All Types");
            setSelectedStatusFilter("All Status");
          }}>
            Reset All Filters
          </button>
        </div>
      )}

      {/* TABLE CARD */}
      <div className="table-card">
        <div className="table-tabs">
          {["All EMIs", "Paid", "Pending", "Overdue", "Upcoming"].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="table-responsive">
          <table className="emi-main-table">
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Customer Name</th>
                <th>Loan Type</th>
                <th>EMI Amount</th>
                <th>Due Date</th>
                <th>Principal (₹)</th>
                <th>Interest (₹)</th>
                <th>Total EMI (₹)</th>
                <th>Status</th>
                <th>Payment Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr key={row.id}>
                    <td className="loan-id-cell">{row.id}</td>
                    <td>
                      <div className="cust-info">
                        <span className="cust-name">{row.customerName}</span>
                        <span className="cust-phone">{row.phone}</span>
                      </div>
                    </td>
                    <td>
                      <div className="loan-type-pill">
                        {getLoanIcon(row.loanType)}
                        <span>{row.loanType}</span>
                      </div>
                    </td>
                    <td className="amount-cell">₹{Number(row.emiAmount).toLocaleString("en-IN")}</td>
                    <td className="date-cell">{formatDate(row.dueDate)}</td>
                    <td className="sub-amount">₹{Number(row.principal || 0).toLocaleString("en-IN")}</td>
                    <td className="sub-amount">₹{Number(row.interest || 0).toLocaleString("en-IN")}</td>
                    <td className="amount-cell">₹{Number(row.emiAmount).toLocaleString("en-IN")}</td>
                    <td>{getStatusBadge(row.computedStatus)}</td>
                    <td className="date-cell">{formatDate(row.paymentDate)}</td>
                    <td className="action-cell">
                      {/* Direct Eye Action Button to open Full Details Page */}
                      <button
                        className="btn-icon-action btn-eye"
                        title="View Details"
                        onClick={() => handleOpenDetails(row)}
                      >
                        <Eye size={18} />
                      </button>

                      {/* Functional More Menu Button */}
                      <div className="more-menu-wrapper" ref={activeActionMenuId === row.id ? dropdownRef : null}>
                        <button
                          className={`btn-icon-action btn-more ${activeActionMenuId === row.id ? "active" : ""}`}
                          title="More Actions"
                          onClick={() =>
                            setActiveActionMenuId(activeActionMenuId === row.id ? null : row.id)
                          }
                        >
                          <MoreVertical size={18} />
                        </button>

                        {activeActionMenuId === row.id && (
                          <div className="action-dropdown-menu">
                            <button onClick={() => handleAction("sendLink", row)}>
                              <Send size={14} /> Send Payment Link
                            </button>
                            {row.computedStatus !== "Paid" && (
                              <button onClick={() => handleAction("markPaid", row)}>
                                <CheckCircle size={14} /> Mark as Paid
                              </button>
                            )}
                            <button onClick={() => handleAction("downloadInvoice", row)}>
                              <FileText size={14} /> Download Receipt
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="empty-table">
                    No matching EMI records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* DYNAMIC PAGINATION */}
        <div className="table-pagination">
          <span className="pagination-info">
            Showing {filteredData.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to{" "}
            {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
          </span>
          <div className="pagination-pages">
            <button
              className="page-arrow"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`page-num ${currentPage === pageNum ? "active" : ""}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}

            <button
              className="page-arrow"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: EMI CALCULATOR */}
      {isCalcOpen && (
        <div className="modal-overlay" onClick={() => setIsCalcOpen(false)}>
          <div className="calc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>EMI Calculator</h3>
              <button className="btn-close" onClick={() => setIsCalcOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="calc-modal-body">
              <div className="calc-input-field">
                <label>Loan Amount (₹)</label>
                <input type="number" value={calcAmount} onChange={(e) => setCalcAmount(e.target.value)} />
              </div>

              <div className="calc-input-field">
                <label>Interest Rate (% p.a.)</label>
                <input type="number" step="0.1" value={calcRate} onChange={(e) => setCalcRate(e.target.value)} />
              </div>

              <div className="calc-input-field">
                <label>Tenure (Months)</label>
                <input type="number" value={calcTenure} onChange={(e) => setCalcTenure(e.target.value)} />
              </div>

              <button className="btn-calc-submit" onClick={handleCalculate}>Calculate</button>

              <div className="calc-results-box">
                <div className="res-row">
                  <span>Monthly EMI:</span>
                  <strong>₹{calcResult.emi.toLocaleString("en-IN")}</strong>
                </div>
                <div className="res-row">
                  <span>Total Interest:</span>
                  <strong>₹{calcResult.interest.toLocaleString("en-IN")}</strong>
                </div>
                <div className="res-row highlight">
                  <span>Total Repayment:</span>
                  <strong>₹{calcResult.total.toLocaleString("en-IN")}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EMISchedule;