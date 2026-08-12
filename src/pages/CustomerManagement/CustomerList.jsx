import React, { useMemo, useState } from "react";
import {
  Search,
  Eye,
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

const customers = [
  {
    id: "CUST-10001",
    name: "Rahul Sharma",
    mobile: "9876543210",
    email: "rahul.sharma@email.com",
    loanType: "Home Loan",
    kycStatus: "Verified",
    status: "Active",
    registeredOn: "03 May 2024",
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
  },
];

const CustomerList = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [loanTypeFilter, setLoanTypeFilter] =
    useState("All Loan Types");
  const [kycFilter, setKycFilter] =
    useState("All KYC Status");

  const [showColumns, setShowColumns] = useState(false);
   const [loading, setLoading] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState({
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
 


  // =========================
  // COLUMN TOGGLE
  // =========================

  const toggleColumn = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredCustomers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return customers.filter((customer) => {
      const matchesSearch =
        customer.id.toLowerCase().includes(searchValue) ||
        customer.name.toLowerCase().includes(searchValue) ||
        customer.mobile.includes(searchValue) ||
        customer.email.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All Status" ||
        customer.status === statusFilter;

      const matchesLoanType =
        loanTypeFilter === "All Loan Types" ||
        customer.loanType === loanTypeFilter;

      const matchesKyc =
        kycFilter === "All KYC Status" ||
        customer.kycStatus === kycFilter;

      
      return (
        matchesSearch &&
        matchesStatus &&
        matchesLoanType &&
        matchesKyc
      );
    });
  }, [search, statusFilter, loanTypeFilter, kycFilter]);

  // =========================
  // REFRESH
  // =========================

  const handleRefresh = () => {
  setLoading(true);

  setTimeout(() => {
    setLoading(false);
  }, 800);
};

  // =========================
  // NAVIGATION
  // =========================

  const handleAddCustomer = () => {
    navigate("/customers/add");
  };

  const handleViewCustomer = (id) => {
    navigate(`/customers/${id}`);
  };

  const handleEditCustomer = (id) => {
    navigate(`/customers/${id}/edit`);
  };

  // =========================
  // EXPORT
  // =========================

  const handleExport = () => {
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
      customer.id,
      customer.name,
      customer.mobile,
      customer.email,
      customer.loanType,
      customer.kycStatus,
      customer.status,
      customer.registeredOn,
    ]);

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => `"${value}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "customer-list.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <section className="customer-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="customer-page-header">

        <div>
          <h1>Customer Management</h1>
          <p>Manage and view all your customers</p>
        </div>

        <button
          className="add-customer-btn"
          onClick={handleAddCustomer}
        >
          <Plus size={18} />
          Add Customer
        </button>

      </div>


      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <div className="customer-summary">

        <div className="summary-card">
          <span>Total Customers</span>
          <h2>2,456</h2>
          <p>All registered customers</p>
        </div>

        <div className="summary-card">
          <span>Active Customers</span>
          <h2>2,105</h2>
          <p>Currently active</p>
        </div>

        <div className="summary-card">
          <span>Inactive Customers</span>
          <h2>351</h2>
          <p>Inactive / closed</p>
        </div>

        <div className="summary-card">
          <span>KYC Verified</span>
          <h2>1,987</h2>
          <p>KYC completed</p>
        </div>

        <div className="summary-card">
          <span>KYC Pending</span>
          <h2>469</h2>
          <p>KYC incomplete</p>
        </div>

      </div>


      {/* =========================
          SEARCH + FILTERS
      ========================= */}

      <div className="customer-filters">

        <div className="customer-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search by name, mobile, email or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>


        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>


        <select
          value={loanTypeFilter}
          onChange={(e) =>
            setLoanTypeFilter(e.target.value)
          }
        >
          <option>All Loan Types</option>
          <option>Home Loan</option>
          <option>Personal Loan</option>
          <option>Business Loan</option>
          <option>Vehicle Loan</option>
        </select>


        <select
          value={kycFilter}
          onChange={(e) =>
            setKycFilter(e.target.value)
          }
        >
          <option>All KYC Status</option>
          <option>Verified</option>
          <option>Pending</option>
        </select>

      </div>


      {/* =========================
          CUSTOMER TABLE CARD
      ========================= */}

      <div className="customer-table-card">


        {/* TABLE TOP */}

        <div className="table-top">

          <div>
            <h2>Customer List</h2>
            <p>
              Showing {filteredCustomers.length} customers
            </p>
          </div>


          <div className="table-actions">


            {/* REFRESH */}

            <button
              className="table-action-btn"
              onClick={handleRefresh}
              title="Refresh"
            >
              <RefreshCw size={16}
              className={loading ? "refresh-spin" : ""}/>
              Refresh
            </button>


            {/* COLUMNS */}

            <div className="columns-wrapper">

              <button
                className="table-action-btn"
                onClick={() =>
                  setShowColumns(!showColumns)
                }
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


                  <label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.id}
                      onChange={() =>
                        toggleColumn("id")
                      }
                    />
                    Customer ID
                  </label>


                  <label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.customer}
                      onChange={() =>
                        toggleColumn("customer")
                      }
                    />
                    Customer
                  </label>


                  <label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.mobile}
                      onChange={() =>
                        toggleColumn("mobile")
                      }
                    />
                    Mobile Number
                  </label>


                  <label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.email}
                      onChange={() =>
                        toggleColumn("email")
                      }
                    />
                    Email ID
                  </label>


                  <label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.loanType}
                      onChange={() =>
                        toggleColumn("loanType")
                      }
                    />
                    Loan Type
                  </label>


                  <label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.kycStatus}
                      onChange={() =>
                        toggleColumn("kycStatus")
                      }
                    />
                    KYC Status
                  </label>


                  <label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.status}
                      onChange={() =>
                        toggleColumn("status")
                      }
                    />
                    Status
                  </label>


                  <label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.registeredOn}
                      onChange={() =>
                        toggleColumn("registeredOn")
                      }
                    />
                    Registered On
                  </label>


                  <label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.actions}
                      onChange={() =>
                        toggleColumn("actions")
                      }
                    />
                    Actions
                  </label>

                </div>

              )}

            </div>


            {/* EXPORT */}

            <button
              className="table-action-btn"
              onClick={handleExport}
              
            >
              <Download size={16} />
              Export
            </button>

          </div>

        </div>


        {/* =========================
            TABLE
        ========================= */}

        <div className="table-wrapper">

          <table>

            <thead>

              <tr>

                {visibleColumns.id && (
                  <th>Customer ID</th>
                )}

                {visibleColumns.customer && (
                  <th>Customer</th>
                )}

                {visibleColumns.mobile && (
                  <th>Mobile Number</th>
                )}

                {visibleColumns.email && (
                  <th>Email ID</th>
                )}

                {visibleColumns.loanType && (
                  <th>Loan Type</th>
                )}

                {visibleColumns.kycStatus && (
                  <th>KYC Status</th>
                )}

                {visibleColumns.status && (
                  <th>Status</th>
                )}

                {visibleColumns.registeredOn && (
                  <th>Registered On</th>
                )}

                {visibleColumns.actions && (
                  <th>Actions</th>
                )}

              </tr>

            </thead>


            <tbody>
  {loading ? (
    <tr>
      <td
        colSpan={Object.values(visibleColumns).filter(Boolean).length}
        className="table-loading"
      >
        Loading customers...
      </td>
    </tr>
  ) : (
    filteredCustomers.map((customer) => (
      <tr key={customer.id}>

        {visibleColumns.id && (
          <td>
            <span className="customer-id">
              {customer.id}
            </span>
          </td>
        )}

        {visibleColumns.customer && (
          <td>
            <div className="customer-name">
              <div className="customer-avatar">
                {customer.name.charAt(0)}
              </div>
              <span>{customer.name}</span>
            </div>
          </td>
        )}

        {visibleColumns.mobile && (
          <td>{customer.mobile}</td>
        )}

        {visibleColumns.email && (
          <td>{customer.email}</td>
        )}

        {visibleColumns.loanType && (
          <td>
            <span className="loan-type">
              {customer.loanType}
            </span>
          </td>
        )}

        {visibleColumns.kycStatus && (
          <td>
            <span
              className={`kyc-status ${customer.kycStatus.toLowerCase()}`}
            >
              {customer.kycStatus}
            </span>
          </td>
        )}

        {visibleColumns.status && (
          <td>
            <span
              className={`customer-status ${customer.status.toLowerCase()}`}
            >
              {customer.status}
            </span>
          </td>
        )}

        {visibleColumns.registeredOn && (
          <td>{customer.registeredOn}</td>
        )}

        {visibleColumns.actions && (
          <td>
            <div className="customer-actions">

              <button title="View">
                <Eye size={17} />
              </button>

              <button title="Edit">
                <Pencil size={17} />
              </button>

              <button title="More">
                <MoreVertical size={17} />
              </button>

            </div>
          </td>
        )}

      </tr>
    ))
  )}
</tbody>

          </table>

        </div>

      </div>

    </section>
  );
};

export default CustomerList;