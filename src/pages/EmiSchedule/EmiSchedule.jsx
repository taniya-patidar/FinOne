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

/* =========================================================
   LOCAL STORAGE KEYS
========================================================= */

const LOAN_APPLICATIONS_KEY = "loanApplications";
const APPROVED_EMI_KEY = "approvedEMISchedules";
const PAYMENTS_KEY = "emiPayments";
const NOTIFICATIONS_KEY = "notifications";

/* =========================================================
   SAFE LOCAL STORAGE HELPERS
========================================================= */

const readStorageArray = (key) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Unable to read localStorage key: ${key}`, error);
    return [];
  }
};

const writeStorageArray = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Unable to write localStorage key: ${key}`, error);
  }
};

/* =========================================================
   DATE HELPERS
========================================================= */

const normalizeDate = (dateValue) => {
  if (!dateValue) return null;

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(0, 0, 0, 0);
  return date;
};

const getEMIStatus = (dueDateStr, paymentDateStr) => {
  if (paymentDateStr) {
    return "Paid";
  }

  const today = normalizeDate(new Date());
  const dueDate = normalizeDate(dueDateStr);

  if (!dueDate) {
    return "Upcoming";
  }

  if (dueDate < today) {
    return "Overdue";
  }

  if (dueDate.getTime() === today.getTime()) {
    return "Pending";
  }

  return "Upcoming";
};

