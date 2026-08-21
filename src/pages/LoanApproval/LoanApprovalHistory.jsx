import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  CheckCircle,
  XCircle,
  RotateCcw,
  Calendar,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Home,
  User,
  Briefcase,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  FileText,
  Percent,
  X,
} from "lucide-react";
import "./LoanApprovalHistory.css";

const LoanApprovalHistory = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customerIdFilter = searchParams.get("customerId");

  const [historyList, setHistoryList] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Extra Filters
  const [loanTypeFilter, setLoanTypeFilter] = useState("ALL");
  const [amountRangeFilter, setAmountRangeFilter] = useState("ALL");
  const [reviewerFilter, setReviewerFilter] = useState("ALL");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Modal / Drawer state for View details action
  const [selectedApp, setSelectedApp] = useState(null);

  // Dummy fallback data if localStorage is empty for rich presentation
  const mockHistoryData = [
    {
      id: "LA-10021",
      name: "Rahul Sharma",
      mobile: "9876543210",
      loanType: "Home Loan",
      loanAmount: "850000",
      status: "Approved",
      decisionBy: "Admin User",
      decisionDate: "17 Aug 2025",
      decisionTime: "02:45 PM",
      remarks: "Good repayment capacity and stable salary income.",
      creditScore: 780,
    },
    {
      id: "LA-10018",
      name: "Neha Verma",
      mobile: "9876543211",
      loanType: "Personal Loan",
      loanAmount: "250000",
      status: "Rejected",
      decisionBy: "Admin User",
      decisionDate: "16 Aug 2025",
      decisionTime: "11:30 AM",
      remarks: "High existing financial obligations.",
      creditScore: 610,
    },
    {
      id: "LA-10017",
      name: "Amit Mishra",
      mobile: "9876543212",
      loanType: "Business Loan",
      loanAmount: "1200000",
      status: "Approved",
      decisionBy: "Admin User",
      decisionDate: "16 Aug 2025",
      decisionTime: "10:15 AM",
      remarks: "Meets all eligibility criteria and clear bank statement.",
      creditScore: 765,
    },
    {
      id: "LA-10016",
      name: "Pooja Singh",
      mobile: "9876543213",
      loanType: "Education Loan",
      loanAmount: "475000",
      status: "Sent Back",
      decisionBy: "Admin User",
      decisionDate: "15 Aug 2025",
      decisionTime: "04:20 PM",
      remarks: "Please provide updated 6-month bank statement.",
      creditScore: 690,
    },
    {
      id: "LA-10015",
      name: "Vikram Kumar",
      mobile: "9876543214",
      loanType: "Home Loan",
      loanAmount: "1500000",
      status: "Approved",
      decisionBy: "Admin User",
      decisionDate: "14 Aug 2025",
      decisionTime: "03:10 PM",
      remarks: "Strong profile and excellent credit score.",
      creditScore: 810,
    },
    {
      id: "LA-10014",
      name: "Sunita Kapoor",
      mobile: "9876543215",
      loanType: "Personal Loan",
      loanAmount: "180000",
      status: "Rejected",
      decisionBy: "Admin User",
      decisionDate: "14 Aug 2025",
      decisionTime: "01:05 PM",
      remarks: "Low credit score below policy minimum threshold.",
      creditScore: 580,
    },
    {
      id: "LA-10013",
      name: "Deepak Patel",
      mobile: "9876543216",
      loanType: "Business Loan",
      loanAmount: "950000",
      status: "Sent Back",
      decisionBy: "Admin User",
      decisionDate: "13 Aug 2025",
      decisionTime: "05:40 PM",
      remarks: "ITR document required for current fiscal year.",
      creditScore: 670,
    },
    {
      id: "LA-10012",
      name: "Meera Rao",
      mobile: "9876543217",
      loanType: "Home Loan",
      loanAmount: "680000",
      status: "Approved",
      decisionBy: "Admin User",
      decisionDate: "13 Aug 2025",
      decisionTime: "11:20 AM",
      remarks: "Eligible and stable income record verified.",
      creditScore: 750,
    },
  ];

  useEffect(() => {
    const savedApps = JSON.parse(localStorage.getItem("loanApplications")) || [];

    // Filter only processed decisions
    let history = savedApps.filter(
      (app) => app.status && app.status !== "Pending Approval" && app.status !== "Pending"
    );

    // If storage is empty, load initial mock data for seamless demo preview
    if (history.length === 0) {
      history = mockHistoryData;
    }

    if (customerIdFilter) {
      history = history.filter(
        (app) => String(app.customerId) === String(customerIdFilter)
      );
    }

    setHistoryList(history);
  }, [customerIdFilter]);

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab, loanTypeFilter, amountRangeFilter, reviewerFilter]);

  // Metric Calculation
  const totalApproved = historyList.filter((i) => i.status === "Approved").length;
  const totalRejected = historyList.filter((i) => i.status === "Rejected").length;
  const totalSentBack = historyList.filter(
    (i) => i.status === "Sent Back" || i.status === "Need More Information" || i.status === "Under Review"
  ).length;
  const totalDecisions = historyList.length;
  const approvalRate = totalDecisions > 0 ? Math.round((totalApproved / totalDecisions) * 100) : 0;

  // Filter Logic
  const filteredData = historyList.filter((item) => {
    const name = item.name || item.applicantName || "";
    const appId = item.id || item.applicationId || "";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "ALL" ||
      (activeTab === "Approved" && item.status === "Approved") ||
      (activeTab === "Rejected" && item.status === "Rejected") ||
      (activeTab === "Sent Back" &&
        (item.status === "Sent Back" || item.status === "Need More Information" || item.status === "Under Review"));

    const matchesType =
      loanTypeFilter === "ALL" || item.loanType === loanTypeFilter;

    const numericAmount = Number(String(item.loanAmount || 0).replace(/[^0-9]/g, ""));
    let matchesAmount = true;
    if (amountRangeFilter === "LOW") matchesAmount = numericAmount < 300000;
    if (amountRangeFilter === "MID") matchesAmount = numericAmount >= 300000 && numericAmount <= 1000000;
    if (amountRangeFilter === "HIGH") matchesAmount = numericAmount > 1000000;

    const matchesReviewer =
      reviewerFilter === "ALL" || (item.decisionBy || "Admin User") === reviewerFilter;

    return matchesSearch && matchesTab && matchesType && matchesAmount && matchesReviewer;
  });

  // Pagination Math
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTableData = filteredData.slice(startIndex, endIndex);

  const getLoanIcon = (type = "") => {
    if (type.includes("Home")) return <Home size={14} className="loan-icon-svg" />;
    if (type.includes("Personal")) return <User size={14} className="loan-icon-svg" />;
    if (type.includes("Business")) return <Briefcase size={14} className="loan-icon-svg" />;
    return <GraduationCap size={14} className="loan-icon-svg" />;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <span className="pill-badge badge-approved">Approved</span>;
      case "Rejected":
        return <span className="pill-badge badge-rejected">Rejected</span>;
      default:
        return <span className="pill-badge badge-sentback">Sent Back</span>;
    }
  };

  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      alert("No decision logs available to export!");
      return;
    }

    const headers = ["Application ID,Applicant Name,Loan Type,Amount,Status,Decision By,Decision Date,Remarks"];
    const rows = filteredData.map((row) => {
      const rawAmt = String(row.loanAmount || "0").replace(/[^0-9]/g, "");
      return `"${row.id || ""}","${row.name || ""}","${row.loanType || ""}","${rawAmt}","${row.status || ""}","${row.decisionBy || "Admin User"}","${row.decisionDate || ""}","${row.remarks || row.decisionReason || ""}"`;
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Approval_History_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="finone-history-wrapper">
      {/* HEADER SECTION */}
      <div className="history-page-header">
        <div>
          <Link to="/loan-approval" className="back-bread">
            <ArrowLeft size={14} /> Back to Loan Approval
          </Link>
          <h1>Approval History</h1>
          <p>Track all loan application decisions and outcomes</p>
        </div>
        <button className="btn-export-csv" onClick={handleExportCSV}>
          <Download size={15} /> Export
        </button>
      </div>

      {/* TOP SUMMARY METRIC CARDS */}
      <div className="history-metrics-grid">
        <div className="hist-metric-card">
          <div className="metric-icon-box bg-green-light">
            <CheckCircle size={20} className="text-green-dark" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Approved</span>
            <h2>{totalApproved}</h2>
            <div className="metric-trend text-green-dark">
              <span>{totalDecisions > 0 ? ((totalApproved / totalDecisions) * 100).toFixed(1) : 0}% of total decisions</span>
              <span className="sparkline-mini green-spark">📈</span>
            </div>
          </div>
        </div>

        <div className="hist-metric-card">
          <div className="metric-icon-box bg-red-light">
            <XCircle size={20} className="text-red-dark" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Rejected</span>
            <h2>{totalRejected}</h2>
            <div className="metric-trend text-red-dark">
              <span>{totalDecisions > 0 ? ((totalRejected / totalDecisions) * 100).toFixed(1) : 0}% of total decisions</span>
              <span className="sparkline-mini red-spark">📉</span>
            </div>
          </div>
        </div>

        <div className="hist-metric-card">
          <div className="metric-icon-box bg-amber-light">
            <RotateCcw size={20} className="text-amber-dark" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Sent Back</span>
            <h2>{totalSentBack}</h2>
            <div className="metric-trend text-amber-dark">
              <span>{totalDecisions > 0 ? ((totalSentBack / totalDecisions) * 100).toFixed(1) : 0}% of total decisions</span>
              <span className="sparkline-mini amber-spark">📈</span>
            </div>
          </div>
        </div>

        <div className="hist-metric-card">
          <div className="metric-icon-box bg-purple-light">
            <FileText size={20} className="text-purple-dark" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Decisions</span>
            <h2>{totalDecisions}</h2>
            <div className="metric-trend text-purple-dark">
              <span>All time</span>
              <span className="sparkline-mini purple-spark">📈</span>
            </div>
          </div>
        </div>

        <div className="hist-metric-card">
          <div className="metric-icon-box bg-blue-light">
            <Percent size={20} className="text-blue-dark" />
          </div>
          <div className="metric-info">
            <span className="metric-label">Approval Rate</span>
            <h2>{approvalRate}%</h2>
            <div className="metric-trend text-blue-dark">
              <span>+8.6% vs last month</span>
              <span className="sparkline-mini blue-spark">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BAR ROW */}
      <div className="filters-tab-container">
        <div className="tabs-pill-group">
          <button
            className={`tab-item ${activeTab === "ALL" ? "active" : ""}`}
            onClick={() => setActiveTab("ALL")}
          >
            All <span className="tab-badge">{totalDecisions}</span>
          </button>
          <button
            className={`tab-item ${activeTab === "Approved" ? "active" : ""}`}
            onClick={() => setActiveTab("Approved")}
          >
            Approved <span className="tab-badge green">{totalApproved}</span>
          </button>
          <button
            className={`tab-item ${activeTab === "Rejected" ? "active" : ""}`}
            onClick={() => setActiveTab("Rejected")}
          >
            Rejected <span className="tab-badge red">{totalRejected}</span>
          </button>
          <button
            className={`tab-item ${activeTab === "Sent Back" ? "active" : ""}`}
            onClick={() => setActiveTab("Sent Back")}
          >
            Sent Back <span className="tab-badge amber">{totalSentBack}</span>
          </button>
        </div>

        {/* SECONDARY FILTERS */}
        <div className="dropdown-filter-group">
          <div className="search-box-sm">
            <Search size={14} className="s-icon" />
            <input
              type="text"
              placeholder="Search ID, Applicant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="select-pill">
            <select
              value={loanTypeFilter}
              onChange={(e) => setLoanTypeFilter(e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="Home Loan">Home Loan</option>
              <option value="Personal Loan">Personal Loan</option>
              <option value="Business Loan">Business Loan</option>
              <option value="Education Loan">Education Loan</option>
            </select>
          </div>

          <div className="select-pill">
            <select
              value={amountRangeFilter}
              onChange={(e) => setAmountRangeFilter(e.target.value)}
            >
              <option value="ALL">All Amounts</option>
              <option value="LOW">&lt; ₹3 Lakhs</option>
              <option value="MID">₹3L - ₹10L</option>
              <option value="HIGH">&gt; ₹10 Lakhs</option>
            </select>
          </div>

          <div className="select-pill">
            <select
              value={reviewerFilter}
              onChange={(e) => setReviewerFilter(e.target.value)}
            >
              <option value="ALL">All Decision Users</option>
              <option value="Admin User">Admin User</option>
              <option value="Senior Risk Analyst">Senior Risk Analyst</option>
            </select>
          </div>
        </div>
      </div>

      {/* MAIN DATA TABLE */}
      <div className="history-table-card">
        <table className="history-data-table">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Applicant</th>
              <th>Loan Type</th>
              <th>Requested Amount</th>
              <th>Decision</th>
              <th>Decision By</th>
              <th>Decision Date</th>
              <th>Remarks</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTableData.length > 0 ? (
              currentTableData.map((row, idx) => {
                const name = row.name || row.applicantName || "N/A";
                const initials = name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                const rawAmt = String(row.loanAmount || "0").replace(/[^0-9]/g, "");
                const numericAmt = Number(rawAmt) || 0;

                return (
                  <tr key={idx}>
                    <td className="id-link-cell">
                      <span>{row.id || `LA-100${idx}`}</span>
                    </td>
                    <td>
                      <div className="applicant-profile-cell">
                        <div className={`avatar-circle avatar-bg-${idx % 5}`}>
                          {initials}
                        </div>
                        <div className="applicant-info">
                          <span className="app-name">{name}</span>
                          <span className="app-sub">{row.mobile || "9876543210"}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="loan-type-box">
                        {getLoanIcon(row.loanType || "Home Loan")}
                        <span>{row.loanType || "Home Loan"}</span>
                      </div>
                    </td>
                    <td className="amount-text">
                      ₹{numericAmt.toLocaleString("en-IN")}
                    </td>
                    <td>{getStatusBadge(row.status)}</td>
                    <td className="decision-by-text">{row.decisionBy || "Admin User"}</td>
                    <td>
                      <div className="date-main">{row.decisionDate || "17 Aug 2025"}</div>
                      <div className="time-sub">{row.decisionTime || "02:45 PM"}</div>
                    </td>
                    <td>
                      <p className="table-remarks-text">
                        {row.remarks || row.decisionReason || "Meets all criteria"}
                      </p>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="btn-action-view"
                        title="Quick View Details"
                        onClick={() => setSelectedApp(row)}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="no-data-td">
                  No decision history logs found matching filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION FOOTER */}
        <div className="table-pagination-footer">
          <div className="showing-entries-text">
            Showing {filteredData.length > 0 ? startIndex + 1 : 0} to{" "}
            {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
          </div>

          <div className="pagination-controls">
            <button
              className="page-arrow"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`page-num-btn ${currentPage === pageNum ? "active" : ""}`}
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

          <div className="per-page-select">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={5}>5 / page</option>
              <option value={8}>8 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
            </select>
          </div>
        </div>
      </div>

      {/* QUICK VIEW DRAWER / MODAL */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Application Decision Summary</h2>
                <p className="sub-modal-id">{selectedApp.id || "LA-10021"}</p>
              </div>
              <button className="btn-close-modal" onClick={() => setSelectedApp(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-row-card">
                <span className="label">Applicant Name</span>
                <span className="val bold">{selectedApp.name || selectedApp.applicantName}</span>
              </div>
              <div className="detail-row-card">
                <span className="label">Loan Type</span>
                <span className="val">{selectedApp.loanType}</span>
              </div>
              <div className="detail-row-card">
                <span className="label">Amount Requested</span>
                <span className="val amount">
                  ₹{Number(String(selectedApp.loanAmount).replace(/[^0-9]/g, "")).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="detail-row-card">
                <span className="label">Decision Status</span>
                <span className="val">{getStatusBadge(selectedApp.status)}</span>
              </div>
              <div className="detail-row-card">
                <span className="label">Evaluated By</span>
                <span className="val">{selectedApp.decisionBy || "Admin User"}</span>
              </div>
              <div className="detail-row-card">
                <span className="label">Timestamp</span>
                <span className="val">{selectedApp.decisionDate || "17 Aug 2025"} {selectedApp.decisionTime || "02:45 PM"}</span>
              </div>

              <div className="remarks-box-modal">
                <label>Reviewer Decision Notes & Remarks:</label>
                <p>{selectedApp.remarks || selectedApp.decisionReason || "All background checks passed successfully."}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-full-review"
                onClick={() => navigate(`/loan-details/${selectedApp.id}`, { state: { applicationData: selectedApp } })}
              >
                Open Full Application Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanApprovalHistory;