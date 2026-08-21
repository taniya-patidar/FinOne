import React, {
  useEffect,
  useMemo,
  useState,
  useRef
} from "react";

import {
  Search,
  Eye,
  Trash2,
  Pencil,
  MoreVertical,
  Plus,
  RefreshCw,
  Columns3,
  Download,
  ChevronDown,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./CustomerList.css";



const defaultCustomers = [
  {
    id: "CUST-10001",
    name: "Rahul Sharma",
    mobile: "9876543210",
    email: "rahul.sharma@email.com",
    loanType: "Home Loan",
    kycStatus: "Verified",
    status: "Active",
    registeredOn: "03 May 2024",

    personalInformation: {
      fullName: "Rahul Sharma",
      dob: "1990-05-15",
      gender: "Male",
      mobile: "9876543210",
      email: "rahul.sharma@email.com",
    },

    addressInformation: {
      address1: "24 Nehru Place",
      address2: "Near Metro Station",
      city: "New Delhi",
      state: "Delhi",
      pinCode: "110019",
    },

    identityVerification: {
      aadhaar: "452178963214",
      pan: "ABCDE1234F",
    },

    employmentDetails: {
      occupation: "Software Engineer",
      companyName: "Tech Solutions Pvt Ltd",
      monthlyIncome: "85000",
    },

    documents: {
      aadhaarCard: {
        name: "rahul-aadhaar.pdf",
        type: "application/pdf",
        size: 245678,
      },

      panCard: {
        name: "rahul-pan.pdf",
        type: "application/pdf",
        size: 187654,
      },

      salarySlip: {
        name: "rahul-salary-slip.pdf",
        type: "application/pdf",
        size: 321456,
      },

      bankStatement: {
        name: "rahul-bank-statement.pdf",
        type: "application/pdf",
        size: 456789,
      },
    },
  },

  {
    id: "CUST-10002",
    name: "Neha Verma",
    mobile: "9876543211",
    email: "neha.verma@email.com",
    loanType: "Personal Loan",
    kycStatus: "Verified",
    status: "Active",
    registeredOn: "02 May 2024",

    personalInformation: {
      fullName: "Neha Verma",
      dob: "1993-08-22",
      gender: "Female",
      mobile: "9876543211",
      email: "neha.verma@email.com",
    },

    addressInformation: {
      address1: "18 Sector 15",
      address2: "Near City Centre",
      city: "Gurugram",
      state: "Haryana",
      pinCode: "122001",
    },

    identityVerification: {
      aadhaar: "563289741025",
      pan: "BCDEF2345G",
    },

    employmentDetails: {
      occupation: "HR Manager",
      companyName: "Global Services Ltd",
      monthlyIncome: "72000",
    },

    documents: {
      aadhaarCard: {
        name: "neha-aadhaar.pdf",
        type: "application/pdf",
        size: 234567,
      },

      panCard: {
        name: "neha-pan.pdf",
        type: "application/pdf",
        size: 176543,
      },

      salarySlip: {
        name: "neha-salary-slip.pdf",
        type: "application/pdf",
        size: 298765,
      },

      bankStatement: {
        name: "neha-bank-statement.pdf",
        type: "application/pdf",
        size: 412345,
      },
    },
  },

  {
    id: "CUST-10003",
    name: "Amit Patel",
    mobile: "9876543212",
    email: "amit.patel@email.com",
    loanType: "Business Loan",
    kycStatus: "Pending",
    status: "Active",
    registeredOn: "02 May 2024",

    personalInformation: {
      fullName: "Amit Patel",
      dob: "1988-11-10",
      gender: "Male",
      mobile: "9876543212",
      email: "amit.patel@email.com",
    },

    addressInformation: {
      address1: "42 MG Road",
      address2: "Patel Nagar",
      city: "Ahmedabad",
      state: "Gujarat",
      pinCode: "380001",
    },

    identityVerification: {
      aadhaar: "674391852036",
      pan: "CDEFG3456H",
    },

    employmentDetails: {
      occupation: "Business Owner",
      companyName: "Patel Enterprises",
      monthlyIncome: "125000",
    },

    documents: {
      aadhaarCard: {
        name: "amit-aadhaar.pdf",
        type: "application/pdf",
        size: 223456,
      },

      panCard: {
        name: "amit-pan.pdf",
        type: "application/pdf",
        size: 165432,
      },

      salarySlip: null,

      bankStatement: {
        name: "amit-bank-statement.pdf",
        type: "application/pdf",
        size: 398765,
      },
    },
  },

  {
    id: "CUST-10004",
    name: "Priya Singh",
    mobile: "9876543213",
    email: "priya.singh@email.com",
    loanType: "Business Loan",
    kycStatus: "Pending",
    status: "Active",
    registeredOn: "02 May 2024",

    personalInformation: {
      fullName: "Priya Singh",
      dob: "1992-03-18",
      gender: "Female",
      mobile: "9876543213",
      email: "priya.singh@email.com",
    },

    addressInformation: {
      address1: "77 Civil Lines",
      address2: "Near Railway Colony",
      city: "Jaipur",
      state: "Rajasthan",
      pinCode: "302006",
    },

    identityVerification: {
      aadhaar: "785412963047",
      pan: "DEFGH4567J",
    },

    employmentDetails: {
      occupation: "Business Consultant",
      companyName: "Singh Consulting",
      monthlyIncome: "95000",
    },

    documents: {
      aadhaarCard: {
        name: "priya-aadhaar.pdf",
        type: "application/pdf",
        size: 214567,
      },

      panCard: {
        name: "priya-pan.pdf",
        type: "application/pdf",
        size: 154321,
      },

      salarySlip: null,

      bankStatement: {
        name: "priya-bank-statement.pdf",
        type: "application/pdf",
        size: 387654,
      },
    },
  },

  {
    id: "CUST-10005",
    name: "Rohit Kumar",
    mobile: "9876543214",
    email: "rohit.kumar@email.com",
    loanType: "Business Loan",
    kycStatus: "Pending",
    status: "Active",
    registeredOn: "02 May 2024",

    personalInformation: {
      fullName: "Rohit Kumar",
      dob: "1987-07-25",
      gender: "Male",
      mobile: "9876543214",
      email: "rohit.kumar@email.com",
    },

    addressInformation: {
      address1: "12 Fraser Road",
      address2: "Near Gandhi Maidan",
      city: "Patna",
      state: "Bihar",
      pinCode: "800001",
    },

    identityVerification: {
      aadhaar: "896523741058",
      pan: "EFGHI5678K",
    },

    employmentDetails: {
      occupation: "Business Owner",
      companyName: "RK Traders",
      monthlyIncome: "110000",
    },

    documents: {
      aadhaarCard: {
        name: "rohit-aadhaar.pdf",
        type: "application/pdf",
        size: 234876,
      },

      panCard: {
        name: "rohit-pan.pdf",
        type: "application/pdf",
        size: 167890,
      },

      salarySlip: null,

      bankStatement: {
        name: "rohit-bank-statement.pdf",
        type: "application/pdf",
        size: 423567,
      },
    },
  },
];



const CustomerList = () => {
  const navigate = useNavigate();

  // 1. Ref add karein (navigateline ke baad)
const menuRef = useRef(null);

// 2. Iss useEffect ko existing useEffects ke sath add kar dein
useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowColumns(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);


  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [loanTypeFilter, setLoanTypeFilter] =
    useState("All Loan Types");

  const [kycFilter, setKycFilter] =
    useState("All KYC Status");

  const [showColumns, setShowColumns] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  const customersPerPage = 3;

  // visible column 

  const [visibleColumns, setVisibleColumns] =
    useState({
      id: true,
      customer: true,
      mobile: true,
      email: true,
      loanType: true,
      kycStatus: true,
      status: true,
      registeredOn: true,
      actions: true,
    });

  // ======================================================
  // LOAD CUSTOMERS
  // ======================================================

  const loadCustomers = () => {
    try {
      const savedCustomers =
        JSON.parse(
          localStorage.getItem("customers")
        );

     

      if (
        !Array.isArray(savedCustomers) ||
        savedCustomers.length === 0
      ) {
        localStorage.setItem(
          "customers",
          JSON.stringify(defaultCustomers)
        );

        setCustomers(defaultCustomers);

        return;
      }

      // ==================================================
      // MERGE STATIC DATA WITH OLD DATA
      // ==================================================

      const mergedDefaultCustomers =
        defaultCustomers.map(
          (defaultCustomer) => {
            const oldCustomer =
              savedCustomers.find(
                (customer) =>
                  String(customer.id) ===
                  String(defaultCustomer.id)
              );

            if (!oldCustomer) {
              return defaultCustomer;
            }

            return {
              ...defaultCustomer,
              ...oldCustomer,

              personalInformation: {
                ...defaultCustomer.personalInformation,
                ...(oldCustomer.personalInformation ||
                  {}),
              },

              addressInformation: {
                ...defaultCustomer.addressInformation,
                ...(oldCustomer.addressInformation ||
                  {}),
              },

              identityVerification: {
                ...defaultCustomer.identityVerification,
                ...(oldCustomer.identityVerification ||
                  {}),
              },
              

              employmentDetails: {
                ...defaultCustomer.employmentDetails,
                ...(oldCustomer.employmentDetails ||
                  {}),
              },

              documents: {
                ...defaultCustomer.documents,
                ...(oldCustomer.documents || {}),
              },
            };
          }
        );

      // ==================================================
      // KEEP CUSTOMERS ADDED THROUGH FORM
      // ==================================================

      const newlyAddedCustomers =
        savedCustomers.filter(
          (savedCustomer) =>
            !defaultCustomers.some(
              (defaultCustomer) =>
                String(defaultCustomer.id) ===
                String(savedCustomer.id)
            )
        );

      // ==================================================
      // FINAL CUSTOMER LIST
      // ==================================================

      const finalCustomers = [
        ...mergedDefaultCustomers,
        ...newlyAddedCustomers,
      ];

      // ==================================================
      // SAVE FINAL DATA
      // ==================================================

      localStorage.setItem(
        "customers",
        JSON.stringify(finalCustomers)
      );

      setCustomers(finalCustomers);
    } catch (error) {
      console.error(
        "Error loading customers:",
        error
      );

      localStorage.setItem(
        "customers",
        JSON.stringify(defaultCustomers)
      );

      setCustomers(defaultCustomers);
    }
  };

  // ======================================================
  // LOAD DATA WHEN PAGE OPENS
  // ======================================================

  useEffect(() => {
    loadCustomers();
  }, []);

  
        //
        const handleDeleteCustomer = (id) => {
  const confirmDelete = window.confirm("Kya aap is customer ko delete karna chahte hain?");
  if (!confirmDelete) return;

  // Filter out the selected customer
  const updatedCustomers = customers.filter(
    (customer) => String(customer.id) !== String(id)
  );

  // Update State
  setCustomers(updatedCustomers);

  // Update LocalStorage
  localStorage.setItem("customers", JSON.stringify(updatedCustomers));
};


  // ======================================================
  // COLUMN TOGGLE
  // ======================================================

  const toggleColumn = (column) => {
    setVisibleColumns((previous) => ({
      ...previous,
      [column]: !previous[column],
    }));
  };

  // ======================================================
  // SEARCH + FILTER
  // ======================================================

  const filteredCustomers = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    return customers.filter((customer) => {
      const customerId =
        String(
          customer.id || ""
        ).toLowerCase();

      const customerName =
        String(
          customer.name ||
            customer.fullName ||
            customer.personalInformation
              ?.fullName ||
            ""
        ).toLowerCase();

      const mobile =
        String(
          customer.mobile ||
            customer.personalInformation
              ?.mobile ||
            ""
        );

      const email =
        String(
          customer.email ||
            customer.personalInformation
              ?.email ||
            ""
        ).toLowerCase();

      const loanType =
        String(
          customer.loanType || ""
        );

      const kycStatus =
        String(
          customer.kycStatus || ""
        );

      const status =
        String(
          customer.status || ""
        );

      const matchesSearch =
        customerId.includes(
          searchValue
        ) ||
        customerName.includes(
          searchValue
        ) ||
        mobile.includes(
          searchValue
        ) ||
        email.includes(
          searchValue
        );

      const matchesStatus =
        statusFilter === "All Status" ||
        status === statusFilter;

      const matchesLoanType =
        loanTypeFilter ===
          "All Loan Types" ||
        loanType ===
          loanTypeFilter;

      const matchesKyc =
        kycFilter ===
          "All KYC Status" ||
        kycStatus === kycFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLoanType &&
        matchesKyc
      );
    });
  }, [
    customers,
    search,
    statusFilter,
    loanTypeFilter,
    kycFilter,
  ]);

  // ======================================================
  // PAGINATION
  // ======================================================

  const indexOfLastCustomer =
    currentPage * customersPerPage;

  const indexOfFirstCustomer =
    indexOfLastCustomer -
    customersPerPage;

  const currentCustomers =
    filteredCustomers.slice(
      indexOfFirstCustomer,
      indexOfLastCustomer
    );

  const totalPages =
    Math.ceil(
      filteredCustomers.length /
        customersPerPage
    );

  // ======================================================
  // RESET PAGE
  // ======================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    loanTypeFilter,
    kycFilter,
  ]);

  // ======================================================
  // REFRESH
  // ======================================================

  const handleRefresh = () => {
    setLoading(true);

    setTimeout(() => {
      loadCustomers();
      setLoading(false);
    }, 500);
  };

  // ======================================================
  // NAVIGATION
  // ======================================================

  const handleAddCustomer = () => {
    navigate("/customers/add");
  };

  const handleViewCustomer = (id) => {
    navigate(`/customers/${id}`);
  };

  const handleEditCustomer = (id) => {
    navigate(`/customers/${id}/edit`);
  };

  // ======================================================
  // EXPORT
  // ======================================================
 const handleExport = () => {
  if (filteredCustomers.length === 0) {
    alert("There is no customer to export.");
    return;
  }

  const headers = [
    "Customer ID",
    "Customer",
    "Mobile Number",
    "Email ID",
    "Loan Type",
    "KYC Status",
    "Status",
    "Registered On",
  ];

  const rows = filteredCustomers.map((customer) => [
    customer.id || "",
    customer.name || customer.fullName || "",
    customer.mobile || "",
    customer.email || "",
    customer.loanType || "",
    customer.kycStatus || "",
    customer.status || "",
    customer.registeredOn || "",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\r\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `customer-list-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
  // ======================================================
  // SUMMARY COUNTS
  // ======================================================

  const totalCustomers =
    customers.length;

  const activeCustomers =
    customers.filter(
      (customer) =>
        customer.status ===
        "Active"
    ).length;

  const inactiveCustomers =
    customers.filter(
      (customer) =>
        customer.status ===
        "Inactive"
    ).length;

  const kycVerified =
    customers.filter(
      (customer) =>
        customer.kycStatus ===
        "Verified"
    ).length;

  const kycPending =
    customers.filter(
      (customer) =>
        customer.kycStatus ===
        "Pending"
    ).length;

  // ======================================================
  // SAFE CUSTOMER NAME
  // ======================================================

  const getCustomerName = (
    customer
  ) => {
    return (
      customer.name ||
      customer.fullName ||
      customer.personalInformation
        ?.fullName ||
      "Unnamed Customer"
    );
  };

  // ======================================================
  // SAFE MOBILE
  // ======================================================

  const getCustomerMobile = (
    customer
  ) => {
    return (
      customer.mobile ||
      customer.personalInformation
        ?.mobile ||
      "-"
    );
  };

  // ======================================================
  // SAFE EMAIL
  // ======================================================

  const getCustomerEmail = (
    customer
  ) => {
    return (
      customer.email ||
      customer.personalInformation
        ?.email ||
      "-"
    );
  };

  // ======================================================
  // SAFE KYC STATUS
  // ======================================================

  const getKycStatus = (
    customer
  ) => {
    return (
      customer.kycStatus ||
      "Pending"
    );
  };

  // ======================================================
  // SAFE CUSTOMER STATUS
  // ======================================================

  const getCustomerStatus = (
    customer
  ) => {
    return (
      customer.status ||
      "Active"
    );
  };

  // ======================================================
  // RETURN
  // ======================================================

  return (
    <section className="customer-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="customer-page-header">

        <div>
          <h1>
            Customer Management
          </h1>

          <p>
            Manage and view all your
            customers
          </p>
        </div>

        <button
          className="add-customer-btn"
          onClick={
            handleAddCustomer
          }
        >
          <Plus size={18} />

          Add Customer
        </button>

      </div>

      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <div className="customer-summary">

        <div className="summary-card">
          <span>
            Total Customers
          </span>

          <h2>
            {totalCustomers}
          </h2>

          <p>
            All registered customers
          </p>
        </div>

        <div className="summary-card">
          <span>
            Active Customers
          </span>

          <h2>
            {activeCustomers}
          </h2>

          <p>
            Currently active
          </p>
        </div>

        <div className="summary-card">
          <span>
            Inactive Customers
          </span>

          <h2>
            {inactiveCustomers}
          </h2>

          <p>
            Inactive / closed
          </p>
        </div>

        <div className="summary-card">
          <span>
            KYC Verified
          </span>

          <h2>
            {kycVerified}
          </h2>

          <p>
            KYC completed
          </p>
        </div>

        <div className="summary-card">
          <span>
            KYC Pending
          </span>

          <h2>
            {kycPending}
          </h2>

          <p>
            KYC incomplete
          </p>
        </div>

      </div>

      {/* ==================================================
          SEARCH + FILTERS
      ================================================== */}

      <div className="customer-filters">

        <div className="customer-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search by name, mobile, email or ID..."
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
            Active
          </option>

          <option>
            Inactive
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

        <select
          value={kycFilter}
          onChange={(e) =>
            setKycFilter(
              e.target.value
            )
          }
        >
          <option>
            All KYC Status
          </option>

          <option>
            Verified
          </option>

          <option>
            Pending
          </option>
        </select>

      </div>

      {/* ==================================================
          CUSTOMER TABLE CARD
      ================================================== */}

      <div className="customer-table-card">

        {/* ==================================================
            TABLE TOP
        ================================================== */}

        <div className="table-top">

          <div>
            <h2>
              Customer List
            </h2>

            <p>
              Showing{" "}
              {
                filteredCustomers.length
              }{" "}
              customers
            </p>
          </div>

          <div className="table-actions">

            {/* REFRESH */}

            <button
              className="table-action-btn"
              onClick={
                handleRefresh
              }
              title="Refresh"
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

            <div className="columns-wrapper" ref={menuRef}>

              <button
                className="table-action-btn"
                onClick={() =>
                  setShowColumns(
                    !showColumns
                  )
                }
              >
                <Columns3 size={16} />

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
                  <label>
                    <input
                      type="checkbox"
                      checked={
                        visibleColumns.id
                      }
                      onChange={() =>
                        toggleColumn(
                          "id"
                        )
                      }
                    />

                    Customer ID
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={
                        visibleColumns.customer
                      }
                      onChange={() =>
                        toggleColumn(
                          "customer"
                        )
                      }
                    />

                    Customer
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={
                        visibleColumns.mobile
                      }
                      onChange={() =>
                        toggleColumn(
                          "mobile"
                        )
                      }
                    />

                    Mobile Number
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={
                        visibleColumns.email
                      }
                      onChange={() =>
                        toggleColumn(
                          "email"
                        )
                      }
                    />

                    Email ID
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={
                        visibleColumns.loanType
                      }
                      onChange={() =>
                        toggleColumn(
                          "loanType"
                        )
                      }
                    />

                    Loan Type
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={
                        visibleColumns.kycStatus
                      }
                      onChange={() =>
                        toggleColumn(
                          "kycStatus"
                        )
                      }
                    />

                    KYC Status
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={
                        visibleColumns.status
                      }
                      onChange={() =>
                        toggleColumn(
                          "status"
                        )
                      }
                    />

                    Status
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={
                        visibleColumns.registeredOn
                      }
                      onChange={() =>
                        toggleColumn(
                          "registeredOn"
                        )
                      }
                    />

                    Registered On
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={
                        visibleColumns.actions
                      }
                      onChange={() =>
                        toggleColumn(
                          "actions"
                        )
                      }
                    />

                    Actions
                  </label>
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
              <Download size={16} />

              Export
            </button>

          </div>

        </div>

        {/* ==================================================
            TABLE
        ================================================== */}

        <div className="table-wrapper">

          <table>

            <thead>

              <tr>

                {visibleColumns.id && (
                  <th>
                    Customer ID
                  </th>
                )}

                {visibleColumns.customer && (
                  <th>
                    Customer
                  </th>
                )}

                {visibleColumns.mobile && (
                  <th>
                    Mobile Number
                  </th>
                )}

                {visibleColumns.email && (
                  <th>
                    Email ID
                  </th>
                )}

                {visibleColumns.loanType && (
                  <th>
                    Loan Type
                  </th>
                )}

                {visibleColumns.kycStatus && (
                  <th>
                    KYC Status
                  </th>
                )}

                {visibleColumns.status && (
                  <th>
                    Status
                  </th>
                )}

                {visibleColumns.registeredOn && (
                  <th>
                    Registered On
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
                    colSpan={
                      Object.values(
                        visibleColumns
                      ).filter(Boolean)
                        .length
                    }
                    className="table-loading"
                  >
                    Loading customers...
                  </td>

                </tr>

              ) : currentCustomers.length ===
                0 ? (

                /* NO DATA */

                <tr>

                  <td
                    colSpan={
                      Object.values(
                        visibleColumns
                      ).filter(Boolean)
                        .length
                    }
                    className="table-loading"
                  >
                    No customers found.
                  </td>

                </tr>

              ) : (

                /* CUSTOMER ROWS */

                currentCustomers.map(
                  (customer) => {

                    const customerName =
                      getCustomerName(
                        customer
                      );

                    const customerMobile =
                      getCustomerMobile(
                        customer
                      );

                    const customerEmail =
                      getCustomerEmail(
                        customer
                      );

                    const kycStatus =
                      getKycStatus(
                        customer
                      );

                    const customerStatus =
                      getCustomerStatus(
                        customer
                      );

                    return (
                      <tr
                        key={
                          customer.id
                        }
                      >

                        {/* CUSTOMER ID */}

                        {visibleColumns.id && (
                          <td>
                            <span className="customer-id">
                              {
                                customer.id ||
                                "-"
                              }
                            </span>
                          </td>
                        )}

                        {/* CUSTOMER */}

                        {visibleColumns.customer && (
                          <td>

                            <div className="customer-name">

                              <div className="customer-avatar">

                                {customerName
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase()}

                              </div>

                              <span>
                                {
                                  customerName
                                }
                              </span>

                            </div>

                          </td>
                        )}

                        {/* MOBILE */}

                        {visibleColumns.mobile && (
                          <td>
                            {
                              customerMobile
                            }
                          </td>
                        )}

                        {/* EMAIL */}

                        {visibleColumns.email && (
                          <td>
                            {
                              customerEmail
                            }
                          </td>
                        )}

                        {/* LOAN TYPE */}

                        {visibleColumns.loanType && (
                          <td>

                            <span className="loan-type">
                              {
                                customer.loanType ||
                                "-"
                              }
                            </span>

                          </td>
                        )}

                        {/* KYC */}

                        {visibleColumns.kycStatus && (
                          <td>

                            <span
                              className={`kyc-status ${kycStatus
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )}`}
                            >
                              {
                                kycStatus
                              }
                            </span>

                          </td>
                        )}

                        {/* STATUS */}

                        {visibleColumns.status && (
                          <td>

                            <span
                              className={`customer-status ${customerStatus
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )}`}
                            >
                              {
                                customerStatus
                              }
                            </span>

                          </td>
                        )}

                        {/* REGISTERED */}

                        {visibleColumns.registeredOn && (
                          <td>
                            {
                              customer.registeredOn ||
                              "-"
                            }
                          </td>
                        )}

                        {/* ACTIONS */}

                        {visibleColumns.actions && (
                          <td>

                            <div className="customer-actions">

                              <button
                                title="View"
                                onClick={() =>
                                  handleViewCustomer(
                                    customer.id
                                  )
                                }
                              >
                                <Eye
                                  size={17}
                                />
                              </button>

                              <button
                                title="Edit"
                                onClick={() =>
                                  handleEditCustomer(
                                    customer.id
                                  )
                                }
                              >
                                <Pencil
                                  size={17}
                                />
                               </button>

                               <button title="Delete" onClick={() => handleDeleteCustomer(customer.id)}> <Trash2 size={17} /> </button>

                            </div>

                          </td>
                        )}

                      </tr>
                    );
                  }
                )

              )}

            </tbody>

          </table>

        </div>

        {/* ==================================================
            PAGINATION
        ================================================== */}

        {totalPages > 0 && (

          <div className="pagination">

            <button
              onClick={() =>
                setCurrentPage(
                  currentPage - 1
                )
              }
              disabled={
                currentPage === 1
              }
            >
              Previous
            </button>

            {Array.from({
              length: totalPages,
            }).map(
              (_, index) => (

                <button
                  key={index}
                  onClick={() =>
                    setCurrentPage(
                      index + 1
                    )
                  }
                  className={
                    currentPage ===
                    index + 1
                      ? "active"
                      : ""
                  }
                >
                  {index + 1}
                </button>

              )
            )}

            <button
              onClick={() =>
                setCurrentPage(
                  currentPage + 1
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

export default CustomerList;