const getDaysDifference = (dateValue) => {
  const today = normalizeDate(new Date());
  const targetDate = normalizeDate(dateValue);

  if (!targetDate) return null;

  return Math.ceil(
    (targetDate.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
  );
};

/* =========================================================
   APPROVED LOAN SOURCE
========================================================= */

const getApprovedLoans = () => {
  const applications = readStorageArray(LOAN_APPLICATIONS_KEY);

  /*
    Primary source:
    loanApplications

    Only Approved loans are allowed.
  */
  if (applications.length > 0) {
    return applications.filter(
      (loan) =>
        String(loan.status || "").trim().toLowerCase() ===
        "approved"
    );
  }

  /*
    Backward compatibility:
    If the project currently only has approvedEMISchedules,
    use those records as fallback.

    Since these are already in the approved EMI collection,
    records without an explicit status are considered approved.
  */
  const approvedEMIs = readStorageArray(APPROVED_EMI_KEY);

  return approvedEMIs.filter((loan) => {
    if (!loan.status) return true;

    return (
      String(loan.status).trim().toLowerCase() === "approved"
    );
  });
};

/* =========================================================
   MAP LOAN DATA FOR EMI TABLE
========================================================= */

const mapLoanToEMIRow = (loan) => {
  return {
    ...loan,

    id:
      loan.id ||
      loan.loanId ||
      loan.applicationId ||
      "N/A",

    customerName:
      loan.customerName ||
      loan.name ||
      loan.applicantName ||
      "Unknown Customer",

    phone:
      loan.phone ||
      loan.mobile ||
      loan.phoneNumber ||
      "-",

    email:
      loan.email ||
      loan.customerEmail ||
      "-",

    loanType:
      loan.loanType ||
      loan.type ||
      "Loan",

    loanAmount:
      Number(
        loan.loanAmount ||
          loan.amount ||
          loan.requestedAmount ||
          0
      ),

    interestRate:
      Number(
        loan.interestRate ||
          loan.rate ||
          0
      ),

    loanTenure:
      Number(
        loan.loanTenure ||
          loan.tenureMonths ||
          loan.tenure ||
          loan.tenureInMonths ||
          0
      ),

    emiAmount:
      Number(
        loan.emiAmount ||
          loan.emi ||
          loan.monthlyEMI ||
          0
      ),

    dueDate:
      loan.dueDate ||
      loan.nextDueDate ||
      loan.firstEMIDate ||
      loan.startDate ||
      loan.disbursementDate ||
      "",

    startDate:
      loan.startDate ||
      loan.approvalDate ||
      loan.disbursementDate ||
      "",

    disbursementDate:
      loan.disbursementDate ||
      loan.startDate ||
      loan.approvalDate ||
      "",

    status: "Approved",
  };
};

/* =========================================================
   NOTIFICATION HELPER
========================================================= */

const createNotification = ({
  title,
  message,
  type = "application",
  uniqueKey,
}) => {
  const notifications = readStorageArray(NOTIFICATIONS_KEY);

  if (
    uniqueKey &&
    notifications.some(
      (notification) =>
        notification.uniqueKey === uniqueKey
    )
  ) {
    return;
  }

  const notification = {
    id: `NOTIF-${Date.now()}-${Math.floor(
      Math.random() * 10000
    )}`,
    title,
    message,
    type,
    uniqueKey: uniqueKey || null,
    read: false,
    createdAt: new Date().toISOString(),
  };

  writeStorageArray(NOTIFICATIONS_KEY, [
    notification,
    ...notifications,
  ]);

  window.dispatchEvent(
    new CustomEvent("notificationsUpdated")
  );
};

/* =========================================================
   COMPONENT
========================================================= */

const EMISchedule = () => {
  /* -------------------------------------------------------
     EMI DATA
  ------------------------------------------------------- */

  const [emiData, setEmiData] = useState(() =>
    getApprovedLoans().map(mapLoanToEMIRow)
  );

  /* -------------------------------------------------------
     VIEW STATE
  ------------------------------------------------------- */

  const [viewMode, setViewMode] = useState("list");
  const [selectedLoan, setSelectedLoan] = useState(null);

  /* -------------------------------------------------------
     FILTER STATE
  ------------------------------------------------------- */

  const [activeTab, setActiveTab] = useState("All EMIs");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLoanId, setSelectedLoanId] =
    useState("All Loans");
  const [selectedLoanType, setSelectedLoanType] =
    useState("All Types");
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState("All Status");
  const [showAdvancedFilters, setShowAdvancedFilters] =
    useState(false);

  /* -------------------------------------------------------
     PAGINATION
  ------------------------------------------------------- */

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  /* -------------------------------------------------------
     ACTION MENU / MODALS
  ------------------------------------------------------- */

  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [activeActionMenuId, setActiveActionMenuId] =
    useState(null);

  /* -------------------------------------------------------
     CALCULATOR
  ------------------------------------------------------- */

  const [calcAmount, setCalcAmount] =
    useState(500000);

  const [calcRate, setCalcRate] =
    useState(10.5);

  const [calcTenure, setCalcTenure] =
    useState(24);

  const [calcResult, setCalcResult] = useState({
    emi: 23448,
    interest: 62761,
    total: 562761,
  });

  const dropdownRef = useRef(null);

  /* =======================================================
     LOAD APPROVED LOANS
  ======================================================= */

  const loadApprovedLoans = () => {
    const approvedLoans = getApprovedLoans();

    const mappedLoans =
      approvedLoans.map(mapLoanToEMIRow);

    setEmiData(mappedLoans);

    /*
      If currently selected loan was rejected/removed,
      automatically leave details page.
    */
    if (
      selectedLoan &&
      !mappedLoans.some(
        (loan) => String(loan.id) === String(selectedLoan.id)
      )
    ) {
      setSelectedLoan(null);
      setViewMode("list");
    }
  };

  /* =======================================================
     INITIAL + WINDOW FOCUS SYNC
  ======================================================= */

  useEffect(() => {
    loadApprovedLoans();

    const handleStorageChange = () => {
      loadApprovedLoans();
    };

    const handleFocus = () => {
      loadApprovedLoans();
    };

    const handleLoanStatusUpdated = () => {
      loadApprovedLoans();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    window.addEventListener(
      "focus",
      handleFocus
    );

    window.addEventListener(
      "loanStatusUpdated",
      handleLoanStatusUpdated
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener(
        "focus",
        handleFocus
      );

      window.removeEventListener(
        "loanStatusUpdated",
        handleLoanStatusUpdated
      );
    };
  }, [selectedLoan]);

  /* =======================================================
     CLOSE ACTION MENU OUTSIDE CLICK
  ======================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setActiveActionMenuId(null);
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

  /* =======================================================
     GENERATE DUE DATE NOTIFICATIONS
  ======================================================= */

  useEffect(() => {
    if (!emiData.length) return;

    emiData.forEach((loan) => {
      if (!loan.dueDate) return;

      const status = getEMIStatus(
        loan.dueDate,
        loan.paymentDate
      );

      if (status === "Paid") return;

      const days = getDaysDifference(loan.dueDate);

      if (days === 3 || days === 1) {
        createNotification({
          title: "Upcoming EMI Reminder",
          message: `Loan #${loan.id} EMI of ₹${Number(
            loan.emiAmount || 0
          ).toLocaleString(
            "en-IN"
          )} is due on ${formatDate(loan.dueDate)}.`,
          type: "application",
          uniqueKey: `EMI-DUE-${loan.id}-${loan.dueDate}-${days}`,
        });
      }
    });
  }, [emiData]);

  /* =======================================================
     RESET PAGINATION
  ======================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedLoanId,
    selectedLoanType,
    selectedStatusFilter,
    activeTab,
  ]);

  /* =======================================================
     EMI CALCULATOR
  ======================================================= */

  const handleCalculate = () => {
    const P = Number(calcAmount) || 0;
    const r =
      (Number(calcRate) || 0) /
      12 /
      100;
    const n = Number(calcTenure) || 0;

    if (P > 0 && r > 0 && n > 0) {
      const emi = Math.round(
        (P *
          r *
          Math.pow(1 + r, n)) /
          (Math.pow(1 + r, n) - 1)
      );

      const total = emi * n;
      const interest = total - P;

      setCalcResult({
        emi,
        interest,
        total,
      });
    }
  };

  /* =======================================================
     PROCESS STATUS
  ======================================================= */

  const processedData = useMemo(() => {
    return emiData.map((item) => ({
      ...item,
      computedStatus: getEMIStatus(
        item.dueDate,
        item.paymentDate
      ),
    }));
  }, [emiData]);

  /* =======================================================
     UNIQUE LOAN IDS
  ======================================================= */

  const uniqueLoanIds = useMemo(() => {
    const ids = processedData
      .map((item) => item.id)
      .filter(Boolean);

    return Array.from(new Set(ids));
  }, [processedData]);

  /* =======================================================
     SUMMARY METRICS
  ======================================================= */

  const summaryMetrics = useMemo(() => {
    const totalLoans = processedData.length;

    let paidCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;
    let totalEMI = 0;

    processedData.forEach((item) => {
      totalEMI += Number(item.emiAmount) || 0;

      if (item.computedStatus === "Paid") {
        paidCount++;
      } else if (
        item.computedStatus === "Overdue"
      ) {
        overdueCount++;
      } else {
        pendingCount++;
      }
    });

    const paidPercentage =
      totalLoans > 0
        ? ((paidCount / totalLoans) * 100).toFixed(2)
        : "0.00";

    const pendingPercentage =
      totalLoans > 0
        ? ((pendingCount / totalLoans) * 100).toFixed(2)
        : "0.00";

    const overduePercentage =
      totalLoans > 0
        ? ((overdueCount / totalLoans) * 100).toFixed(2)
        : "0.00";

    const nextDueItem = [...processedData]
      .filter(
        (item) =>
          item.computedStatus !== "Paid"
      )
      .sort(
        (a, b) =>
          new Date(a.dueDate) -
          new Date(b.dueDate)
      )[0];

    return {
      totalLoans,
      totalEMI,
      paidEMI: paidCount,
      pendingEMI: pendingCount,
      overdueEMI: overdueCount,
      paidPercentage,
      pendingPercentage,
      overduePercentage,

      nextDueAmount: nextDueItem
        ? `₹${Number(
            nextDueItem.emiAmount
          ).toLocaleString("en-IN")}`
        : "N/A",

      nextDueDate: nextDueItem
        ? formatDate(nextDueItem.dueDate)
        : "N/A",
    };
  }, [processedData]);

  /* =======================================================
     FILTER DATA
  ======================================================= */

  const filteredData = useMemo(() => {
    return processedData.filter((item) => {
      /* TAB FILTER */
      if (
        activeTab !== "All" &&
        activeTab !== "All EMIs"
      ) {
        if (
          activeTab === "Paid" &&
          item.computedStatus !== "Paid"
        ) {
          return false;
        }

        if (
          activeTab === "Pending" &&
          item.computedStatus !== "Pending"
        ) {
          return false;
        }

        if (
          activeTab === "Overdue" &&
          item.computedStatus !== "Overdue"
        ) {
          return false;
        }

        if (
          activeTab === "Upcoming" &&
          item.computedStatus !== "Upcoming"
        ) {
          return false;
        }
      }

      /* LOAN ID */
      if (
        selectedLoanId !== "All Loans" &&
        String(item.id) !==
          String(selectedLoanId)
      ) {
        return false;
      }

      /* STATUS */
      if (
        selectedStatusFilter !== "All Status" &&
        item.computedStatus !==
          selectedStatusFilter
      ) {
        return false;
      }

      /* LOAN TYPE */
      if (
        selectedLoanType !== "All Types" &&
        item.loanType !== selectedLoanType
      ) {
        return false;
      }

      /* SEARCH */
      if (searchTerm) {
        const query =
          searchTerm.toLowerCase();

        const matchesId = String(
          item.id || ""
        )
          .toLowerCase()
          .includes(query);

        const matchesName = String(
          item.customerName || ""
        )
          .toLowerCase()
          .includes(query);

        const matchesPhone = String(
          item.phone || ""
        ).includes(query);

        return (
          matchesId ||
          matchesName ||
          matchesPhone
        );
      }

      return true;
    });
  }, [
    processedData,
    activeTab,
    selectedLoanId,
    selectedStatusFilter,
    selectedLoanType,
    searchTerm,
  ]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages =
    Math.ceil(
      filteredData.length / rowsPerPage
    ) || 1;

  const paginatedData = useMemo(() => {
    const startIndex =
      (currentPage - 1) *
      rowsPerPage;

    return filteredData.slice(
      startIndex,
      startIndex + rowsPerPage
    );
  }, [
    filteredData,
    currentPage,
  ]);

  /* =======================================================
     ACTIONS
  ======================================================= */

  const handleAction = (
    actionType,
    item
  ) => {
    setActiveActionMenuId(null);

    /* -----------------------------------------------------
       SEND PAYMENT LINK
    ----------------------------------------------------- */

    if (actionType === "sendLink") {
      alert(
        `Payment link dispatched to ${item.customerName} (${item.phone}).`
      );

      createNotification({
        title: "Payment Link Sent",
        message: `Payment link sent for Loan #${item.id}.`,
        type: "application",
        uniqueKey: `PAYMENT-LINK-${item.id}-${Date.now()}`,
      });

      return;
    }

    /* -----------------------------------------------------
       MARK PAID
    ----------------------------------------------------- */

    if (actionType === "markPaid") {
      const paymentDate =
        new Date()
          .toISOString()
          .slice(0, 10);

      const payments =
        readStorageArray(PAYMENTS_KEY);

      const paymentExists =
        payments.some(
          (payment) =>
            String(payment.loanId) ===
              String(item.id) &&
            Number(payment.emiNo) === 1 &&
            payment.status === "Paid"
        );

      if (!paymentExists) {
        const payment = {
          id: `PAY-${Date.now()}-${Math.floor(
            Math.random() * 10000
          )}`,

          loanId: item.id,
          emiNo: 1,
          amount:
            Number(item.emiAmount) || 0,

          paymentDate,

          paymentMethod:
            "Manual",

          referenceNo:
            `MAN${Date.now()
              .toString()
              .slice(-8)}`,

          status: "Paid",

          createdAt:
            new Date().toISOString(),
        };

        writeStorageArray(
          PAYMENTS_KEY,
          [payment, ...payments]
        );
      }

      const updated = emiData.map(
        (e) =>
          String(e.id) ===
          String(item.id)
            ? {
                ...e,
                paymentDate,
              }
            : e
      );

      setEmiData(updated);

      /*
        Keep backward compatibility
        with the existing approvedEMISchedules.
      */
      const existingApproved =
        readStorageArray(
          APPROVED_EMI_KEY
        );

      if (existingApproved.length > 0) {
        const updatedApproved =
          existingApproved.map(
            (e) =>
              String(
                e.id ||
                  e.loanId
              ) ===
              String(item.id)
                ? {
                    ...e,
                    paymentDate,
                  }
                : e
          );

        writeStorageArray(
          APPROVED_EMI_KEY,
          updatedApproved
        );
      }

      createNotification({
        title: "EMI Payment Successful",
        message: `EMI payment of ₹${Number(
          item.emiAmount || 0
        ).toLocaleString(
          "en-IN"
        )} received for Loan #${item.id}. Receipt generated.`,
        type: "approved",
        uniqueKey: `PAYMENT-SUCCESS-${item.id}-${paymentDate}`,
      });

      window.dispatchEvent(
        new CustomEvent("emiPaymentUpdated")
      );

      alert(
        `EMI for Loan ${item.id} marked as Paid.`
      );

      return;
    }

    /* -----------------------------------------------------
       DOWNLOAD RECEIPT
    ----------------------------------------------------- */

    if (
      actionType === "downloadInvoice"
    ) {
      handleOpenDetails(item);
      return;
    }
  };

  /* =======================================================
     OPEN DETAILS
  ======================================================= */

  const handleOpenDetails = (row) => {
    setSelectedLoan(row);
    setViewMode("details");
  };

  /* =======================================================
     CSV EXPORT
  ======================================================= */

  const handleExportCSV = () => {
    if (!filteredData.length) {
      alert(
        "No data available to export."
      );
      return;
    }

    const headers = [
      "Loan ID",
      "Customer Name",
      "Phone",
      "Loan Type",
      "EMI Amount",
      "Due Date",
      "Principal",
      "Interest",
      "Status",
      "Payment Date",
    ];

    const rows = filteredData.map(
      (item) => [
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
      ]
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.join(","),
        ...rows.map((row) =>
          row.join(",")
        ),
      ].join("\n");

    const encodedUri =
      encodeURI(csvContent);

    const link =
      document.createElement("a");

    link.setAttribute(
      "href",
      encodedUri
    );

    link.setAttribute(
      "download",
      `EMI_Schedule_Export_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  /* =======================================================
     LOAN ICON
  ======================================================= */

  const getLoanIcon = (
    type = ""
  ) => {
    if (
      type.includes("Home")
    ) {
      return (
        <Home
          size={15}
          className="type-icon home"
        />
      );
    }

    if (
      type.includes("Personal")
    ) {
      return (
        <User
          size={15}
          className="type-icon personal"
        />
      );
    }

    if (
      type.includes("Business")
    ) {
      return (
        <Briefcase
          size={15}
          className="type-icon business"
        />
      );
    }

    if (
      type.includes("Education")
    ) {
      return (
        <GraduationCap
          size={15}
          className="type-icon edu"
        />
      );
    }

    return <Home size={15} />;
  };

  /* =======================================================
     STATUS BADGE
  ======================================================= */

  const getStatusBadge = (
    status
  ) => {
    switch (status) {
      case "Paid":
        return (
          <span className="status-badge badge-paid">
            Paid
          </span>
        );

      case "Upcoming":
        return (
          <span className="status-badge badge-upcoming">
            Upcoming
          </span>
        );

      case "Pending":
      case "Due":
        return (
          <span className="status-badge badge-pending">
            Due
          </span>
        );

      case "Overdue":
        return (
          <span className="status-badge badge-overdue">
            Overdue
          </span>
        );

      default:
        return (
          <span className="status-badge">
            {status}
          </span>
        );
    }
  };

  /* =======================================================
     DATE FORMAT
  ======================================================= */

  function formatDate(
    dateStr
  ) {
    if (
      !dateStr ||
      dateStr === "-"
    ) {
      return "-";
    }

    const date =
      new Date(dateStr);

    return Number.isNaN(
      date.getTime()
    )
      ? "-"
      : date.toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );
  }

  /* =======================================================
     DETAILS VIEW
  ======================================================= */

  if (
    viewMode === "details" &&
    selectedLoan
  ) {
    return (
      <EMIDetails
        loanData={selectedLoan}
        onBack={() => {
          loadApprovedLoans();
          setViewMode("list");
          setSelectedLoan(null);
        }}
      />
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="emi-schedule-container">

      {/* PAGE HEADER */}

      <div className="page-header">
        <div>
          <h1 className="page-title">
            EMI Schedule
          </h1>

          <p className="page-subtitle">
            View and manage EMI schedules
            for all approved loans
          </p>
        </div>

        <div className="header-actions">
          <button
            className="btn-secondary"
            onClick={() =>
              setIsCalcOpen(true)
            }
          >
            <Calculator size={16} />
            EMI Calculator
          </button>

          <button
            className="btn-primary"
            onClick={
              handleExportCSV
            }
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* SUMMARY METRICS */}

      <div className="summary-cards-row">

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">
              Total Loans
            </span>

            <div className="metric-icon icon-blue">
              <Calendar size={18} />
            </div>
          </div>

          <div className="metric-value">
            {summaryMetrics.totalLoans}
          </div>

          <div className="metric-subtext">
            All active approved loans
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">
              Total EMI
            </span>

            <div className="metric-icon icon-green">
              <CheckCircle2 size={18} />
            </div>
          </div>

          <div className="metric-value">
            ₹
            {summaryMetrics.totalEMI.toLocaleString(
              "en-IN"
            )}
          </div>

          <div className="metric-subtext">
            All EMIs scheduled
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">
              Paid EMI
            </span>

            <div className="metric-icon icon-amber">
              <TrendingUp size={18} />
            </div>
          </div>

          <div className="metric-value">
            {summaryMetrics.paidEMI}
          </div>

          <div className="metric-subtext green-text">
            {summaryMetrics.paidPercentage}%
            of total
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">
              Pending EMI
            </span>

            <div className="metric-icon icon-red">
              <Clock size={18} />
            </div>
          </div>

          <div className="metric-value">
            {summaryMetrics.pendingEMI}
          </div>

          <div className="metric-subtext red-text">
            {summaryMetrics.pendingPercentage}%
            of total
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">
              Overdue EMI
            </span>

            <div className="metric-icon icon-purple">
              <AlertCircle size={18} />
            </div>
          </div>

          <div className="metric-value">
            {summaryMetrics.overdueEMI}
          </div>

          <div className="metric-subtext purple-text">
            {summaryMetrics.overduePercentage}%
            of total
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">
              Next EMI Due
            </span>

            <div className="metric-icon icon-cyan">
              <Clock size={18} />
            </div>
          </div>

          <div className="metric-value">
            {summaryMetrics.nextDueAmount}
          </div>

          <div className="metric-subtext green-text">
            {summaryMetrics.nextDueDate}
          </div>
        </div>
      </div>

      {/* FILTERS */}

      <div className="filters-bar">

        <div className="search-box">
          <Search
            size={16}
            className="search-icon"
          />

          <input
            type="text"
            placeholder="Search by Loan ID, Customer Name..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />
        </div>

        <div className="filter-dropdowns">

          <div className="filter-group">
            <label>
              Loan / Application
            </label>

            <select
              value={selectedLoanId}
              onChange={(e) =>
                setSelectedLoanId(
                  e.target.value
                )
              }
            >
              <option value="All Loans">
                All Loans
              </option>

              {uniqueLoanIds.map(
                (id) => (
                  <option
                    key={id}
                    value={id}
                  >
                    {id}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="filter-group">
            <label>
              Loan Type
            </label>

            <select
              value={selectedLoanType}
              onChange={(e) =>
                setSelectedLoanType(
                  e.target.value
                )
              }
            >
              <option value="All Types">
                All Types
              </option>

              <option value="Home Loan">
                Home Loan
              </option>

              <option value="Personal Loan">
                Personal Loan
              </option>

              <option value="Business Loan">
                Business Loan
              </option>

              <option value="Education Loan">
                Education Loan
              </option>
            </select>
          </div>

          <div className="filter-group">
            <label>
              EMI Status
            </label>

            <select
              value={
                selectedStatusFilter
              }
              onChange={(e) =>
                setSelectedStatusFilter(
                  e.target.value
                )
              }
            >
              <option value="All Status">
                All Status
              </option>

              <option value="Paid">
                Paid
              </option>

              <option value="Upcoming">
                Upcoming
              </option>

              <option value="Pending">
                Pending / Due
              </option>

              <option value="Overdue">
                Overdue
              </option>
            </select>
          </div>

          <button
            className={`btn-filter-icon ${
              showAdvancedFilters
                ? "active"
                : ""
            }`}
            onClick={() =>
              setShowAdvancedFilters(
                !showAdvancedFilters
              )
            }
          >
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      {/* ADVANCED FILTER */}

      {showAdvancedFilters && (
        <div className="advanced-filter-panel">

          <p className="filter-hint">
            Active Filters Applied:{" "}
            <strong>
              {filteredData.length}
            </strong>{" "}
            matching records found.
          </p>

          <button
            className="btn-reset-filters"
            onClick={() => {
              setSearchTerm("");
              setSelectedLoanId(
                "All Loans"
              );
              setSelectedLoanType(
                "All Types"
              );
              setSelectedStatusFilter(
                "All Status"
              );
            }}
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* TABLE */}

      <div className="table-card">

        <div className="table-tabs">
          {[
            "All EMIs",
            "Paid",
            "Pending",
            "Overdue",
            "Upcoming",
          ].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${
                activeTab === tab
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab(tab)
              }
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
                paginatedData.map(
                  (row) => (
                    <tr key={row.id}>

                      <td className="loan-id-cell">
                        {row.id}
                      </td>

                      <td>
                        <div className="cust-info">
                          <span className="cust-name">
                            {row.customerName}
                          </span>

                          <span className="cust-phone">
                            {row.phone}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="loan-type-pill">
                          {getLoanIcon(
                            row.loanType
                          )}

                          <span>
                            {row.loanType}
                          </span>
                        </div>
                      </td>

                      <td className="amount-cell">
                        ₹
                        {Number(
                          row.emiAmount || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td className="date-cell">
                        {formatDate(
                          row.dueDate
                        )}
                      </td>

                      <td className="sub-amount">
                        ₹
                        {Number(
                          row.principal || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td className="sub-amount">
                        ₹
                        {Number(
                          row.interest || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td className="amount-cell">
                        ₹
                        {Number(
                          row.emiAmount || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td>
                        {getStatusBadge(
                          row.computedStatus
                        )}
                      </td>

                      <td className="date-cell">
                        {formatDate(
                          row.paymentDate
                        )}
                      </td>

                      <td className="action-cell">

                        <button
                          className="btn-icon-action btn-eye"
                          title="View Details"
                          onClick={() =>
                            handleOpenDetails(
                              row
                            )
                          }
                        >
                          <Eye size={18} />
                        </button>

                        <div
                          className="more-menu-wrapper"
                          ref={
                            activeActionMenuId ===
                            row.id
                              ? dropdownRef
                              : null
                          }
                        >

                          <button
                            className={`btn-icon-action btn-more ${
                              activeActionMenuId ===
                              row.id
                                ? "active"
                                : ""
                            }`}
                            title="More Actions"
                            onClick={() =>
                              setActiveActionMenuId(
                                activeActionMenuId ===
                                  row.id
                                  ? null
                                  : row.id
                              )
                            }
                          >
                            <MoreVertical
                              size={18}
                            />
                          </button>

                          {activeActionMenuId ===
                            row.id && (
                            <div className="action-dropdown-menu">

                              <button
                                onClick={() =>
                                  handleAction(
                                    "sendLink",
                                    row
                                  )
                                }
                              >
                                <Send
                                  size={14}
                                />
                                Send Payment Link
                              </button>

                              {row.computedStatus !==
                                "Paid" && (
                                <button
                                  onClick={() =>
                                    handleAction(
                                      "markPaid",
                                      row
                                    )
                                  }
                                >
                                  <CheckCircle
                                    size={14}
                                  />
                                  Mark as Paid
                                </button>
                              )}

                              <button
                                onClick={() =>
                                  handleAction(
                                    "downloadInvoice",
                                    row
                                  )
                                }
                              >
                                <FileText
                                  size={14}
                                />
                                View Receipt
                              </button>

                            </div>
                          )}
                        </div>

                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="empty-table"
                  >
                    No matching EMI records found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        <div className="table-pagination">

          <span className="pagination-info">
            Showing{" "}
            {filteredData.length > 0
              ? (currentPage - 1) *
                  rowsPerPage +
                1
              : 0}{" "}
            to{" "}
            {Math.min(
              currentPage *
                rowsPerPage,
              filteredData.length
            )}{" "}
            of{" "}
            {filteredData.length}{" "}
            entries
          </span>

          <div className="pagination-pages">

            <button
              className="page-arrow"
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.max(
                      prev - 1,
                      1
                    )
                )
              }
            >
              <ChevronLeft
                size={16}
              />
            </button>

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) =>
                index + 1
            ).map((pageNum) => (
              <button
                key={pageNum}
                className={`page-num ${
                  currentPage ===
                  pageNum
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setCurrentPage(
                    pageNum
                  )
                }
              >
                {pageNum}
              </button>
            ))}

            <button
              className="page-arrow"
              disabled={
                currentPage ===
                  totalPages ||
                totalPages === 0
              }
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.min(
                      prev + 1,
                      totalPages
                    )
                )
              }
            >
              <ChevronRight
                size={16}
              />
            </button>

          </div>
        </div>
      </div>

      {/* EMI CALCULATOR */}

      {isCalcOpen && (
        <div
          className="modal-overlay"
          onClick={() =>
            setIsCalcOpen(false)
          }
        >
          <div
            className="calc-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <h3>
                EMI Calculator
              </h3>

              <button
                className="btn-close"
                onClick={() =>
                  setIsCalcOpen(false)
                }
              >
                <X size={18} />
              </button>

            </div>

            <div className="calc-modal-body">

              <div className="calc-input-field">
                <label>
                  Loan Amount (₹)
                </label>

                <input
                  type="number"
                  value={calcAmount}
                  onChange={(e) =>
                    setCalcAmount(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="calc-input-field">
                <label>
                  Interest Rate (% p.a.)
                </label>

                <input
                  type="number"
                  step="0.1"
                  value={calcRate}
                  onChange={(e) =>
                    setCalcRate(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="calc-input-field">
                <label>
                  Tenure (Months)
                </label>

                <input
                  type="number"
                  value={calcTenure}
                  onChange={(e) =>
                    setCalcTenure(
                      e.target.value
                    )
                  }
                />
              </div>

              <button
                className="btn-calc-submit"
                onClick={
                  handleCalculate
                }
              >
                Calculate
              </button>

              <div className="calc-results-box">

                <div className="res-row">
                  <span>
                    Monthly EMI:
                  </span>

                  <strong>
                    ₹
                    {calcResult.emi.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

                <div className="res-row">
                  <span>
                    Total Interest:
                  </span>

                  <strong>
                    ₹
                    {calcResult.interest.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

                <div className="res-row highlight">
                  <span>
                    Total Repayment:
                  </span>

                  <strong>
                    ₹
                    {calcResult.total.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
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