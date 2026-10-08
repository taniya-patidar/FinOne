import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const AnalyticsCharts = () => {
  const [loanApplications, setLoanApplications] = useState([]);

  /*
   * ============================================================
   * LOAD LOAN APPLICATIONS
   * ============================================================
   */

  const loadLoanApplications = () => {
    try {
      const savedLoans = localStorage.getItem(
        "loanApplications"
      );

      if (!savedLoans) {
        setLoanApplications([]);
        return;
      }

      const parsedLoans = JSON.parse(savedLoans);

      if (Array.isArray(parsedLoans)) {
        setLoanApplications(parsedLoans);
      } else {
        setLoanApplications([]);
      }
    } catch (error) {
      console.error(
        "Error loading loan applications:",
        error
      );

      setLoanApplications([]);
    }
  };

  /*
   * ============================================================
   * SYNC WITH LOAN APPLICATION PAGE
   * ============================================================
   */

  useEffect(() => {
    loadLoanApplications();

    const handleSync = () => {
      loadLoanApplications();
    };

    window.addEventListener(
      "storage",
      handleSync
    );

    window.addEventListener(
      "loansUpdated",
      handleSync
    );

    window.addEventListener(
      "customersUpdated",
      handleSync
    );

    window.addEventListener(
      "focus",
      handleSync
    );

    return () => {
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

      window.removeEventListener(
        "focus",
        handleSync
      );
    };
  }, []);

  /*
   * ============================================================
   * HELPER: CONVERT DIFFERENT AMOUNT FORMATS TO NUMBER
   * ============================================================
   */

  const parseAmount = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return 0;
    }

    if (typeof value === "number") {
      return Number.isFinite(value)
        ? value
        : 0;
    }

    const cleanedValue = String(value)
      .replace(/₹/g, "")
      .replace(/,/g, "")
      .replace(/[^\d.-]/g, "");

    const numberValue = Number(
      cleanedValue
    );

    return Number.isFinite(numberValue)
      ? numberValue
      : 0;
  };

  /*
   * ============================================================
   * HELPER: GET DATE FROM APPLICATION
   * ============================================================
   */

  const getApplicationDate = (loan) => {
    return (
      loan.appliedOn ||
      loan.createdAt ||
      loan.applicationDate ||
      loan.date ||
      null
    );
  };

  /*
   * ============================================================
   * CHART 1:
   * APPLICATIONS TREND
   *
   * Automatically creates monthly data from loanApplications.
   * No static months or numbers.
   * ============================================================
   */

  const trendData = useMemo(() => {
    const monthlyApplications = {};

    loanApplications.forEach((loan) => {
      const rawDate =
        getApplicationDate(loan);

      if (!rawDate) {
        return;
      }

      const date = new Date(rawDate);

      if (Number.isNaN(date.getTime())) {
        return;
      }

      const monthKey =
        `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

      if (!monthlyApplications[monthKey]) {
        monthlyApplications[monthKey] = {
          date,
          Applications: 0,
        };
      }

      monthlyApplications[
        monthKey
      ].Applications += 1;
    });

    return Object.keys(
      monthlyApplications
    )
      .sort()
      .map((key) => {
        const item =
          monthlyApplications[key];

        return {
          month: item.date.toLocaleDateString(
            "en-US",
            {
              month: "short",
              year: "numeric",
            }
          ),
          Applications:
            item.Applications,
        };
      });
  }, [loanApplications]);

  /*
   * ============================================================
   * CHART 2:
   * APPROVAL STATUS
   *
   * Automatically calculated from loanApplications.
   * ============================================================
   */

  const statusData = useMemo(() => {
    const approvedCount =
      loanApplications.filter(
        (loan) =>
          String(loan.status || "")
            .toLowerCase()
            .trim() === "approved"
      ).length;

    const pendingCount =
      loanApplications.filter(
        (loan) =>
          String(loan.status || "")
            .toLowerCase()
            .trim() === "pending"
      ).length;

    const rejectedCount =
      loanApplications.filter(
        (loan) =>
          String(loan.status || "")
            .toLowerCase()
            .trim() === "rejected"
      ).length;

    return [
      {
        name: "Approved",
        value: approvedCount,
        color: "#22c55e",
      },
      {
        name: "Pending",
        value: pendingCount,
        color: "#f59e0b",
      },
      {
        name: "Rejected",
        value: rejectedCount,
        color: "#ef4444",
      },
    ].filter(
      (item) => item.value > 0
    );
  }, [loanApplications]);

  /*
   * ============================================================
   * CHART 3:
   * LOAN TYPE DISTRIBUTION
   *
   * Automatically calculated from loanApplications.
   * ============================================================
   */

  const loanTypeData = useMemo(() => {
    const loanTypeCounts = {};

    loanApplications.forEach(
      (loan) => {
        const type =
          loan.loanType ||
          loan.type ||
          "Personal Loan";

        if (!loanTypeCounts[type]) {
          loanTypeCounts[type] = 0;
        }

        loanTypeCounts[type] += 1;
      }
    );

    const typeColors = [
      "#0284c7",
      "#10b981",
      "#8b5cf6",
      "#f59e0b",
      "#ec4899",
      "#6366f1",
      "#14b8a6",
      "#f97316",
    ];

    return Object.keys(
      loanTypeCounts
    ).map((type, index) => ({
      name: type,
      value: loanTypeCounts[type],
      color:
        typeColors[
          index % typeColors.length
        ],
    }));
  }, [loanApplications]);

  /*
   * ============================================================
   * CHART 4:
   * EMI COLLECTION OVERVIEW
   *
   * This tries several common field names so it works with
   * different loan/EMI data structures.
   *
   * Supported examples:
   *
   * paidAmount
   * emiPaid
   * paidEmi
   * totalPaid
   * amountPaid
   *
   * pendingAmount
   * emiPending
   * pendingEmi
   *
   * overdueAmount
   * emiOverdue
   * overdueEmi
   *
   * OR:
   * emiStatus/paymentStatus/status
   * with emiAmount/amount
   * ============================================================
   */

  const emiData = useMemo(() => {
    let paidAmount = 0;
    let pendingAmount = 0;
    let overdueAmount = 0;

    loanApplications.forEach(
      (loan) => {
        /*
         * --------------------------------------------------------
         * DIRECT PAID / PENDING / OVERDUE AMOUNTS
         * --------------------------------------------------------
         */

        const directPaid =
          loan.paidAmount ??
          loan.emiPaid ??
          loan.paidEmi ??
          loan.totalPaid ??
          loan.amountPaid;

        const directPending =
          loan.pendingAmount ??
          loan.emiPending ??
          loan.pendingEmi;

        const directOverdue =
          loan.overdueAmount ??
          loan.emiOverdue ??
          loan.overdueEmi;

        if (
          directPaid !== undefined &&
          directPaid !== null
        ) {
          paidAmount +=
            parseAmount(directPaid);
        }

        if (
          directPending !== undefined &&
          directPending !== null
        ) {
          pendingAmount +=
            parseAmount(directPending);
        }

        if (
          directOverdue !== undefined &&
          directOverdue !== null
        ) {
          overdueAmount +=
            parseAmount(directOverdue);
        }

        /*
         * --------------------------------------------------------
         * EMI STATUS + EMI AMOUNT
         *
         * Example:
         *
         * {
         *   emiAmount: 25000,
         *   emiStatus: "Paid"
         * }
         * --------------------------------------------------------
         */

        const emiAmount =
          loan.emiAmount ??
          loan.emi ??
          loan.monthlyEmi ??
          loan.installmentAmount;

        const paymentStatus =
          loan.emiStatus ??
          loan.paymentStatus ??
          loan.paymentState;

        if (
          emiAmount !== undefined &&
          emiAmount !== null &&
          paymentStatus
        ) {
          const amount =
            parseAmount(emiAmount);

          const normalizedStatus =
            String(paymentStatus)
              .toLowerCase()
              .trim();

          if (
            normalizedStatus ===
              "paid" ||
            normalizedStatus ===
              "completed" ||
            normalizedStatus ===
              "collected"
          ) {
            paidAmount += amount;
          } else if (
            normalizedStatus ===
              "pending" ||
            normalizedStatus ===
              "unpaid"
          ) {
            pendingAmount += amount;
          } else if (
            normalizedStatus ===
              "overdue" ||
            normalizedStatus ===
              "late"
          ) {
            overdueAmount += amount;
          }
        }
      }
    );

    return [
      {
        category: "Paid",
        amount: Number(
          (paidAmount / 100000).toFixed(
            2
          )
        ),
      },
      {
        category: "Pending",
        amount: Number(
          (pendingAmount / 100000).toFixed(
            2
          )
        ),
      },
      {
        category: "Overdue",
        amount: Number(
          (overdueAmount / 100000).toFixed(
            2
          ),
        ),
      },
    ];
  }, [loanApplications]);

  /*
   * ============================================================
   * EMPTY DATA FALLBACKS
   * ============================================================
   */

  const emptyStatusData = [
    {
      name: "No Data",
      value: 1,
      color: "#cbd5e1",
    },
  ];

  const emptyLoanTypeData = [
    {
      name: "No Data",
      value: 1,
      color: "#cbd5e1",
    },
  ];

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <div className="charts-grid">

      {/* ======================================================
          CHART 1: APPLICATIONS TREND
          ====================================================== */}

      <div className="chart-card">
        <h4>
          Applications Trend
        </h4>

        <div
          style={{
            width: "100%",
            height: 220,
          }}
        >
          <ResponsiveContainer>
            <AreaChart
              data={trendData}
            >
              <XAxis
                dataKey="month"
                stroke="#94a3b8"
              />

              <YAxis
                stroke="#94a3b8"
                allowDecimals={false}
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="Applications"
                stroke="#2563eb"
                fill="#dbeafe"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ======================================================
          CHART 2: APPROVAL STATUS
          ====================================================== */}

      <div className="chart-card">
        <h4>
          Approval Status
        </h4>

        <div
          style={{
            width: "100%",
            height: 220,
          }}
        >
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={
                  statusData.length
                    ? statusData
                    : emptyStatusData
                }
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {(statusData.length
                  ? statusData
                  : emptyStatusData
                ).map(
                  (
                    entry,
                    index
                  ) => (
                    <Cell
                      key={`status-cell-${index}`}
                      fill={entry.color}
                    />
                  )
                )}
              </Pie>

              <Tooltip />

              <Legend
                verticalAlign="bottom"
                height={36}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ======================================================
          CHART 3: LOAN TYPE DISTRIBUTION
          ====================================================== */}

      <div className="chart-card">
        <h4>
          Loan Type Distribution
        </h4>

        <div
          style={{
            width: "100%",
            height: 220,
          }}
        >
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={
                  loanTypeData.length
                    ? loanTypeData
                    : emptyLoanTypeData
                }
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {(loanTypeData.length
                  ? loanTypeData
                  : emptyLoanTypeData
                ).map(
                  (
                    entry,
                    index
                  ) => (
                    <Cell
                      key={`loan-type-cell-${index}`}
                      fill={entry.color}
                    />
                  )
                )}
              </Pie>

              <Tooltip />

              <Legend
                verticalAlign="bottom"
                height={36}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ======================================================
          CHART 4: EMI COLLECTION
          ====================================================== */}

      <div className="chart-card">
        <h4>
          EMI Collection Overview (Lakhs)
        </h4>

        <div
          style={{
            width: "100%",
            height: 220,
          }}
        >
          <ResponsiveContainer>
            <BarChart
              data={emiData}
            >
              <XAxis
                dataKey="category"
                stroke="#94a3b8"
              />

              <YAxis
                stroke="#94a3b8"
              />

              <Tooltip
                formatter={(value) =>
                  `₹ ${value} Lakhs`
                }
              />

              <Bar
                dataKey="amount"
                fill="#10b981"
                radius={[
                  4,
                  4,
                  0,
                  0,
                ]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsCharts;