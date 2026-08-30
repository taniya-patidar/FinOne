import React, {
  useState,
  useMemo,
  useEffect,
} from "react";

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
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Download,
} from "lucide-react";

import "./EMIDetails.css";

/* =========================================================
   LOCAL STORAGE
========================================================= */

const PAYMENTS_KEY = "emiPayments";
const NOTIFICATIONS_KEY = "notifications";

/* =========================================================
   STORAGE HELPERS
========================================================= */

const readStorageArray = (key) => {
  try {
    const saved =
      localStorage.getItem(key);

    if (!saved) return [];

    const parsed =
      JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch (error) {
    console.error(
      `Unable to read ${key}`,
      error
    );

    return [];
  }
};

const writeStorageArray = (
  key,
  data
) => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error(
      `Unable to write ${key}`,
      error
    );
  }
};

/* =========================================================
   DATE HELPERS
========================================================= */

const parseDate = (value) => {
  if (!value) return null;

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return date;
};

const normalizeDate = (value) => {
  const date = parseDate(value);

  if (!date) return null;

  date.setHours(0, 0, 0, 0);

  return date;
};

const formatDate = (dateValue) => {
  if (
    !dateValue ||
    dateValue === "-"
  ) {
    return "-";
  }

  const date =
    parseDate(dateValue);

  if (!date) return "-";

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const getEMIStatus = (
  dueDate,
  payment
) => {
  if (payment) {
    return "Paid";
  }

  const today =
    normalizeDate(
      new Date()
    );

  const due =
    normalizeDate(
      dueDate
    );

  if (!due) {
    return "Upcoming";
  }

  if (due < today) {
    return "Overdue";
  }

  if (
    due.getTime() ===
    today.getTime()
  ) {
    return "Pending";
  }

  return "Upcoming";
};

const getDaysDifference = (
  dueDate
) => {
  const today =
    normalizeDate(
      new Date()
    );

  const due =
    normalizeDate(
      dueDate
    );

  if (!due) return null;

  return Math.ceil(
    (due.getTime() -
      today.getTime()) /
      (1000 *
        60 *
        60 *
        24)
  );
};

/* =========================================================
   NOTIFICATION
========================================================= */

const createNotification = ({
  title,
  message,
  type = "application",
  uniqueKey,
}) => {
  const notifications =
    readStorageArray(
      NOTIFICATIONS_KEY
    );

  if (
    uniqueKey &&
    notifications.some(
      (notification) =>
        notification.uniqueKey ===
        uniqueKey
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

    uniqueKey:
      uniqueKey || null,

    read: false,

    createdAt:
      new Date().toISOString(),
  };

  writeStorageArray(
    NOTIFICATIONS_KEY,
    [
      notification,
      ...notifications,
    ]
  );

  window.dispatchEvent(
    new CustomEvent(
      "notificationsUpdated"
    )
  );
};

/* =========================================================
   COMPONENT
========================================================= */

const EMIDetails = ({
  loanData,
  onBack,
}) => {
  /* -------------------------------------------------------
     TABS + PAGINATION
  ------------------------------------------------------- */

  const [activeTab, setActiveTab] =
    useState("schedule");

  const [currentPage, setCurrentPage] =
    useState(1);

  const rowsPerPage = 10;

  /* -------------------------------------------------------
     PAYMENT DATA REFRESH
  ------------------------------------------------------- */

  const [
    paymentVersion,
    setPaymentVersion,
  ] = useState(0);

  /* =======================================================
     CUSTOMER
  ======================================================= */

  const customer = useMemo(
    () => ({
      name:
        loanData?.customerName ||
        loanData?.name ||
        "Customer",

      id:
        loanData?.customerId ||
        `CUST-${loanData?.id || "1001"}`,

      phone:
        loanData?.phone ||
        loanData?.mobile ||
        "-",

      email:
        loanData?.email ||
        "-",

      initials:
        loanData?.customerName
          ? loanData.customerName
              .split(" ")
              .filter(Boolean)
              .map(
                (name) =>
                  name[0]
              )
              .join("")
              .slice(0, 2)
              .toUpperCase()
          : "CU",
    }),
    [loanData]
  );

  /* =======================================================
     LOAN INFORMATION
  ======================================================= */

  const loanInfo = useMemo(() => {
    return {
      id:
        loanData?.id ||
        loanData?.loanId ||
        "LA-10021",

      type:
        loanData?.loanType ||
        loanData?.type ||
        "Home Loan",

      amount:
        Number(
          loanData?.loanAmount ||
            loanData?.amount ||
            loanData?.requestedAmount ||
            0
        ) || 0,

      rate:
        Number(
          loanData?.interestRate ||
            loanData?.rate ||
            0
        ) || 0,

      tenure:
        Number(
          loanData?.loanTenure ||
            loanData?.tenureMonths ||
            loanData?.tenure ||
            loanData?.tenureInMonths ||
            0
        ) || 0,

      startDate:
        loanData?.startDate ||
        loanData?.approvalDate ||
        loanData?.disbursementDate ||
        new Date().toISOString(),

      disbursementDate:
        loanData?.disbursementDate ||
        loanData?.startDate ||
        loanData?.approvalDate ||
        new Date().toISOString(),

      status:
        loanData?.status ||
        "Approved",

      emiAmount:
        Number(
          loanData?.emiAmount ||
            loanData?.emi ||
            loanData?.monthlyEMI ||
            0
        ) || 0,
    };
  }, [loanData]);

  /* =======================================================
     ALL SAVED PAYMENTS
  ======================================================= */

  const payments = useMemo(() => {
    /*
      paymentVersion forces recalculation after payment.
    */
    void paymentVersion;

    return readStorageArray(
      PAYMENTS_KEY
    );
  }, [paymentVersion]);

  /* =======================================================
     PAYMENT LOOKUP
  ======================================================= */

  const getPaymentForEMI = (
    emiNo
  ) => {
    return payments.find(
      (payment) =>
        String(payment.loanId) ===
          String(loanInfo.id) &&
        Number(payment.emiNo) ===
          Number(emiNo) &&
        payment.status === "Paid"
    );
  };

  /* =======================================================
     EMI SCHEDULE GENERATION
  ======================================================= */

  const emiScheduleList =
    useMemo(() => {
      const list = [];

      const totalTenure =
        loanInfo.tenure;

      if (
        !totalTenure ||
        totalTenure < 1
      ) {
        return list;
      }

      /*
        Start date.
      */

      let baseDate =
        parseDate(
          loanInfo.startDate
        );

      if (!baseDate) {
        baseDate =
          new Date();
      }

      /*
        EMI amount.

        If existing loan data has EMI amount,
        use it.

        Otherwise calculate it.
      */

      let emiAmount =
        loanInfo.emiAmount;

      if (
        !emiAmount &&
        loanInfo.amount &&
        loanInfo.rate &&
        totalTenure
      ) {
        const monthlyRate =
          loanInfo.rate /
          12 /
          100;

        if (
          monthlyRate > 0
        ) {
          emiAmount = Math.round(
            (loanInfo.amount *
              monthlyRate *
              Math.pow(
                1 +
                  monthlyRate,
                totalTenure
              )) /
              (Math.pow(
                1 +
                  monthlyRate,
                totalTenure
              ) - 1)
          );
        } else {
          emiAmount = Math.round(
            loanInfo.amount /
              totalTenure
          );
        }
      }

      let currentPrincipal =
        loanInfo.amount;

      const monthlyRate =
        loanInfo.rate /
        12 /
        100;

      for (
        let i = 1;
        i <= totalTenure;
        i++
      ) {
        /*
          Correct month addition.
        */

        const dueDateObj =
          new Date(
            baseDate.getFullYear(),
            baseDate.getMonth() +
              (i - 1),
            baseDate.getDate()
          );

        /*
          Interest component.
        */

        const interestComp =
          monthlyRate > 0
            ? Math.round(
                currentPrincipal *
                  monthlyRate
              )
            : 0;

        /*
          Principal component.
        */

        let principalComp =
          Math.max(
            0,
            emiAmount -
              interestComp
          );

        /*
          Don't let final principal
          exceed outstanding principal.
        */

        if (
          currentPrincipal >
            0 &&
          principalComp >
            currentPrincipal
        ) {
          principalComp =
            currentPrincipal;
        }

        /*
          Persistent payment.
        */

        const payment =
          getPaymentForEMI(
            i
          );

        const dueDate =
          dueDateObj
            .toISOString()
            .slice(0, 10);

        const status =
          getEMIStatus(
            dueDate,
            payment
          );

        list.push({
          emiNo: String(
            i
          ).padStart(2, "0"),

          emiIndex: i,

          dueDate,

          dueDateFormatted:
            formatDate(
              dueDate
            ),

          dueDateObj,

          principal:
            principalComp,

          interest:
            interestComp,

          amount:
            emiAmount,

          status,

          paymentDate:
            payment?.paymentDate ||
            "-",

          paymentMethod:
            payment?.paymentMethod ||
            "-",

          referenceNo:
            payment?.referenceNo ||
            "-",

          paymentId:
            payment?.id ||
            null,
        });

        currentPrincipal =
          Math.max(
            0,
            currentPrincipal -
              principalComp
          );
      }

      return list;
    }, [
      loanInfo,
      payments,
    ]);

  /* =======================================================
     RESET PAGINATION WHEN TAB CHANGES
  ======================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  /* =======================================================
     PAYMENT EVENT SYNC
  ======================================================= */

  useEffect(() => {
    const handlePaymentUpdate =
      () => {
        setPaymentVersion(
          (prev) => prev + 1
        );
      };

    window.addEventListener(
      "emiPaymentUpdated",
      handlePaymentUpdate
    );

    window.addEventListener(
      "storage",
      handlePaymentUpdate
    );

    return () => {
      window.removeEventListener(
        "emiPaymentUpdated",
        handlePaymentUpdate
      );

      window.removeEventListener(
        "storage",
        handlePaymentUpdate
      );
    };
  }, []);

  /* =======================================================
     DERIVED PAYMENT METRICS
  ======================================================= */

  const paidEMIs =
    emiScheduleList.filter(
      (emi) =>
        emi.status === "Paid"
    ).length;

  const remainingEMIs =
    Math.max(
      0,
      loanInfo.tenure -
        paidEMIs
    );

  const totalPaymentMade =
    emiScheduleList
      .filter(
        (emi) =>
          emi.status === "Paid"
      )
      .reduce(
        (sum, emi) =>
          sum + emi.amount,
        0
      );

  const totalInterestPaid =
    emiScheduleList
      .filter(
        (emi) =>
          emi.status === "Paid"
      )
      .reduce(
        (sum, emi) =>
          sum + emi.interest,
        0
      );

  const totalPrincipalPaid =
    emiScheduleList
      .filter(
        (emi) =>
          emi.status === "Paid"
      )
      .reduce(
        (sum, emi) =>
          sum + emi.principal,
        0
      );

  const remainingPrincipal =
    Math.max(
      0,
      loanInfo.amount -
        totalPrincipalPaid
    );

  const outstandingAmount =
    remainingPrincipal;

  /* =======================================================
     NEXT EMI
  ======================================================= */

  const nextEMIRow =
    [...emiScheduleList]
      .filter(
        (emi) =>
          emi.status !== "Paid"
      )
      .sort(
        (a, b) =>
          a.dueDateObj -
          b.dueDateObj
      )[0] || null;

  const nextDueDateStr =
    nextEMIRow
      ? nextEMIRow.dueDateFormatted
      : "-";

  const daysRemainingText =
    nextEMIRow
      ? (() => {
          const days =
            getDaysDifference(
              nextEMIRow.dueDate
            );

          if (
            days === null
          ) {
            return "-";
          }

          if (days < 0) {
            return `${Math.abs(
              days
            )} Days Overdue`;
          }

          if (days === 0) {
            return "Due Today";
          }

          return `${days} Days`;
        })()
      : "-";

  /* =======================================================
     PAYMENT HISTORY
  ======================================================= */

  const paymentHistory =
    useMemo(() => {
      void paymentVersion;

      return payments
        .filter(
          (payment) =>
            String(
              payment.loanId
            ) ===
            String(
              loanInfo.id
            ) &&
            payment.status ===
              "Paid"
        )
        .sort(
          (a, b) =>
            new Date(
              b.paymentDate ||
                b.createdAt
            ) -
            new Date(
              a.paymentDate ||
                a.createdAt
            )
        );
    }, [
      payments,
      loanInfo.id,
      paymentVersion,
    ]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        emiScheduleList.length /
          rowsPerPage
      )
    );

  const paginatedSchedule =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        rowsPerPage;

      return emiScheduleList.slice(
        start,
        start + rowsPerPage
      );
    }, [
      emiScheduleList,
      currentPage,
    ]);

  /* =======================================================
     PAY EMI
  ======================================================= */

  const handlePayEMI = (
    emi
  ) => {
    if (
      emi.status === "Paid"
    ) {
      return;
    }

    const existingPayments =
      readStorageArray(
        PAYMENTS_KEY
      );

    const alreadyPaid =
      existingPayments.find(
        (payment) =>
          String(
            payment.loanId
          ) ===
            String(
              loanInfo.id
            ) &&
          Number(
            payment.emiNo
          ) ===
            Number(
              emi.emiIndex
            ) &&
          payment.status ===
            "Paid"
      );

    if (alreadyPaid) {
      setPaymentVersion(
        (prev) => prev + 1
      );
      return;
    }

    const paymentDate =
      new Date()
        .toISOString()
        .slice(0, 10);

    const paymentMethod =
      "UPI";

    const referenceNo =
      `UPI${Date.now()
        .toString()
        .slice(-8)}`;

    const payment = {
      id: `PAY-${Date.now()}-${Math.floor(
        Math.random() * 10000
      )}`,

      loanId:
        loanInfo.id,

      emiNo:
        emi.emiIndex,

      amount:
        emi.amount,

      paymentDate,

      paymentMethod,

      referenceNo,

      status: "Paid",

      createdAt:
        new Date().toISOString(),
    };

    writeStorageArray(
      PAYMENTS_KEY,
      [
        payment,
        ...existingPayments,
      ]
    );

    /* -----------------------------------------------------
       SUCCESS NOTIFICATION
    ----------------------------------------------------- */

    createNotification({
      title:
        "EMI Payment Successful",

      message:
        `EMI #${emi.emiIndex} payment of ₹${Number(
          emi.amount
        ).toLocaleString(
          "en-IN"
        )} received for Loan #${loanInfo.id}.`,

      type:
        "approved",

      uniqueKey:
        `PAYMENT-${loanInfo.id}-${emi.emiIndex}-${paymentDate}`,
    });

    setPaymentVersion(
      (prev) => prev + 1
    );

    window.dispatchEvent(
      new CustomEvent(
        "emiPaymentUpdated"
      )
    );

    alert(
      `EMI #${emi.emiIndex} paid successfully.`
    );
  };

  /* =======================================================
     RECEIPT / PRINT
  ======================================================= */

  const handlePrintReceipt = (
    emi
  ) => {
    const payment =
      getPaymentForEMI(
        emi.emiIndex
      );

    if (!payment) {
      alert(
        "Payment receipt is available only after the EMI is paid."
      );

      return;
    }

    const receiptWindow =
      window.open(
        "",
        "_blank",
        "width=800,height=900"
      );

    if (!receiptWindow) {
      alert(
        "Please allow pop-ups to generate the receipt."
      );

      return;
    }

    const amount =
      Number(
        payment.amount || 0
      ).toLocaleString(
        "en-IN"
      );

    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>EMI Payment Receipt</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 40px;
              font-family: Arial, sans-serif;
              background: #f5f7fb;
              color: #1f2937;
            }

            .receipt {
              max-width: 700px;
              margin: auto;
              background: white;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 8px 30px rgba(0,0,0,.08);
            }

            .header {
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 20px;
              margin-bottom: 25px;
            }

            h1 {
              margin: 0;
              font-size: 24px;
            }

            .success {
              color: #15803d;
              font-weight: 700;
            }

            .row {
              display: flex;
              justify-content: space-between;
              padding: 13px 0;
              border-bottom: 1px solid #f0f0f0;
            }

            .label {
              color: #6b7280;
            }

            .amount {
              font-size: 24px;
              font-weight: 700;
            }

            .footer {
              margin-top: 30px;
              color: #6b7280;
              font-size: 13px;
            }

            @media print {
              body {
                background: white;
                padding: 0;
              }

              .receipt {
                box-shadow: none;
              }
            }
          </style>
        </head>

        <body>

          <div class="receipt">

            <div class="header">
              <div>
                <h1>EMI Payment Receipt</h1>
                <p class="success">
                  Payment Successful
                </p>
              </div>

              <strong>
                ${payment.referenceNo}
              </strong>
            </div>

            <div class="row">
              <span class="label">
                Customer
              </span>

              <strong>
                ${customer.name}
              </strong>
            </div>

            <div class="row">
              <span class="label">
                Loan ID
              </span>

              <strong>
                ${loanInfo.id}
              </strong>
            </div>

            <div class="row">
              <span class="label">
                EMI Number
              </span>

              <strong>
                ${emi.emiIndex}
              </strong>
            </div>

            <div class="row">
              <span class="label">
                Payment Date
              </span>

              <strong>
                ${formatDate(
                  payment.paymentDate
                )}
              </strong>
            </div>

            <div class="row">
              <span class="label">
                Payment Method
              </span>

              <strong>
                ${payment.paymentMethod}
              </strong>
            </div>

            <div class="row">
              <span class="label">
                EMI Amount
              </span>

              <strong class="amount">
                ₹${amount}
              </strong>
            </div>

            <div class="footer">
              This is a system-generated EMI payment receipt.
            </div>

          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>

        </body>
      </html>
    `);

    receiptWindow.document.close();
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="emi-details-wrapper">

      {/* HEADER */}

      <div className="details-header">

        <div>

          <div className="breadcrumb">

            <span
              onClick={onBack}
              className="crumb-link"
            >
              EMI Schedule
            </span>

            <span className="crumb-sep">
              &gt;
            </span>

            <span className="crumb-active">
              EMI Details
            </span>

          </div>

          <h1 className="details-title">
            EMI Details
          </h1>

          <p className="details-subtitle">
            View complete EMI schedule and payment history
          </p>

        </div>

        <button
          className="btn-back"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          Back to EMI Schedule
        </button>

      </div>

      {/* ===================================================
          LOAN + CUSTOMER OVERVIEW
      =================================================== */}

      <div className="overview-card">

        <h3 className="card-section-title">
          Loan & Customer Overview
        </h3>

        <div className="overview-grid">

          {/* CUSTOMER */}

          <div className="customer-profile-block">

            <div className="avatar-circle">
              {customer.initials}
            </div>

            <div className="profile-info">

              <h4>
                {customer.name}
              </h4>

              <span className="cust-id-badge">
                {customer.id}
              </span>

              <p>
                {customer.phone}
              </p>

              <p>
                {customer.email}
              </p>

            </div>

          </div>

          {/* LOAN ID */}

          <div className="info-meta-item">

            <div className="meta-icon bg-blue">
              <FileText size={16} />
            </div>

            <div>
              <label>
                Loan ID
              </label>

              <strong>
                {loanInfo.id}
              </strong>
            </div>

          </div>

          {/* TYPE */}

          <div className="info-meta-item">

            <div className="meta-icon bg-slate">
              <Building size={16} />
            </div>

            <div>
              <label>
                Loan Type
              </label>

              <strong>
                {loanInfo.type}
              </strong>
            </div>

          </div>

          {/* AMOUNT */}

          <div className="info-meta-item">

            <div className="meta-icon bg-green">
              <CreditCard size={16} />
            </div>

            <div>
              <label>
                Loan Amount
              </label>

              <strong>
                ₹
                {loanInfo.amount.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

          </div>

          {/* RATE */}

          <div className="info-meta-item">

            <div className="meta-icon bg-indigo">
              <Percent size={16} />
            </div>

            <div>
              <label>
                Interest Rate
              </label>

              <strong>
                {loanInfo.rate}% p.a.
              </strong>
            </div>

          </div>

          {/* TENURE */}

          <div className="info-meta-item">

            <div className="meta-icon bg-blue">
              <Clock size={16} />
            </div>

            <div>
              <label>
                Tenure
              </label>

              <strong>
                {loanInfo.tenure} Months
              </strong>
            </div>

          </div>

          {/* START */}

          <div className="info-meta-item">

            <div className="meta-icon bg-slate">
              <Calendar size={16} />
            </div>

            <div>
              <label>
                Loan Start Date
              </label>

              <strong>
                {formatDate(
                  loanInfo.startDate
                )}
              </strong>
            </div>

          </div>

          {/* DISBURSEMENT */}

          <div className="info-meta-item">

            <div className="meta-icon bg-slate">
              <Calendar size={16} />
            </div>

            <div>
              <label>
                Disbursement Date
              </label>

              <strong>
                {formatDate(
                  loanInfo.disbursementDate
                )}
              </strong>
            </div>

          </div>

          {/* STATUS */}

          <div className="info-meta-item">

            <div className="meta-icon bg-green">
              <CheckCircle2 size={16} />
            </div>

            <div>
              <label>
                Loan Status
              </label>

              <span className="status-tag active">
                {loanInfo.status}
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* ===================================================
          KPI CARDS
      =================================================== */}

      <div className="kpi-cards-grid">

        <div className="kpi-mini-card">

          <div className="kpi-icon-wrapper blue-icon">
            <FileText size={20} />
          </div>

          <div>
            <span className="kpi-label">
              EMI Amount
            </span>

            <h3 className="kpi-value">
              ₹
              {loanInfo.emiAmount.toLocaleString(
                "en-IN"
              )}
            </h3>
          </div>

        </div>

        <div className="kpi-mini-card">

          <div className="kpi-icon-wrapper purple-icon">
            <CreditCard size={20} />
          </div>

          <div>
            <span className="kpi-label">
              Total EMIs
            </span>

            <h3 className="kpi-value">
              {loanInfo.tenure}
            </h3>
          </div>

        </div>

        <div className="kpi-mini-card">

          <div className="kpi-icon-wrapper green-icon">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span className="kpi-label">
              Paid EMIs
            </span>

            <h3 className="kpi-value">
              {paidEMIs}
            </h3>
          </div>

        </div>

        <div className="kpi-mini-card">

          <div className="kpi-icon-wrapper orange-icon">
            <Clock size={20} />
          </div>

          <div>
            <span className="kpi-label">
              Remaining EMIs
            </span>

            <h3 className="kpi-value">
              {remainingEMIs}
            </h3>
          </div>

        </div>

        <div className="kpi-mini-card">

          <div className="kpi-icon-wrapper red-icon">
            <TrendingDown size={20} />
          </div>

          <div>
            <span className="kpi-label">
              Outstanding Amount
            </span>

            <h3 className="kpi-value">
              ₹
              {outstandingAmount.toLocaleString(
                "en-IN"
              )}
            </h3>
          </div>

        </div>

        <div className="kpi-mini-card">

          <div className="kpi-icon-wrapper cyan-icon">
            <Calendar size={20} />
          </div>

          <div>
            <span className="kpi-label">
              Next EMI Due
            </span>

            <h3 className="kpi-value">
              {nextDueDateStr}
            </h3>

            <span className="kpi-subtext">
              {daysRemainingText}
            </span>
          </div>

        </div>

      </div>

      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <div className="details-content-split">

        {/* LEFT */}

        <div className="left-panel-card">

          {/* TABS */}

          <div className="detail-tabs">

            <button
              className={`d-tab-btn ${
                activeTab ===
                "schedule"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab(
                  "schedule"
                )
              }
            >
              EMI Schedule
            </button>

            <button
              className={`d-tab-btn ${
                activeTab ===
                "history"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab(
                  "history"
                )
              }
            >
              Payment History
            </button>

          </div>

          <h3 className="panel-inner-title">
            {activeTab ===
            "schedule"
              ? "EMI Schedule"
              : "Payment History Ledger"}
          </h3>

          {/* =================================================
              SCHEDULE
          ================================================= */}

          {activeTab ===
          "schedule" ? (
            <>

              <div className="table-wrapper">

                <table className="schedule-table">

                  <thead>

                    <tr>
                      <th>
                        EMI No.
                      </th>

                      <th>
                        Due Date
                      </th>

                      <th>
                        Principal (₹)
                      </th>

                      <th>
                        Interest (₹)
                      </th>

                      <th>
                        EMI Amount (₹)
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Payment Date
                      </th>

                      <th>
                        Action
                      </th>
                    </tr>

                  </thead>

                  <tbody>

                    {paginatedSchedule.map(
                      (row) => (
                        <tr
                          key={
                            row.emiNo
                          }
                        >

                          <td className="emi-no-col">
                            {row.emiNo}
                          </td>

                          <td className="date-col">
                            {
                              row.dueDateFormatted
                            }
                          </td>

                          <td className="num-col">
                            ₹
                            {row.principal.toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          <td className="num-col">
                            ₹
                            {row.interest.toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          <td className="num-col bold">
                            ₹
                            {row.amount.toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          <td>

                            <span
                              className={`status-pill ${row.status.toLowerCase()}`}
                            >
                              {row.status}
                            </span>

                          </td>

                          <td className="date-col">
                            {
                              row.paymentDate
                            }
                          </td>

                          <td>

                            {row.status !==
                              "Paid" ? (
                              <button
                                className="btn-pay-emi"
                                onClick={() =>
                                  handlePayEMI(
                                    row
                                  )
                                }
                              >
                                <CheckCircle
                                  size={14}
                                />
                                Pay Now
                              </button>
                            ) : (
                              <button
                                className="btn-receipt"
                                onClick={() =>
                                  handlePrintReceipt(
                                    row
                                  )
                                }
                              >
                                <Download
                                  size={14}
                                />
                                View Slip
                              </button>
                            )}

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

              {/* PAGINATION */}

              <div className="sub-pagination">

                <span>

                  Showing{" "}
                  {emiScheduleList.length >
                  0
                    ? (currentPage -
                        1) *
                        rowsPerPage +
                      1
                    : 0}{" "}
                  to{" "}
                  {Math.min(
                    currentPage *
                      rowsPerPage,
                    emiScheduleList.length
                  )}{" "}
                  of{" "}
                  {emiScheduleList.length}{" "}
                  EMIs

                </span>

                <div className="p-arrows">

                  <button
                    disabled={
                      currentPage ===
                      1
                    }
                    onClick={() =>
                      setCurrentPage(
                        (p) =>
                          Math.max(
                            1,
                            p - 1
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
                      length:
                        totalPages,
                    },
                    (_, i) =>
                      i + 1
                  ).map((p) => (
                    <button
                      key={p}
                      className={`p-num ${
                        currentPage ===
                        p
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setCurrentPage(
                          p
                        )
                      }
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        (p) =>
                          Math.min(
                            totalPages,
                            p + 1
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

            </>
          ) : (

            /* =================================================
               PAYMENT HISTORY
            ================================================= */

            <div className="table-wrapper">

              <table className="schedule-table">

                <thead>

                  <tr>

                    <th>
                      EMI No.
                    </th>

                    <th>
                      Payment Date
                    </th>

                    <th>
                      Amount (₹)
                    </th>

                    <th>
                      Method
                    </th>

                    <th>
                      Reference No.
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Receipt
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {paymentHistory.length >
                  0 ? (
                    paymentHistory.map(
                      (payment) => (
                        <tr
                          key={
                            payment.id
                          }
                        >

                          <td>
                            EMI #
                            {
                              payment.emiNo
                            }
                          </td>

                          <td>
                            {formatDate(
                              payment.paymentDate
                            )}
                          </td>

                          <td className="bold">
                            ₹
                            {Number(
                              payment.amount ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          <td>
                            <span
                              className={`method-badge ${String(
                                payment.paymentMethod ||
                                  ""
                              ).toLowerCase()}`}
                            >
                              {
                                payment.paymentMethod
                              }
                            </span>
                          </td>

                          <td className="ref-no">
                            {
                              payment.referenceNo
                            }
                          </td>

                          <td>
                            <span className="status-pill paid">
                              Successful
                            </span>
                          </td>

                          <td>

                            <button
                              className="btn-receipt"
                              onClick={() => {
                                const emi =
                                  emiScheduleList.find(
                                    (item) =>
                                      Number(
                                        item.emiIndex
                                      ) ===
                                      Number(
                                        payment.emiNo
                                      )
                                  );

                                if (
                                  emi
                                ) {
                                  handlePrintReceipt(
                                    emi
                                  );
                                }
                              }}
                            >
                              <Download
                                size={14}
                              />
                              Receipt
                            </button>

                          </td>

                        </tr>
                      )
                    )
                  ) : (
                    <tr>

                      <td
                        colSpan="7"
                        style={{
                          textAlign:
                            "center",
                          padding:
                            "20px",
                        }}
                      >
                        No payment history
                        available yet.
                      </td>

                    </tr>
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* =================================================
            RIGHT SIDEBAR
        ================================================= */}

        <div className="right-panel-stack">

          {/* PAYMENT SUMMARY */}

          <div className="side-card">

            <h3 className="side-card-title">
              Payment Summary
            </h3>

            <div className="summary-list">

              <div className="summary-row">
                <span>
                  Total Payment Made
                </span>

                <strong className="text-green">
                  ₹
                  {totalPaymentMade.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <div className="summary-row">
                <span>
                  Total Interest Paid
                </span>

                <strong className="text-purple">
                  ₹
                  {totalInterestPaid.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <div className="summary-row">
                <span>
                  Principal Paid
                </span>

                <strong className="text-blue">
                  ₹
                  {totalPrincipalPaid.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <div className="summary-row">
                <span>
                  Remaining Principal
                </span>

                <strong className="text-orange">
                  ₹
                  {remainingPrincipal.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <div className="summary-row">
                <span>
                  Next EMI Due
                </span>

                <strong className="text-blue">
                  {nextDueDateStr}
                </strong>
              </div>

              <div className="summary-row">
                <span>
                  Days Remaining
                </span>

                <strong className="text-red">
                  {daysRemainingText}
                </strong>
              </div>

            </div>
          </div>

          {/* RECENT PAYMENTS */}

          <div className="side-card">

            <div className="side-card-header">

              <h3 className="side-card-title">
                Recent Payments
              </h3>

              <button
                className="btn-link"
                onClick={() =>
                  setActiveTab(
                    "history"
                  )
                }
              >
                View All
              </button>

            </div>

            <div className="history-table-wrapper">

              <table className="history-table">

                <thead>

                  <tr>

                    <th>
                      Date
                    </th>

                    <th>
                      Amount (₹)
                    </th>

                    <th>
                      Method
                    </th>

                    <th>
                      Ref No.
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {paymentHistory
                    .slice(0, 4)
                    .map(
                      (payment) => (
                        <tr
                          key={
                            payment.id
                          }
                        >

                          <td>
                            {formatDate(
                              payment.paymentDate
                            )}
                          </td>

                          <td className="bold">
                            ₹
                            {Number(
                              payment.amount ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          <td>

                            <span
                              className={`method-badge ${String(
                                payment.paymentMethod ||
                                  ""
                              ).toLowerCase()}`}
                            >
                              {
                                payment.paymentMethod
                              }
                            </span>

                          </td>

                          <td className="ref-no">
                            {
                              payment.referenceNo
                            }
                          </td>

                        </tr>
                      )
                    )}

                  {paymentHistory.length ===
                    0 && (
                    <tr>
                      <td colSpan="4" style={{  textAlign: "center",  padding: "15px", }} >  No payments yet
                      </td>
                    </tr>
                  )}

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