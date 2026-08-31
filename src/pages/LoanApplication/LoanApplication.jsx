
import React, {
  useState,
  useEffect,
  useMemo,
} from "react";

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

/*
|--------------------------------------------------------------------------
| FORMAT LOAN APPLICATION
|--------------------------------------------------------------------------
*/

const formatLoanItem = (item) => {
  const rawName =
    item.name ||
    item.fullName ||
    item.applicantName ||
    "N/A";

  const rawAmount =
    item.loanAmount ??
    item.amount ??
    item.requestedAmount ??
    "0";

  const rawType =
    item.loanType ||
    item.type ||
    "Personal Loan";

  const rawStatus =
    item.status ||
    "Pending";

  const todayFormatted =
    new Date().toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  const rawAppliedDate =
    item.appliedOn ||
    item.createdAt ||
    todayFormatted;

  const rawUpdatedDate =
    item.updatedOn ||
    rawAppliedDate;

  let formattedAmount = "₹ 0";

  if (typeof rawAmount === "number") {
    formattedAmount =
      `₹ ${rawAmount.toLocaleString("en-IN")}`;
  } else {
    const amountString =
      String(rawAmount);

    formattedAmount =
      amountString.startsWith("₹")
        ? amountString
        : `₹ ${amountString}`;
  }

  return {
    ...item,

    id:
      item.id ||
      `LA-${Date.now()}`,

    name: rawName,

    email:
      item.email ||
      `${rawName
        .toLowerCase()
        .replace(/\s+/g, ".")}@example.com`,

    loanAmount: formattedAmount,

    loanType: rawType,

    status: rawStatus,

    appliedOn: rawAppliedDate,

    updatedOn: rawUpdatedDate,

    actionDate:
      item.actionDate ||
      rawUpdatedDate,

    approvalDate:
      item.approvalDate ||
      (rawStatus === "Approved"
        ? rawUpdatedDate
        : null),

    rejectionDate:
      item.rejectionDate ||
      (rawStatus === "Rejected"
        ? rawUpdatedDate
        : null),

    mobile:
      item.mobile ||
      item.phone ||
      item.contact ||
      "",
  };
};

/*
|--------------------------------------------------------------------------
| LOAN APPLICATION COMPONENT
|--------------------------------------------------------------------------
*/

