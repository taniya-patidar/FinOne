import React, { useState, useEffect, useMemo } from "react";
import {
  addNotification,
} from "../../services/notificationService";
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

import "./LoanApplicationList.css";

const defaultLoanApplications = [
  {
    id: "LA-10301",
    customerId: "CUST-10001",
    name: "Rahul Sharma",
    mobile: "9876543210",
    email: "rahul.sharma@example.com",
    loanType: "Home Loan",
    loanAmount: "₹ 25,00,000",
    status: "Pending",
    appliedOn: "17 May 2024",
    updatedOn: "17 May 2024",
  },
  {
    id: "LA-10302",
    customerId: "CUST-10002",
    name: "Neha Verma",
    mobile: "9876543211",
    email: "neha.verma@example.com",
    loanType: "Personal Loan",
    loanAmount: "₹ 5,00,000",
    status: "Under Review",
    appliedOn: "16 May 2024",
    updatedOn: "16 May 2024",
  },
  {
    id: "LA-10303",
    customerId: "CUST-10003",
    name: "Amit Patel",
    mobile: "9876543212",
    email: "amit.patel@example.com",
    loanType: "Business Loan",
    loanAmount: "₹ 15,00,000",
    status: "Approved",
    appliedOn: "15 May 2024",
    updatedOn: "15 May 2024",
    approvalDate: "15 May 2024",
  },
];

const formatLoanItem = (item) => {
  const rawName = item.name || item.fullName || item.applicantName || "N/A";
  const rawAmount = item.loanAmount || item.amount || item.requestedAmount || "₹ 0";
  const rawType = item.loanType || item.type || "Personal Loan";
  const rawStatus = item.status || "Pending";
  const todayFormatted = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const rawAppliedDate = item.appliedOn || item.createdAt || todayFormatted;
  const rawUpdatedDate = item.updatedOn || rawAppliedDate;

  return {
    ...item,
    id: item.id || `LA-${Math.floor(10000 + Math.random() * 90000)}`,
    name: rawName,
    email: item.email || `${rawName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    loanAmount:
      typeof rawAmount === "number"
        ? `₹ ${rawAmount.toLocaleString("en-IN")}`
        : rawAmount.startsWith("₹")
        ? rawAmount
        : `₹ ${rawAmount}`,
    loanType: rawType,
    status: rawStatus,
    appliedOn: rawAppliedDate,
    updatedOn: rawUpdatedDate,
    actionDate: item.actionDate || rawUpdatedDate,
    approvalDate: item.approvalDate || (rawStatus === "Approved" ? rawUpdatedDate : null),
    rejectionDate: item.rejectionDate || (rawStatus === "Rejected" ? rawUpdatedDate : null),
    mobile: item.mobile || item.phone || item.contact || "",
  };
};

const LoanApplication = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [loanTypeFilter, setLoanTypeFilter] = useState("All Loan Types");
  const [showColumns, setShowColumns] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [notification, setNotification] = useState(null);

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

  const triggerToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
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
        setLoans(defaultLoanApplications.map(formatLoanItem));
      } else {
        const parsed = JSON.parse(savedLoansRaw);
        if (Array.isArray(parsed)) {
          setLoans(parsed.map(formatLoanItem));
        } else {
          setLoans(defaultLoanApplications.map(formatLoanItem));
        }
      }
    } catch (err) {
      console.error("Error loading loan applications:", err);
      setLoans(defaultLoanApplications.map(formatLoanItem));
    }
  };

  const saveLoansToStorage = (updatedLoans) => {
    setLoans(updatedLoans);
    try {
      localStorage.setItem("loanApplications", JSON.stringify(updatedLoans));
    } catch (err) {
      console.error("Failed to update localStorage:", err);
    }
    window.dispatchEvent(new Event("loansUpdated"));
  };

  const getCustomerAvatar = (app) => {
    const matchedCustomer = customers.find(
      (c) =>
        (c.id && app.customerId && String(c.id) === String(app.customerId)) ||
        (c.email && app.email && c.email.toLowerCase() === app.email.toLowerCase())
    );
    return matchedCustomer?.avatar || matchedCustomer?.photo || app.avatar;
  };

  useEffect(() => {
    loadLoanApplications();

    const handleSync = () => loadLoanApplications();
    window.addEventListener("focus", handleSync);
    window.addEventListener("storage", handleSync);
    window.addEventListener("loansUpdated", handleSync);

    return () => {
      window.removeEventListener("focus", handleSync);
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("loansUpdated", handleSync);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".more-action-container")) {
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

  const totalPages = Math.ceil(filteredLoans.length / applicationsPerPage);
  const indexOfLastItem = currentPage * applicationsPerPage;
  const indexOfFirstItem = indexOfLastItem - applicationsPerPage;
  const currentLoans = filteredLoans.slice(indexOfFirstItem, indexOfLastItem);

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

  const toggleMoreMenu = (id) => {
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  const handleUpdateStatus = (id, newStatus) => {
    const todayDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const updated = loans.map((item) => {
      if (String(item.id) === String(id)) {
        return {
          ...item,
          status: newStatus,
          updatedOn: todayDate,
          actionDate: todayDate,
          approvalDate: newStatus === "Approved" ? todayDate : item.approvalDate,
          rejectionDate: newStatus === "Rejected" ? todayDate : item.rejectionDate,
        };
      }
      return item;
    });

    // LocalStorage me save karein
    saveLoansToStorage(updated);

 addNotification(
  `Loan #${id} ${newStatus}`,
  `Application #${id} status changed to ${newStatus}.`,
  newStatus === "Approved"
    ? "approved"
    : newStatus === "Rejected"
    ? "rejected"
    : "application"
);

    setActiveMenuId(null);
    triggerToast(`Loan #${id} marked as ${newStatus}. Redirecting to Notifications...`, "success");

    // Notifications page par redirect karein
    setTimeout(() => {
      navigate("/notifications");
    }, 1000);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete loan application #${id}?`)) {
      const updatedLoans = loans.filter((item) => String(item.id) !== String(id));
      saveLoansToStorage(updatedLoans);
      setActiveMenuId(null);
      triggerToast(`Loan #${id} deleted successfully.`, "danger");
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
Last Updated   : ${app.updatedOn || "N/A"}
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

  const handleExport = () => {
    if (filteredLoans.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = [
      "Application ID",
      "Customer Name",
      "Loan Type",
      "Loan Amount",
      "Status",
      "Applied Date",
      "Updated On",
    ];
    const rows = filteredLoans.map((app) => [
      app.id || "",
      app.name || "",
      app.loanType || "",
      app.loanAmount || "",
      app.status || "",
      app.appliedOn || "",
      app.updatedOn || "",
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
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "12px 20px",
            borderRadius: "8px",
            color: "#fff",
            backgroundColor: notification.type === "danger" ? "#ef4444" : "#10b981",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
            fontWeight: "bold",
            transition: "all 0.3s ease",
          }}
        >
          {notification.message}
        </div>
      )}
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
            <p>
              Showing {filteredLoans.length} of {totalCount} entries
            </p>
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
                            <img
                              src={getCustomerAvatar(app)}
                              alt={app.name}
                              className="user-avatar-img"
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

                          <div className="more-action-container">
                            <button
                              title="More Options"
                              className={`more-btn ${
                                activeMenuId === app.id ? "active" : ""
                              }`}
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