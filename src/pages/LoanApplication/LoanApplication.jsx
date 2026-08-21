import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Columns3,
  Download,
  ChevronDown,
  MoreVertical,
  Trash2,
  CheckCircle,
  XCircle,
  FileText,
  
} from "lucide-react";

import user1 from "../../assets/users/user1.jpg";
import user2 from "../../assets/users/user2.jpg";
import user3 from "../../assets/users/user3.jpg";
import user4 from "../../assets/users/user4.jpg";
import user5 from "../../assets/users/user5.jpg";

import "./LoanApplicationList.css";

const defaultLoanApplications = [
  {
    id: "LA-10301",
    customerId: "CUST-10001",
    name: "Rahul Sharma",
    avatar: user1,
    mobile: "9876543210",
    email: "rahul.sharma@example.com",
    loanType: "Home Loan",
    loanAmount: "₹ 25,00,000",
    status: "Pending",
    appliedOn: "17 May 2024",
  },
  {
    id: "LA-10302",
    customerId: "CUST-10002",
    name: "Neha Verma",
    avatar: user2,
    mobile: "9876543211",
    email: "neha.verma@example.com",
    loanType: "Personal Loan",
    loanAmount: "₹ 5,00,000",
    status: "Under Review",
    appliedOn: "16 May 2024",
  },
  {
    id: "LA-10303",
    customerId: "CUST-10003",
    name: "Amit Patel",
    avatar: user3,
    mobile: "9876543212",
    email: "amit.patel@example.com",
    loanType: "Business Loan",
    loanAmount: "₹ 15,00,000",
    status: "Approved",
    appliedOn: "15 May 2024",
  },
  {
    id: "LA-10304",
    customerId: "CUST-10004",
    name: "Priya Singh",
    avatar: user4,
    mobile: "9876543213",
    email: "priya.singh@example.com",
    loanType: "Home Loan",
    loanAmount: "₹ 30,00,000",
    status: "Rejected",
    appliedOn: "14 May 2024",
  },
  {
    id: "LA-10305",
    customerId: "CUST-10005",
    name: "Rohit Kumar",
    avatar: user5,
    mobile: "9876543214",
    email: "rohit.kumar@example.com",
    loanType: "Vehicle Loan",
    loanAmount: "₹ 8,00,000",
    status: "Pending",
    appliedOn: "12 May 2024",
  },
];