const LoanApplication = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] =
    useState([]);

  const [loans, setLoans] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [loanTypeFilter, setLoanTypeFilter] =
    useState("All Loan Types");

  const [showColumns, setShowColumns] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  const [activeMenuId, setActiveMenuId] =
    useState(null);

  const [notification, setNotification] =
    useState(null);

  const applicationsPerPage = 5;

  /*
  |--------------------------------------------------------------------------
  | VISIBLE COLUMNS
  |--------------------------------------------------------------------------
  */

  const [visibleColumns, setVisibleColumns] =
    useState({
      id: true,
      customer: true,
      loanType: true,
      loanAmount: true,
      status: true,
      appliedOn: true,
      actions: true,
    });

  /*
  |--------------------------------------------------------------------------
  | TOAST
  |--------------------------------------------------------------------------
  */

  const triggerToast = (
    message,
    type = "success"
  ) => {
    setNotification({
      message,
      type,
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  /*
  |--------------------------------------------------------------------------
  | LOAD CUSTOMERS + LOANS
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  |
  | This function does NOT hide orphaned loans.
  |
  | If a loan has a customerId and that customer
  | no longer exists, the loan is PERMANENTLY
  | removed from localStorage["loanApplications"].
  |
  |--------------------------------------------------------------------------
  */

  const loadLoanApplications = () => {
    try {
      /*
      |--------------------------------------------------------------------------
      | LOAD CUSTOMERS
      |--------------------------------------------------------------------------
      */

      const savedCustomersRaw =
        localStorage.getItem(
          "customers"
        );

      let currentCustomers = [];

      if (savedCustomersRaw) {
        try {
          const parsedCustomers =
            JSON.parse(
              savedCustomersRaw
            );

          if (
            Array.isArray(
              parsedCustomers
            )
          ) {
            currentCustomers =
              parsedCustomers;
          }
        } catch (customerError) {
          console.error(
            "Error parsing customers:",
            customerError
          );

          currentCustomers = [];
        }
      }

      setCustomers(
        currentCustomers
      );

      /*
      |--------------------------------------------------------------------------
      | LOAD LOAN APPLICATIONS
      |--------------------------------------------------------------------------
      */

      const savedLoansRaw =
        localStorage.getItem(
          "loanApplications"
        );

      /*
      |--------------------------------------------------------------------------
      | NO LOANS
      |--------------------------------------------------------------------------
      */

      if (!savedLoansRaw) {
        setLoans([]);
        return;
      }

      let parsedLoans = [];

      try {
        parsedLoans =
          JSON.parse(
            savedLoansRaw
          );
      } catch (loanError) {
        console.error(
          "Error parsing loanApplications:",
          loanError
        );

        setLoans([]);
        return;
      }

      if (
        !Array.isArray(parsedLoans)
      ) {
        setLoans([]);
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | REMOVE LOANS FOR DELETED CUSTOMERS
      |--------------------------------------------------------------------------
      |
      | A loan with customerId is linked to a customer.
      |
      | If that customer no longer exists,
      | remove the loan from the actual stored array.
      |
      | A loan WITHOUT customerId is kept.
      | This allows manually-created applications.
      |--------------------------------------------------------------------------
      */

      const cleanedLoans =
        parsedLoans.filter(
          (loan) => {
            /*
            |--------------------------------------------------------------
            | Manual application without customerId
            |--------------------------------------------------------------
            */

            if (
              !loan.customerId
            ) {
              return true;
            }

            /*
            |--------------------------------------------------------------
            | Check whether linked customer still exists
            |--------------------------------------------------------------
            */

            const customerExists =
              currentCustomers.some(
                (customer) =>
                  customer.id &&
                  String(
                    customer.id
                  ) ===
                    String(
                      loan.customerId
                    )
              );

            return customerExists;
          }
        );

      /*
      |--------------------------------------------------------------------------
      | SAVE CLEANED DATA
      |--------------------------------------------------------------------------
      |
      | THIS IS THE IMPORTANT PART.
      |
      | We are not just filtering the table.
      | We actually update localStorage.
      |--------------------------------------------------------------------------
      */

      const customerDeletedLoans =
        cleanedLoans.length !==
        parsedLoans.length;

      if (
        customerDeletedLoans
      ) {
        localStorage.setItem(
          "loanApplications",
          JSON.stringify(
            cleanedLoans
          )
        );

        /*
        |--------------------------------------------------------------------------
        | Notify other components
        |--------------------------------------------------------------------------
        */

        window.dispatchEvent(
          new Event(
            "loansUpdated"
          )
        );
      }

      /*
      |--------------------------------------------------------------------------
      | UPDATE REACT STATE
      |--------------------------------------------------------------------------
      */

      setLoans(
        cleanedLoans.map(
          formatLoanItem
        )
      );
    } catch (err) {
      console.error(
        "Error loading loan applications:",
        err
      );

      setCustomers([]);
      setLoans([]);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE LOANS
  |--------------------------------------------------------------------------
  */

  const saveLoansToStorage = (
    updatedLoans
  ) => {
    try {
      /*
      |--------------------------------------------------------------------------
      | Update React state
      |--------------------------------------------------------------------------
      */

      setLoans(
        updatedLoans
      );

      /*
      |--------------------------------------------------------------------------
      | Update localStorage
      |--------------------------------------------------------------------------
      */

      localStorage.setItem(
        "loanApplications",
        JSON.stringify(
          updatedLoans
        )
      );

      /*
      |--------------------------------------------------------------------------
      | Notify other components
      |--------------------------------------------------------------------------
      */

      window.dispatchEvent(
        new Event(
          "loansUpdated"
        )
      );
    } catch (err) {
      console.error(
        "Failed to update loanApplications:",
        err
      );

      triggerToast(
        "Failed to save loan application.",
        "danger"
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | CUSTOMER AVATAR
  |--------------------------------------------------------------------------
  */

  const getCustomerAvatar = (
    app
  ) => {
    const matchedCustomer =
      customers.find(
        (customer) => {
          const idMatches =
            customer.id &&
            app.customerId &&
            String(
              customer.id
            ) ===
              String(
                app.customerId
              );

          const emailMatches =
            customer.email &&
            app.email &&
            String(
              customer.email
            ).toLowerCase() ===
              String(
                app.email
              ).toLowerCase();

          return (
            idMatches ||
            emailMatches
          );
        }
      );

    return (
      matchedCustomer?.avatar ||
      matchedCustomer?.photo ||
      app.avatar
    );
  };

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD + SYNC
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    /*
    |--------------------------------------------------------------------------
    | Initial load
    |--------------------------------------------------------------------------
    */

    loadLoanApplications();

    /*
    |--------------------------------------------------------------------------
    | Handle changes from other pages/components
    |--------------------------------------------------------------------------
    */

    const handleSync = () => {
      loadLoanApplications();
    };

    /*
    |--------------------------------------------------------------------------
    | Browser focus
    |--------------------------------------------------------------------------
    */

    window.addEventListener(
      "focus",
      handleSync
    );

    /*
    |--------------------------------------------------------------------------
    | localStorage changes
    |--------------------------------------------------------------------------
    */

    window.addEventListener(
      "storage",
      handleSync
    );

    /*
    |--------------------------------------------------------------------------
    | Loan changes
    |--------------------------------------------------------------------------
    */

    window.addEventListener(
      "loansUpdated",
      handleSync
    );

    /*
    |--------------------------------------------------------------------------
    | Customer changes
    |--------------------------------------------------------------------------
    |
    | When customer list deletes a customer,
    | this event causes loan cleanup.
    |--------------------------------------------------------------------------
    */

    window.addEventListener(
      "customersUpdated",
      handleSync
    );

    /*
    |--------------------------------------------------------------------------
    | Cleanup
    |--------------------------------------------------------------------------
    */

    return () => {
      window.removeEventListener(
        "focus",
        handleSync
      );

      window.removeEventListener(
        "storage",
        handleSync
      );

      window.removeEventListener(
        "loansUpdated",
        handleSync
      );

      window.removeEventListener(
        "customersUpdated",
        handleSync
      );
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CLOSE MORE MENU WHEN CLICKING OUTSIDE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleClickOutside = (
      event
    ) => {
      if (
        !event.target.closest(
          ".more-action-container"
        )
      ) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FILTER LOANS
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  |
  | There is NO customer filtering here.
  |
  | Deleted customers' loans have already been
  | permanently removed from the loans array/storage.
  |--------------------------------------------------------------------------
  */

  const filteredLoans = useMemo(() => {
    const searchTerm =
      search
        .toLowerCase()
        .trim();

    return loans.filter(
      (item) => {
        const appId =
          String(
            item.id || ""
          ).toLowerCase();

        const applicantName =
          String(
            item.name || ""
          ).toLowerCase();

        const mobile =
          String(
            item.mobile || ""
          ).toLowerCase();

        const loanType =
          String(
            item.loanType || ""
          ).toLowerCase();

        const status =
          String(
            item.status || ""
          ).toLowerCase();

        /*
        |--------------------------------------------------------------------------
        | SEARCH
        |--------------------------------------------------------------------------
        */

        const matchesSearch =
          appId.includes(
            searchTerm
          ) ||
          applicantName.includes(
            searchTerm
          ) ||
          mobile.includes(
            searchTerm
          ) ||
          loanType.includes(
            searchTerm
          );

        /*
        |--------------------------------------------------------------------------
        | STATUS FILTER
        |--------------------------------------------------------------------------
        */

        const matchesStatus =
          statusFilter ===
            "All Status" ||
          status ===
            statusFilter.toLowerCase();

        /*
        |--------------------------------------------------------------------------
        | LOAN TYPE FILTER
        |--------------------------------------------------------------------------
        */

        const matchesLoanType =
          loanTypeFilter ===
            "All Loan Types" ||
          loanType ===
            loanTypeFilter.toLowerCase();

        return (
          matchesSearch &&
          matchesStatus &&
          matchesLoanType
        );
      }
    );
  }, [
    loans,
    search,
    statusFilter,
    loanTypeFilter,
  ]);

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const totalPages =
    Math.ceil(
      filteredLoans.length /
        applicationsPerPage
    );

  const indexOfLastItem =
    currentPage *
    applicationsPerPage;

  const indexOfFirstItem =
    indexOfLastItem -
    applicationsPerPage;

  const currentLoans =
    filteredLoans.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

  /*
  |--------------------------------------------------------------------------
  | RESET PAGE WHEN FILTER CHANGES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    loanTypeFilter,
  ]);

  /*
  |--------------------------------------------------------------------------
  | COLUMN TOGGLE
  |--------------------------------------------------------------------------
  */

  const toggleColumn = (
    columnKey
  ) => {
    setVisibleColumns(
      (prev) => ({
        ...prev,

        [columnKey]:
          !prev[columnKey],
      })
    );
  };

  /*
  |--------------------------------------------------------------------------
  | REFRESH
  |--------------------------------------------------------------------------
  */

  const handleRefresh = () => {
    setLoading(true);

    setTimeout(() => {
      loadLoanApplications();

      setLoading(false);
    }, 300);
  };

  /*
  |--------------------------------------------------------------------------
  | NAVIGATION
  |--------------------------------------------------------------------------
  */

  const handleAddNew = () => {
    navigate("/loans/add");
  };

  const handleViewDetails = (
    id
  ) => {
    navigate(
      `/loans/${id}`
    );
  };

  const handleEditDetails = (
    id
  ) => {
    navigate(
      `/loans/${id}/edit`
    );
  };

  /*
  |--------------------------------------------------------------------------
  | MORE MENU
  |--------------------------------------------------------------------------
  */

  const toggleMoreMenu = (
    id
  ) => {
    setActiveMenuId(
      (prev) =>
        prev === id
          ? null
          : id
    );
  };

  /*
  |--------------------------------------------------------------------------
  | UPDATE STATUS
  |--------------------------------------------------------------------------
  */

  const handleUpdateStatus = (
    id,
    newStatus
  ) => {
    const todayDate =
      new Date().toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    const updated =
      loans.map(
        (item) => {
          if (
            String(
              item.id
            ) ===
            String(id)
          ) {
            return {
              ...item,

              status:
                newStatus,

              updatedOn:
                todayDate,

              actionDate:
                todayDate,

              approvalDate:
                newStatus ===
                "Approved"
                  ? todayDate
                  : item.approvalDate,

              rejectionDate:
                newStatus ===
                "Rejected"
                  ? todayDate
                  : item.rejectionDate,
            };
          }

          return item;
        }
      );

    /*
    |--------------------------------------------------------------------------
    | SAVE ACTUAL DATA
    |--------------------------------------------------------------------------
    */

    saveLoansToStorage(
      updated
    );

    /*
    |--------------------------------------------------------------------------
    | NOTIFICATION
    |--------------------------------------------------------------------------
    */

    addNotification(
      `Loan #${id} ${newStatus}`,
      `Application #${id} status changed to ${newStatus}.`,
      newStatus ===
        "Approved"
        ? "approved"
        : newStatus ===
          "Rejected"
        ? "rejected"
        : "application"
    );

    setActiveMenuId(
      null
    );

    triggerToast(
      `Loan #${id} marked as ${newStatus}. Redirecting to Notifications...`,
      "success"
    );

    /*
    |--------------------------------------------------------------------------
    | REDIRECT
    |--------------------------------------------------------------------------
    */

    setTimeout(() => {
      navigate(
        "/notifications"
      );
    }, 1000);
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE LOAN APPLICATION
  |--------------------------------------------------------------------------
  */

  const handleDelete = (
    id
  ) => {
    if (
      !window.confirm(
        `Are you sure you want to delete loan application #${id}?`
      )
    ) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | ACTUALLY REMOVE THE LOAN
    |--------------------------------------------------------------------------
    */

    const updatedLoans =
      loans.filter(
        (item) =>
          String(
            item.id
          ) !==
          String(id)
      );

    /*
    |--------------------------------------------------------------------------
    | SAVE REMOVED ARRAY
    |--------------------------------------------------------------------------
    */

    saveLoansToStorage(
      updatedLoans
    );

    setActiveMenuId(
      null
    );

    /*
    |--------------------------------------------------------------------------
    | FIX PAGE IF LAST ITEM WAS DELETED
    |--------------------------------------------------------------------------
    */

    const newTotalPages =
      Math.ceil(
        updatedLoans.length /
          applicationsPerPage
      );

    if (
      currentPage >
        newTotalPages &&
      newTotalPages > 0
    ) {
      setCurrentPage(
        newTotalPages
      );
    }

    triggerToast(
      `Loan #${id} deleted successfully.`,
      "danger"
    );
  };

  /*
  |--------------------------------------------------------------------------
  | DOWNLOAD RECEIPT
  |--------------------------------------------------------------------------
  */

  const handleDownloadReceipt = (
    app
  ) => {
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

    const blob =
      new Blob(
        [receiptContent],
        {
          type:
            "text/plain;charset=utf-8",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `Receipt_${app.id}.txt`;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(
      url
    );

    setActiveMenuId(
      null
    );
  };

  /*
  |--------------------------------------------------------------------------
  | EXPORT CSV
  |--------------------------------------------------------------------------
  */

  const handleExport = () => {
    if (
      filteredLoans.length ===
      0
    ) {
      alert(
        "No data available to export."
      );

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

    const rows =
      filteredLoans.map(
        (app) => [
          app.id || "",
          app.name || "",
          app.loanType || "",
          app.loanAmount || "",
          app.status || "",
          app.appliedOn || "",
          app.updatedOn || "",
        ]
      );

    const csvContent =
      [headers, ...rows]
        .map(
          (row) =>
            row
              .map(
                (value) =>
                  `"${String(
                    value
                  ).replace(
                    /"/g,
                    '""'
                  )}"`
              )
              .join(",")
        )
        .join("\r\n");

    const blob =
      new Blob(
        [
          "\uFEFF" +
            csvContent,
        ],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `loan-applications-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(
      url
    );
  };

  /*
  |--------------------------------------------------------------------------
  | METRICS
  |--------------------------------------------------------------------------
  |
  | These counts now use the REAL loans array.
  |
  | Because deleted customer's loans are physically
  | removed from loanApplications, these numbers
  | will decrease correctly.
  |--------------------------------------------------------------------------
  */

  const totalCount =
    loans.length;

  const pendingCount =
    loans.filter(
      (loan) =>
        String(
          loan.status
        ).toLowerCase() ===
        "pending"
    ).length;

  const reviewCount =
    loans.filter(
      (loan) =>
        String(
          loan.status
        )
          .toLowerCase()
          .includes(
            "review"
          )
    ).length;

  const approvedCount =
    loans.filter(
      (loan) =>
        String(
          loan.status
        ).toLowerCase() ===
        "approved"
    ).length;

  const rejectedCount =
    loans.filter(
      (loan) =>
        String(
          loan.status
        ).toLowerCase() ===
        "rejected"
    ).length;

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <section className="loan-page">

      {/* TOAST */}

      {notification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding:
              "12px 20px",
            borderRadius:
              "8px",
            color: "#fff",
            backgroundColor:
              notification.type ===
              "danger"
                ? "#ef4444"
                : "#10b981",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
            fontWeight:
              "bold",
            transition:
              "all 0.3s ease",
          }}
        >
          {
            notification.message
          }
        </div>
      )}

      {/* HEADER */}

      <div className="loan-page-header">

        <div>
          <h1>
            Loan Application
          </h1>

          <p>
            Manage and track all loan
            applications
          </p>
        </div>

        <button
          className="add-loan-btn"
          onClick={
            handleAddNew
          }
        >
          <Plus size={18} />

          New Application
        </button>

      </div>

      {/* SUMMARY */}

      <div className="loan-summary">

        <div className="summary-card">
          <span>
            Total Applications
          </span>

          <h2>
            {totalCount}
          </h2>

          <p>
            All-time applications
          </p>
        </div>

        <div className="summary-card">
          <span>
            Pending Applications
          </span>

          <h2>
            {pendingCount}
          </h2>

          <p>
            Awaiting review
          </p>
        </div>

        <div className="summary-card">
          <span>
            Under Review
          </span>

          <h2>
            {reviewCount}
          </h2>

          <p>
            Currently in process
          </p>
        </div>

        <div className="summary-card">
          <span>
            Approved
          </span>

          <h2>
            {approvedCount}
          </h2>

          <p>
            Successfully approved
          </p>
        </div>

        <div className="summary-card">
          <span>
            Rejected
          </span>

          <h2>
            {rejectedCount}
          </h2>

          <p>
            Applications rejected
          </p>
        </div>

      </div>

      {/* FILTERS */}

      <div className="loan-filters">

        <div className="loan-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search by name, mobile, loan type or ID..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
        >
          <option>
            All Status
          </option>

          <option>
            Pending
          </option>

          <option>
            Under Review
          </option>

          <option>
            Approved
          </option>

          <option>
            Rejected
          </option>
        </select>

        <select
          value={loanTypeFilter}
          onChange={(e) =>
            setLoanTypeFilter(
              e.target.value
            )
          }
        >
          <option>
            All Loan Types
          </option>

          <option>
            Home Loan
          </option>

          <option>
            Personal Loan
          </option>

          <option>
            Business Loan
          </option>

          <option>
            Vehicle Loan
          </option>

        </select>

      </div>

      {/* TABLE CARD */}

      <div className="loan-table-card">

        <div className="table-top">

          <div>

            <h2>
              Loan Applications
            </h2>

            <p>
              Showing{" "}
              {
                filteredLoans.length
              }{" "}
              of{" "}
              {totalCount}{" "}
              entries
            </p>

          </div>

          <div className="table-actions">

            {/* REFRESH */}

            <button
              className="table-action-btn"
              onClick={
                handleRefresh
              }
            >
              <RefreshCw
                size={16}
                className={
                  loading
                    ? "refresh-spin"
                    : ""
                }
              />

              Refresh
            </button>

            {/* COLUMNS */}

            <div className="columns-wrapper">

              <button
                className="table-action-btn"
                onClick={() =>
                  setShowColumns(
                    !showColumns
                  )
                }
              >
                <Columns3
                  size={16}
                />

                Columns

                <ChevronDown
                  size={14}
                />

              </button>

              {showColumns && (
                <div className="columns-menu">

                  <div className="columns-menu-header">

                    <span>
                      Show Columns
                    </span>

                  </div>

                  <div className="box-head">

                    {Object.keys(
                      visibleColumns
                    ).map(
                      (
                        colKey
                      ) => (
                        <label
                          key={
                            colKey
                          }
                        >

                          <input
                            type="checkbox"
                            checked={
                              visibleColumns[
                                colKey
                              ]
                            }
                            onChange={() =>
                              toggleColumn(
                                colKey
                              )
                            }
                          />

                          {colKey
                            .charAt(
                              0
                            )
                            .toUpperCase() +
                            colKey.slice(
                              1
                            )}

                        </label>
                      )
                    )}

                  </div>

                </div>
              )}

            </div>

            {/* EXPORT */}

            <button
              className="table-action-btn"
              onClick={
                handleExport
              }
            >
              <Download
                size={16}
              />

              Export
            </button>

          </div>

        </div>

        {/* TABLE */}

        <div className="table-wrapper">

          <table>

            <thead>

              <tr>

                {visibleColumns.id && (
                  <th>
                    Application ID
                  </th>
                )}

                {visibleColumns.customer && (
                  <th>
                    Customer
                  </th>
                )}

                {visibleColumns.loanType && (
                  <th>
                    Loan Type
                  </th>
                )}

                {visibleColumns.loanAmount && (
                  <th>
                    Loan Amount
                  </th>
                )}

                {visibleColumns.status && (
                  <th>
                    Status
                  </th>
                )}

                {visibleColumns.appliedOn && (
                  <th>
                    Applied On
                  </th>
                )}

                {visibleColumns.actions && (
                  <th>
                    Actions
                  </th>
                )}

              </tr>

            </thead>

            <tbody>

              {/* LOADING */}

              {loading ? (

                <tr>

                  <td
                    colSpan={7}
                    className="table-loading"
                  >
                    Loading applications...
                  </td>

                </tr>

              ) : currentLoans.length ===
                0 ? (

                /* EMPTY */

                <tr>

                  <td
                    colSpan={7}
                    className="table-loading"
                  >
                    No loan applications
                    found.
                  </td>

                </tr>

              ) : (

                /* DATA */

                currentLoans.map(
                  (app) => (

                    <tr
                      key={
                        app.id
                      }
                    >

                      {/* APPLICATION ID */}

                      {visibleColumns.id && (
                        <td>

                          <span className="application-id">
                            {
                              app.id
                            }
                          </span>

                        </td>
                      )}

                      {/* CUSTOMER */}

                      {visibleColumns.customer && (
                        <td>

                          <div className="customer-info">

                            {getCustomerAvatar(
                              app
                            ) ? (

                              <img
                                src={getCustomerAvatar(
                                  app
                                )}
                                alt={
                                  app.name
                                }
                                className="user-avatar-img"
                              />

                            ) : (

                              <div className="user-avatar-placeholder">

                                {(
                                  app.name ||
                                  "U"
                                )
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase()}

                              </div>

                            )}

                            <div className="customer-meta">

                              <span className="customer-name-text">
                                {
                                  app.name
                                }
                              </span>

                              {app.mobile && (
                                <span className="customer-sub-text">
                                  {
                                    app.mobile
                                  }
                                </span>
                              )}

                            </div>

                          </div>

                        </td>
                      )}

                      {/* LOAN TYPE */}

                      {visibleColumns.loanType && (
                        <td>
                          {
                            app.loanType
                          }
                        </td>
                      )}

                      {/* LOAN AMOUNT */}

                      {visibleColumns.loanAmount && (
                        <td className="amount-cell">
                          {
                            app.loanAmount
                          }
                        </td>
                      )}

                      {/* STATUS */}

                      {visibleColumns.status && (
                        <td>

                          <span
                            className={`status-badge ${String(
                              app.status
                            )
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )}`}
                          >
                            {
                              app.status
                            }
                          </span>

                        </td>
                      )}

                      {/* APPLIED DATE */}

                      {visibleColumns.appliedOn && (
                        <td>
                          {
                            app.appliedOn
                          }
                        </td>
                      )}

                      {/* ACTIONS */}

                      {visibleColumns.actions && (
                        <td className="actions-cell-wrapper">

                          <div className="table-actions-inline">

                            {/* VIEW */}

                            <button
                              title="View Details"
                              onClick={() =>
                                handleViewDetails(
                                  app.id
                                )
                              }
                            >
                              <Eye
                                size={
                                  17
                                }
                              />
                            </button>

                            {/* EDIT */}

                            <button
                              title="Edit"
                              onClick={() =>
                                handleEditDetails(
                                  app.id
                                )
                              }
                            >
                              <Pencil
                                size={
                                  17
                                }
                              />
                            </button>

                            {/* MORE */}

                            <div className="more-action-container">

                              <button
                                title="More Options"
                                className={`more-btn ${
                                  activeMenuId ===
                                  app.id
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() =>
                                  toggleMoreMenu(
                                    app.id
                                  )
                                }
                              >
                                <MoreVertical
                                  size={
                                    17
                                  }
                                />
                              </button>

                              {activeMenuId ===
                                app.id && (

                                <div className="actions-dropdown-menu">

                                  {/* APPROVE */}

                                  <button
                                    className="dropdown-item"
                                    onClick={() =>
                                      handleUpdateStatus(
                                        app.id,
                                        "Approved"
                                      )
                                    }
                                  >

                                    <CheckCircle
                                      size={
                                        15
                                      }
                                      className="text-success"
                                    />

                                    <span>
                                      Mark Approved
                                    </span>

                                  </button>

                                  {/* REJECT */}

                                  <button
                                    className="dropdown-item"
                                    onClick={() =>
                                      handleUpdateStatus(
                                        app.id,
                                        "Rejected"
                                      )
                                    }
                                  >

                                    <XCircle
                                      size={
                                        15
                                      }
                                      className="text-danger"
                                    />

                                    <span>
                                      Mark Rejected
                                    </span>

                                  </button>

                                  {/* RECEIPT */}

                                  <button
                                    className="dropdown-item"
                                    onClick={() =>
                                      handleDownloadReceipt(
                                        app
                                      )
                                    }
                                  >

                                    <FileText
                                      size={
                                        15
                                      }
                                    />

                                    <span>
                                      Download Summary
                                    </span>

                                  </button>

                                  <div className="dropdown-divider"></div>

                                  {/* DELETE */}

                                  <button
                                    className="dropdown-item delete-item"
                                    onClick={() =>
                                      handleDelete(
                                        app.id
                                      )
                                    }
                                  >

                                    <Trash2
                                      size={
                                        15
                                      }
                                    />

                                    <span>
                                      Delete Application
                                    </span>

                                  </button>

                                </div>

                              )}

                            </div>

                          </div>

                        </td>
                      )}

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}

        {totalPages > 0 && (

          <div className="pagination">

            <button
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    prev - 1
                )
              }
              disabled={
                currentPage ===
                1
              }
            >
              Previous
            </button>

            {Array.from({
              length:
                totalPages,
            }).map(
              (_, idx) => (

                <button
                  key={idx}
                  onClick={() =>
                    setCurrentPage(
                      idx + 1
                    )
                  }
                  className={
                    currentPage ===
                    idx + 1
                      ? "active"
                      : ""
                  }
                >
                  {idx + 1}
                </button>

              )
            )}

            <button
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    prev + 1
                )
              }
              disabled={
                currentPage ===
                totalPages
              }
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
