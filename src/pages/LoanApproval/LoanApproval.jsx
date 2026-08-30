import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Home,
  User,
  Briefcase,
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  History,
} from "lucide-react";
import "./LoanApproval.css";

// Helper Function: Loan Type ke hisab se default rate & tenure return karta h
const getLoanDefaults = (loanType = "") => {
  const type = loanType.toLowerCase();
  if (type.includes("home")) return { rate: 8.5, tenure: 240 };
  if (type.includes("personal")) return { rate: 12.0, tenure: 36 };
  if (type.includes("business")) return { rate: 13.5, tenure: 48 };
  if (type.includes("education")) return { rate: 9.5, tenure: 60 };
  return { rate: 10.5, tenure: 36 };
};

// Helper Function: Dynamic EMI Schedule Payload Generator (Fixed Key Extraction)
const createEMISchedulePayload = (app) => {
  const rawAmt = String(app.loanAmount || app.amount || "0").replace(/[^0-9]/g, "");
  const P = Number(rawAmt) || 500000;

  const defaults = getLoanDefaults(app.loanType);
  const rAnnual = Number(app.interestRate || app.rate || defaults.rate);
  
  // FIX: Dynamic Key Extraction for Tenure (Checks all possible key names)
  const tenureMonths = Number(
    app.tenure || app.tenureMonths || app.loanTenure || app.tenureInMonths || defaults.tenure
  );

  const r = rAnnual / 12 / 100;
  const emiAmount =
    r > 0
      ? Math.round((P * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1))
      : Math.round(P / tenureMonths);

  const monthlyInterest = Math.round(P * r);
  const monthlyPrincipal = Math.max(0, emiAmount - monthlyInterest);

  const today = new Date();
  const dueDate = new Date(today.setDate(today.getDate() + 15)).toISOString().split("T")[0];

  return {
    id: app.id || app.applicationId || `LA-${Math.floor(10000 + Math.random() * 90000)}`,
    customerName: app.name || app.applicantName || "Unknown Applicant",
    phone: app.mobile || app.phone || "9876543210",
    email: app.email || "applicant@example.com",
    loanType: app.loanType || "Personal Loan",
    loanAmount: P,
    interestRate: rAnnual,
    tenure: tenureMonths,           // Saved as tenure
    tenureMonths: tenureMonths,     // Saved as tenureMonths
    emiAmount: emiAmount,
    dueDate: app.dueDate || dueDate,
    principal: monthlyPrincipal > 0 ? monthlyPrincipal : Math.round(emiAmount * 0.7),
    interest: monthlyInterest > 0 ? monthlyInterest : Math.round(emiAmount * 0.3),
    paymentDate: null,
    status: "Approved",
  };
};