const LoanApplication = () => {
  const navigate = useNavigate();
  
  const [customers, setCustomers] = useState([]);

  // Primary State
  const [loans, setLoans] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [loanTypeFilter, setLoanTypeFilter] = useState("All Loan Types");
  const [showColumns, setShowColumns] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Dropdown Control State
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  const applicationsPerPage = 5;

  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    customer: true,
    loanType: true,
    loanAmount: true,
    status: true,
    appliedOn: true,
    actions: true,
  });

  const formatLoanItem = (item) => {
    const rawName = item.name || item.fullName || item.applicantName || "N/A";
    const rawAmount = item.loanAmount || item.amount || item.requestedAmount || "₹ 0";
    const rawType = item.loanType || item.type || "Personal Loan";
    const rawStatus = item.status || "Pending";
    const rawDate = item.appliedOn || item.createdAt || new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });

    return {
      ...item,
      id: item.id || `LA-${Math.floor(10000 + Math.random() * 90000)}`,
      name: rawName,
      email: item.email || `${rawName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      loanAmount: typeof rawAmount === "number" ? `₹ ${rawAmount.toLocaleString("en-IN")}` : rawAmount.startsWith("₹") ? rawAmount : `₹ ${rawAmount}`,
      loanType: rawType,
      status: rawStatus,
      appliedOn: rawDate,
      mobile: item.mobile || item.phone || item.contact || "",
    };
  };

  const loadLoanApplications = () => {
    try {
      const savedCustomersRaw = localStorage.getItem("customers");
      if (savedCustomersRaw) {
      setCustomers(JSON.parse(savedCustomersRaw));
    }
      const savedLoansRaw = localStorage.getItem("loanApplications");
      
      if (!savedLoansRaw) {
        localStorage.setItem("loanApplications", JSON.stringify(defaultLoanApplications));
        setLoans(defaultLoanApplications);
      } else {
        const parsed = JSON.parse(savedLoansRaw);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map(formatLoanItem);
          setLoans(normalized);
        } else {
          setLoans(defaultLoanApplications);
        }
      }
    } catch (err) {
      console.error("Error loading loan applications:", err);
      setLoans(defaultLoanApplications);
    }
  };

  // Helper function to get customer's updated avatar
const getCustomerAvatar = (app) => {
  // customerId ya email se match dhoondhein
  const matchedCustomer = customers.find(
    (c) =>
      (c.id && app.customerId && String(c.id) === String(app.customerId)) ||
      (c.email && app.email && c.email.toLowerCase() === app.email.toLowerCase())
  );

  // Match milne par uski photo/avatar, nahi to fallback to app.avatar ya default user1
  return matchedCustomer?.avatar || matchedCustomer?.photo || app.avatar ;
};

  useEffect(() => {
    loadLoanApplications();

    const handleFocus = () => loadLoanApplications();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // Close More menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLoans = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return loans.filter((item) => {
      const appId = String(item.id || "").toLowerCase();
      const applicantName = String(item.name || "").toLowerCase();
      const mobile = String(item.mobile || "");
      const loanType = String(item.loanType || "");
      const status = String(item.status || "");

      const matchesSearch =
        appId.includes(searchTerm) ||
        applicantName.includes(searchTerm) ||
        mobile.includes(searchTerm);

      const matchesStatus =
        statusFilter === "All Status" || status.toLowerCase() === statusFilter.toLowerCase();

      const matchesLoanType =
        loanTypeFilter === "All Loan Types" || loanType.toLowerCase() === loanTypeFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesLoanType;
    });
  }, [loans, search, statusFilter, loanTypeFilter]);

  const indexOfLastItem = currentPage * applicationsPerPage;
  const indexOfFirstItem = indexOfLastItem - applicationsPerPage;
  const currentLoans = filteredLoans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLoans.length / applicationsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, loanTypeFilter]);

  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      loadLoanApplications();
      setLoading(false);
    }, 300);
  };

  const handleAddNew = () => navigate("/loans/add");
  const handleViewDetails = (id) => navigate(`/loans/${id}`);
  const handleEditDetails = (id) => navigate(`/loans/${id}/edit`);

  // Dropdown Menu Dynamic Handlers
  const toggleMoreMenu = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updated = loans.map((item) =>
      String(item.id) === String(id) ? { ...item, status: newStatus } : item
    );
    setLoans(updated);
    localStorage.setItem("loanApplications", JSON.stringify(updated));
    setActiveMenuId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Kya aap loan application #${id} ko delete karna chahte hain?`)) {
      const updatedLoans = loans.filter((item) => String(item.id) !== String(id));
      setLoans(updatedLoans);
      localStorage.setItem("loanApplications", JSON.stringify(updatedLoans));
      setActiveMenuId(null);
    }
  };

  const handleDownloadReceipt = (app) => {
    const receiptContent = `
========================================
       LOAN APPLICATION RECEIPT
========================================
Application ID : ${app.id}
Customer Name  : ${app.name}
Contact Mobile : ${app.mobile || "N/A"}
Email Address  : ${app.email || "N/A"}
Loan Category  : ${app.loanType}
Requested Amt  : ${app.loanAmount}
Current Status : ${app.status}
Applied Date   : ${app.appliedOn}
========================================
Generated On   : ${new Date().toLocaleString()}
    `;

    const blob = new Blob([receiptContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Receipt_${app.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setActiveMenuId(null);
  };

  const handleSendEmail = (app) => {
    const subject = encodeURIComponent(`Update regarding Loan Application ${app.id}`);
    const body = encodeURIComponent(
      `Hello ${app.name},\n\nThis is an official update regarding your ${app.loanType} application (${app.id}).\nCurrent Status: ${app.status}.\n\nRegards,\nLoan Approval Team`
    );
    window.location.href = `mailto:${app.email}?subject=${subject}&body=${body}`;
    setActiveMenuId(null);
  };

  const handleExport = () => {
    if (filteredLoans.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = ["Application ID", "Customer Name", "Loan Type", "Loan Amount", "Status", "Applied Date"];
    const rows = filteredLoans.map((app) => [
      app.id || "",
      app.name || "",
      app.loanType || "",
      app.loanAmount || "",
      app.status || "",
      app.appliedOn || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `loan-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalCount = loans.length;
  const pendingCount = loans.filter((l) => String(l.status).toLowerCase() === "pending").length;
  const reviewCount = loans.filter((l) => String(l.status).toLowerCase().includes("review")).length;
  const approvedCount = loans.filter((l) => String(l.status).toLowerCase() === "approved").length;
  const rejectedCount = loans.filter((l) => String(l.status).toLowerCase() === "rejected").length;

  return (
    <section className="loan-page">
      <div className="loan-page-header">
        <div>
          <h1>Loan Application</h1>
          <p>Manage and track all loan applications</p>
        </div>
        <button className="add-loan-btn" onClick={handleAddNew}>
          <Plus size={18} />
          New Application
        </button>
      </div>

      <div className="loan-summary">
        <div className="summary-card">
          <span>Total Applications</span>
          <h2>{totalCount}</h2>
          <p>All-time applications</p>
        </div>
        <div className="summary-card">
          <span>Pending Applications</span>
          <h2>{pendingCount}</h2>
          <p>Awaiting review</p>
        </div>
        <div className="summary-card">
          <span>Under Review</span>
          <h2>{reviewCount}</h2>
          <p>Currently in process</p>
        </div>
        <div className="summary-card">
          <span>Approved</span>
          <h2>{approvedCount}</h2>
          <p>Successfully approved</p>
        </div>
        <div className="summary-card">
          <span>Rejected</span>
          <h2>{rejectedCount}</h2>
          <p>Applications rejected</p>
        </div>
      </div>

      <div className="loan-filters">
        <div className="loan-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name, mobile, loan type or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All Status</option>
          <option>Pending</option>
          <option>Under Review</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>

        <select value={loanTypeFilter} onChange={(e) => setLoanTypeFilter(e.target.value)}>
          <option>All Loan Types</option>
          <option>Home Loan</option>
          <option>Personal Loan</option>
          <option>Business Loan</option>
          <option>Vehicle Loan</option>
        </select>
      </div>

      <div className="loan-table-card">
        <div className="table-top">
          <div>
            <h2>Loan Applications</h2>
            <p>Showing {filteredLoans.length} of {totalCount} entries</p>
          </div>

          <div className="table-actions">
            <button className="table-action-btn" onClick={handleRefresh}>
              <RefreshCw size={16} className={loading ? "refresh-spin" : ""} />
              Refresh
            </button>

            <div className="columns-wrapper">
              <button
                className="table-action-btn"
                onClick={() => setShowColumns(!showColumns)}
              >
                <Columns3 size={16} />
                Columns
                <ChevronDown size={14} />
              </button>

              {showColumns && (
                <div className="columns-menu">
                  <div className="columns-menu-header">
                    <span>Show Columns</span>
                  </div>
                  <div className="box-head">
                    {Object.keys(visibleColumns).map((colKey) => (
                      <label key={colKey}>
                        <input
                          type="checkbox"
                          checked={visibleColumns[colKey]}
                          onChange={() => toggleColumn(colKey)}
                        />
                        {colKey.charAt(0).toUpperCase() + colKey.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="table-action-btn" onClick={handleExport}>
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {visibleColumns.id && <th>Application ID</th>}
                {visibleColumns.customer && <th>Customer</th>}
                {visibleColumns.loanType && <th>Loan Type</th>}
                {visibleColumns.loanAmount && <th>Loan Amount</th>}
                {visibleColumns.status && <th>Status</th>}
                {visibleColumns.appliedOn && <th>Applied On</th>}
                {visibleColumns.actions && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="table-loading">
                    Loading applications...
                  </td>
                </tr>
              ) : currentLoans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="table-loading">
                    No loan applications found.
                  </td>
                </tr>
              ) : (
                currentLoans.map((app) => (
                  <tr key={app.id}>
                    {visibleColumns.id && (
                      <td>
                        <span className="application-id">{app.id}</span>
                      </td>
                    )}

                    {visibleColumns.customer && (
                     <td>
                      <div className="customer-info">
                       {getCustomerAvatar(app) ? (
                      <img src={getCustomerAvatar(app)} alt={app.name}className="user-avatar-img"
                      />
                       ) : (
                      <div className="user-avatar-placeholder">
                      {(app.name || "U").charAt(0).toUpperCase()}
                     </div>
                     )}
                      <div className="customer-meta">
                      <span className="customer-name-text">{app.name}</span>
                      {app.mobile && (
                      <span className="customer-sub-text">{app.mobile}</span>
                      )}
                      </div>
                     </div>
                     </td>
)}

                    {visibleColumns.loanType && <td>{app.loanType}</td>}
                    {visibleColumns.loanAmount && (
                      <td className="amount-cell">{app.loanAmount}</td>
                    )}

                    {visibleColumns.status && (
                      <td>
                        <span
                          className={`status-badge ${String(app.status)
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {app.status}
                        </span>
                      </td>
                    )}

                    {visibleColumns.appliedOn && <td>{app.appliedOn}</td>}

                    {visibleColumns.actions && (
  <td className="actions-cell-wrapper">
    <div className="table-actions-inline">
      {/* FIXED: 'application.id' changed to 'app.id' */}
      <button
        title="View Details"
        onClick={() => handleViewDetails(app.id)}
      >
        <Eye size={17} />
      </button>

      <button
        title="Edit"
        onClick={() => handleEditDetails(app.id)}
      >
        <Pencil size={17} />
      </button>

      {/* More Options Dropdown */}
      <div 
        className="more-action-container" 
        ref={activeMenuId === app.id ? menuRef : null}
      >
        <button
          title="More Options"
          className={`more-btn ${activeMenuId === app.id ? "active" : ""}`}
          onClick={() => toggleMoreMenu(app.id)}
        >
          <MoreVertical size={17} />
        </button>

        {activeMenuId === app.id && (
          <div className="actions-dropdown-menu">
            <button
              className="dropdown-item"
              onClick={() => handleUpdateStatus(app.id, "Approved")}
            >
              <CheckCircle size={15} className="text-success" />
              <span>Mark Approved</span>
            </button>
            <button
              className="dropdown-item"
              onClick={() => handleUpdateStatus(app.id, "Rejected")}
            >
              <XCircle size={15} className="text-danger" />
              <span>Mark Rejected</span>
            </button>
            <button
              className="dropdown-item"
              onClick={() => handleDownloadReceipt(app)}
            >
              <FileText size={15} />
              <span>Download Summary</span>
            </button>
            
            <div className="dropdown-divider"></div>
            <button
              className="dropdown-item delete-item"
              onClick={() => handleDelete(app.id)}
            >
              <Trash2 size={15} />
              <span>Delete Application</span>
            </button>
          </div>
        )}
      </div>
    </div>
  </td>
)}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={currentPage === idx + 1 ? "active" : ""}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default LoanApplication;