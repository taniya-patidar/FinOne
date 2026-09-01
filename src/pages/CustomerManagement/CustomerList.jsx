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
  Plus,
  RefreshCw,
  Columns3,
  Download,
  ChevronDown,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./CustomerList.css";

const CustomerList = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);

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
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [loanTypeFilter, setLoanTypeFilter] = useState("All Loan Types");
  const [kycFilter, setKycFilter] = useState("All KYC Status");
  const [showColumns, setShowColumns] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const customersPerPage = 5;

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

  // ======================================================
  // LOAD CUSTOMERS ONLY FROM LOCALSTORAGE (NO STATIC DATA)
  // ======================================================
  const loadCustomers = () => {
    try {
      const savedCustomers = JSON.parse(
        localStorage.getItem("customers")
      );

      if (Array.isArray(savedCustomers)) {
        setCustomers(savedCustomers);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error("Error loading customers:", error);
      setCustomers([]);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // ======================================================
  // DYNAMIC LOAN TYPES EXTRACTION FROM LOCALSTORAGE
  // ======================================================
  const dynamicLoanTypes = useMemo(() => {
    const typesSet = new Set();

    // 1. Get loan types from customers list
    customers.forEach((c) => {
      if (c.loanType && c.loanType.trim() !== "") {
        typesSet.add(c.loanType.trim());
      }
    });

    // 2. Get loan types from loanApplications in localStorage if present
    try {
      const loanApps = JSON.parse(
        localStorage.getItem("loanApplications") || "[]"
      );
      if (Array.isArray(loanApps)) {
        loanApps.forEach((app) => {
          const lType = app.loanType || app.type || app.category;
          if (lType && lType.trim() !== "") {
            typesSet.add(lType.trim());
          }
        });
      }
    } catch (e) {
      console.error("Error reading loanApplications for dynamic types:", e);
    }

    if (typesSet.size === 0) {
      return ["Home Loan", "Personal Loan", "Business Loan", "Vehicle Loan"];
    }

    return Array.from(typesSet);
  }, [customers]);

  const handleDeleteCustomer = (id) => {
    const confirmDelete = window.confirm(
      "Do you want to delete this Customer?"
    );
    if (!confirmDelete) return;

    const updatedCustomers = customers.filter(
      (customer) => String(customer.id) !== String(id)
    );

    setCustomers(updatedCustomers);
    localStorage.setItem("customers", JSON.stringify(updatedCustomers));
    window.dispatchEvent(new Event("customersUpdated"));
  };

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
    const searchValue = search.toLowerCase().trim();

    return customers.filter((customer) => {
      const customerId = String(customer.id || "").toLowerCase();
      const customerName = String(
        customer.name ||
          customer.fullName ||
          customer.personalInformation?.fullName ||
          ""
      ).toLowerCase();
      const mobile = String(
        customer.mobile || customer.personalInformation?.mobile || ""
      );
      const email = String(
        customer.email || customer.personalInformation?.email || ""
      ).toLowerCase();
      const loanType = String(customer.loanType || "");
      const kycStatus = String(customer.kycStatus || "");
      const status = String(customer.status || "");

      const matchesSearch =
        customerId.includes(searchValue) ||
        customerName.includes(searchValue) ||
        mobile.includes(searchValue) ||
        email.includes(searchValue);

      const matchesStatus =
        statusFilter === "All Status" || status === statusFilter;

      const matchesLoanType =
        loanTypeFilter === "All Loan Types" || loanType === loanTypeFilter;

      const matchesKyc =
        kycFilter === "All KYC Status" || kycStatus === kycFilter;

      return (
        matchesSearch && matchesStatus && matchesLoanType && matchesKyc
      );
    });
  }, [customers, search, statusFilter, loanTypeFilter, kycFilter]);

  // ======================================================
  // PAGINATION
  // ======================================================
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );
  const totalPages = Math.ceil(
    filteredCustomers.length / customersPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, loanTypeFilter, kycFilter]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      loadCustomers();
      setLoading(false);
    }, 500);
  };

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
  // EXPORT CSV
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

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `customer-list-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ======================================================
  // DYNAMIC COUNTS ACCORDING TO REALTIME DATA
  // ======================================================
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(
    (customer) => (customer.status || "Active").toLowerCase() === "active"
  ).length;
  const inactiveCustomers = customers.filter(
    (customer) => (customer.status || "").toLowerCase() === "inactive"
  ).length;
  const kycVerified = customers.filter(
    (customer) => (customer.kycStatus || "").toLowerCase() === "verified"
  ).length;
  const kycPending = customers.filter(
    (customer) =>
      (customer.kycStatus || "Pending").toLowerCase() === "pending"
  ).length;

  const getCustomerName = (customer) => {
    return (
      customer.name ||
      customer.fullName ||
      customer.personalInformation?.fullName ||
      "Unnamed Customer"
    );
  };

  const getCustomerMobile = (customer) => {
    return (
      customer.mobile || customer.personalInformation?.mobile || "-"
    );
  };

  const getCustomerEmail = (customer) => {
    return (
      customer.email || customer.personalInformation?.email || "-"
    );
  };

  const getKycStatus = (customer) => {
    return customer.kycStatus || "Pending";
  };

  const getCustomerStatus = (customer) => {
    return customer.status || "Active";
  };

  return (
    <section className="customer-page">
      {/* PAGE HEADER */}
      <div className="customer-page-header">
        <div>
          <h1>Customer Management</h1>
          <p>Manage and view all your customers</p>
        </div>

        <button className="add-customer-btn" onClick={handleAddCustomer}>
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="customer-summary">
        <div className="summary-card">
          <span>Total Customers</span>
          <h2>{totalCustomers}</h2>
          <p>All registered customers</p>
        </div>

        <div className="summary-card">
          <span>Active Customers</span>
          <h2>{activeCustomers}</h2>
          <p>Currently active</p>
        </div>

        <div className="summary-card">
          <span>Inactive Customers</span>
          <h2>{inactiveCustomers}</h2>
          <p>Inactive / closed</p>
        </div>

        <div className="summary-card">
          <span>KYC Verified</span>
          <h2>{kycVerified}</h2>
          <p>KYC completed</p>
        </div>

        <div className="summary-card">
          <span>KYC Pending</span>
          <h2>{kycPending}</h2>
          <p>KYC incomplete</p>
        </div>
      </div>

      {/* SEARCH + FILTERS */}
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
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <select
          value={loanTypeFilter}
          onChange={(e) => setLoanTypeFilter(e.target.value)}
        >
          <option>All Loan Types</option>
          {dynamicLoanTypes.map((type, idx) => (
            <option key={idx} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={kycFilter}
          onChange={(e) => setKycFilter(e.target.value)}
        >
          <option>All KYC Status</option>
          <option>Verified</option>
          <option>Pending</option>
        </select>
      </div>

      {/* CUSTOMER TABLE CARD */}
      <div className="customer-table-card">
        <div className="table-top">
          <div>
            <h2>Customer List</h2>
            <p>Showing {filteredCustomers.length} customers</p>
          </div>

          <div className="table-actions">
            <button
              className="table-action-btn"
              onClick={handleRefresh}
              title="Refresh"
            >
              <RefreshCw
                size={16}
                className={loading ? "refresh-spin" : ""}
              />
              Refresh
            </button>

            <div className="columns-wrapper" ref={menuRef}>
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
                    <label>
                      <input
                        type="checkbox"
                        checked={visibleColumns.id}
                        onChange={() => toggleColumn("id")}
                      />
                      Customer ID
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={visibleColumns.customer}
                        onChange={() => toggleColumn("customer")}
                      />
                      Customer
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={visibleColumns.mobile}
                        onChange={() => toggleColumn("mobile")}
                      />
                      Mobile Number
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={visibleColumns.email}
                        onChange={() => toggleColumn("email")}
                      />
                      Email ID
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={visibleColumns.loanType}
                        onChange={() => toggleColumn("loanType")}
                      />
                      Loan Type
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={visibleColumns.kycStatus}
                        onChange={() => toggleColumn("kycStatus")}
                      />
                      KYC Status
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={visibleColumns.status}
                        onChange={() => toggleColumn("status")}
                      />
                      Status
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={visibleColumns.registeredOn}
                        onChange={() => toggleColumn("registeredOn")}
                      />
                      Registered On
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={visibleColumns.actions}
                        onChange={() => toggleColumn("actions")}
                      />
                      Actions
                    </label>
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

        {/* TABLE WRAPPER */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {visibleColumns.id && <th>Customer ID</th>}
                {visibleColumns.customer && <th>Customer</th>}
                {visibleColumns.mobile && <th>Mobile Number</th>}
                {visibleColumns.email && <th>Email ID</th>}
                {visibleColumns.loanType && <th>Loan Type</th>}
                {visibleColumns.kycStatus && <th>KYC Status</th>}
                {visibleColumns.status && <th>Status</th>}
                {visibleColumns.registeredOn && <th>Registered On</th>}
                {visibleColumns.actions && <th>Actions</th>}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={
                      Object.values(visibleColumns).filter(Boolean).length
                    }
                    className="table-loading"
                  >
                    Loading customers...
                  </td>
                </tr>
              ) : currentCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      Object.values(visibleColumns).filter(Boolean).length
                    }
                    className="table-loading"
                  >
                    No customers found.
                  </td>
                </tr>
              ) : (
                currentCustomers.map((customer) => {
                  const customerName = getCustomerName(customer);
                  const customerMobile = getCustomerMobile(customer);
                  const customerEmail = getCustomerEmail(customer);
                  const kycStatus = getKycStatus(customer);
                  const customerStatus = getCustomerStatus(customer);

                  return (
                    <tr key={customer.id}>
                      {visibleColumns.id && (
                        <td>
                          <span className="customer-id">
                            {customer.id || "-"}
                          </span>
                        </td>
                      )}

                      {visibleColumns.customer && (
                        <td>
                          <div className="customer-name">
                            <div className="customer-avatar">
                              {customerName.charAt(0).toUpperCase()}
                            </div>
                            <span>{customerName}</span>
                          </div>
                        </td>
                      )}

                      {visibleColumns.mobile && <td>{customerMobile}</td>}

                      {visibleColumns.email && <td>{customerEmail}</td>}

                      {visibleColumns.loanType && (
                        <td>
                          <span className="loan-type">
                            {customer.loanType || "-"}
                          </span>
                        </td>
                      )}

                      {visibleColumns.kycStatus && (
                        <td>
                          <span
                            className={`kyc-status ${kycStatus
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {kycStatus}
                          </span>
                        </td>
                      )}

                      {visibleColumns.status && (
                        <td>
                          <span
                            className={`customer-status ${customerStatus
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {customerStatus}
                          </span>
                        </td>
                      )}

                      {visibleColumns.registeredOn && (
                        <td>{customer.registeredOn || "-"}</td>
                      )}

                      {visibleColumns.actions && (
                        <td>
                          <div className="customer-actions">
                            <button
                              title="View"
                              onClick={() => handleViewCustomer(customer.id)}
                            >
                              <Eye size={17} />
                            </button>

                            <button
                              title="Edit"
                              onClick={() => handleEditCustomer(customer.id)}
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              title="Delete"
                              onClick={() => handleDeleteCustomer(customer.id)}
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 0 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
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

export default CustomerList;