const LoanApproval = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("loanApplications")) || [];
    setApplications(saved);
  }, []);


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const getCreditClass = (tag = "") => {
    switch (tag.toLowerCase()) {
      case "excellent":
      case "good":
        return "badge-good";
      case "fair":
        return "badge-fair";
      case "poor":
        return "badge-poor";
      default:
        return "badge-fair";
    }
  };

  const getRiskClass = (level = "") => {
    switch (level.toLowerCase()) {
      case "low":
        return "risk-low";
      case "medium":
        return "risk-medium";
      case "high":
        return "risk-high";
      default:
        return "risk-low";
    }
  };

  const getStageClass = (stage = "") => {
    switch (stage.toLowerCase()) {
      case "approved":
        return "stage-approved";
      case "under review":
        return "stage-review";
      case "rejected":
        return "stage-rejected";
      default:
        return "stage-pending";
    }
  };

  const getLoanIcon = (type = "") => {
    if (type.includes("Home")) return <Home size={14} />;
    if (type.includes("Personal")) return <User size={14} />;
    if (type.includes("Business")) return <Briefcase size={14} />;
    return <GraduationCap size={14} />;
  };

  const counts = {
    pending: applications.filter(
      (a) => (a.status || "Pending") === "Pending"
    ).length,
    review: applications.filter((a) => a.status === "Under Review").length,
    approved: applications.filter((a) => a.status === "Approved").length,
    rejected: applications.filter((a) => a.status === "Rejected").length,
    drafts: applications.filter((a) => a.status === "Draft").length,
  };

  const filteredData = applications.filter((app) => {
    const appStatus = app.status || "Pending";
    const appName = app.name || app.applicantName || "";
    const appId = app.id || app.applicationId || "";

    const matchesStatus = appStatus === "Approved";

    const matchesSearch =
      appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

 const handleReviewClick = (app, creditScore) => {
    const selectedTenure = Number(
      app.tenure || app.tenureMonths || app.loanTenure || getLoanDefaults(app.loanType).tenure
    );

    const applicationDataWithDetails = {
      ...app,
      creditScore: app.creditScore || creditScore,
      loanType: app.loanType || "Home Loan",
      tenure: selectedTenure,
      tenureMonths: selectedTenure,
    };

    navigate(`/loan-details/${app.id || app.applicationId}`, {
      state: { applicationData: applicationDataWithDetails },
    });
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTableData = filteredData.slice(startIndex, endIndex);

  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      alert("No data available to export!");
      return;
    }

    const headers = [
      "Application ID,Applicant Name,Mobile,Loan Type,Amount,Status,Applied On,City",
    ];
    const rows = filteredData.map((row) => {
      const rawAmt = String(row.loanAmount || "0").replace(/[^0-9]/g, "");
      return `"${row.id || ""}","${row.name || ""}","${row.mobile || ""}","${
        row.loanType || ""
      }","${rawAmt}","${row.status || "Pending"}","${row.appliedOn || ""}","${
        row.city || ""
      }"`;
    });

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Loan_Applications_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="finone-container">
      <div className="page-header">
        <div>
          <h1>Loan Approval</h1>
          <p>Review and take action on loan applications</p>
        </div>

        {/* HEADER ACTIONS (Export CSV & View History) */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            className="btn-history"
            onClick={() => navigate("/loan-approval/history")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              backgroundColor: "var(--primary-blue, #2563eb)",
              color: "white",
              border: "1px solid #CBD5E1",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <History size={16} /> View Approval History
          </button>

          <button className="btn-export" onClick={handleExportCSV}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="icon-wrapper bg-orange">⏱</span>
            <div>
              <span className="metric-title">Pending Approval</span>
              <h2>{counts.pending}</h2>
            </div>
          </div>
          <div className="metric-footer">
            <span className="meta-text">Awaiting Review</span>
            <span className="sparkline orange-line">📈</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="icon-wrapper bg-blue">📄</span>
            <div>
              <span className="metric-title">Under Review</span>
              <h2>{counts.review}</h2>
            </div>
          </div>
          <div className="metric-footer">
            <span className="meta-text">In Processing</span>
            <span className="sparkline blue-line">📈</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="icon-wrapper bg-green">✓</span>
            <div>
              <span className="metric-title">Approved</span>
              <h2>{counts.approved}</h2>
            </div>
          </div>
          <div className="metric-footer">
            <span className="meta-text">Successful</span>
            <span className="sparkline green-line">📈</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="icon-wrapper bg-red">✕</span>
            <div>
              <span className="metric-title">Rejected</span>
              <h2>{counts.rejected}</h2>
            </div>
          </div>
          <div className="metric-footer">
            <span className="meta-text">Declined</span>
            <span className="sparkline red-line">📉</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="icon-wrapper bg-purple">
              <Clock size={18} />
            </span>
            <div>
              <span className="metric-title">Draft Applications</span>
              <h2>{counts.drafts}</h2>
            </div>
          </div>
          <div className="metric-footer">
            <span className="meta-text">Saved locally</span>
            <span className="sparkline purple-line">📈</span>
          </div>
        </div>
      </div>

      <div className="filters-card">
        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Applicant Name, Application ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="tabs-row">
        <button
          className={`tab-btn ${activeTab === "All" ? "active" : ""}`}
          onClick={() => setActiveTab("All")}
        >
          All Applications <span className="pill-count">{applications.length}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === "Pending" ? "active" : ""}`}
          onClick={() => setActiveTab("Pending")}
        >
          Pending Approval{" "}
          <span className="pill-count warning">{counts.pending}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === "Review" ? "active" : ""}`}
          onClick={() => setActiveTab("Review")}
        >
          Under Review <span className="pill-count info">{counts.review}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === "Approved" ? "active" : ""}`}
          onClick={() => setActiveTab("Approved")}
        >
          Approved <span className="pill-count green-pill">{counts.approved}</span>
        </button>
      </div>

      <div className="table-wrapper">
        <table className="finone-table">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Applicant</th>
              <th>Loan Type</th>
              <th>Requested Amount</th>
              <th>Credit Score</th>
              <th>Risk Level</th>
              <th>Applied On</th>
              <th>Current Stage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTableData.length > 0 ? (
              currentTableData.map((row, index) => {
                const itemKey = row.id || `app-${startIndex + index}`;

                const rawAmount = String(row.loanAmount || "0").replace(/[^0-9]/g, "");
                const numericAmount = Number(rawAmount) || 0;

                const name = row.name || row.applicantName || "N/A";
                const initials = name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                const creditScore = row.creditScore || 710 + ((index * 25) % 90);
                const creditTag =
                  creditScore >= 750 ? "Good" : creditScore >= 650 ? "Fair" : "Poor";
                const riskLevel =
                  creditScore >= 750 ? "Low" : creditScore >= 650 ? "Medium" : "High";

                return (
                  <tr key={itemKey}>
                    <td className="id-text">{row.id || `LA-${10000 + index}`}</td>
                    <td>
                      <div className="applicant-cell">
                        <span className="avatar-chip">{initials || "NA"}</span>
                        <div>
                          <div className="applicant-name">{name}</div>
                          <div className="sub-text">{row.mobile || "-"}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="loan-type-box">
                        {getLoanIcon(row.loanType || "Home Loan")}{" "}
                        {row.loanType || "Personal Loan"}
                      </span>
                    </td>
                    <td className="amount-text">
                      ₹{numericAmount.toLocaleString("en-IN")}
                    </td>
                    <td>
                      <div className="credit-cell">
                        <span className="score-num">{creditScore}</span>
                        <span className={`credit-badge ${getCreditClass(creditTag)}`}>
                          {creditTag}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`risk-badge ${getRiskClass(riskLevel)}`}>
                        {riskLevel}
                      </span>
                    </td>
                    <td>
                      <div className="date-main">{row.appliedOn || "Today"}</div>
                      <div className="sub-text">{row.city || ""}</div>
                    </td>
                    <td>
                      <span className={`stage-pill ${getStageClass(row.status || "Pending")}`}>
                        {row.status || "Pending Approval"}
                      </span>
                    </td>
                    <td className="actions-cell-wrapper">
                      <div className="actions-cell">
                        <button
                          className="btn-review"
                          onClick={() => handleReviewClick(row, creditScore)}
                        >
                          Review
                        </button>
                        
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="table-footer">
          <span>
            Showing {filteredData.length > 0 ? startIndex + 1 : 0} to{" "}
            {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
          </span>
          <div className="pagination">
            <button
              className="page-nav"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`page-num ${currentPage === pageNum ? "active" : ""}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}

            <button
              className="page-nav"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApproval;