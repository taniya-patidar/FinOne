import React, { useState } from "react";
import { Search, Eye, Pencil, MoreVertical, Plus } from "lucide-react";
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
  const [search, setSearch] = useState("");

  return (
    <section className="customer-page">

      {/* Page Header */}
      <div className="customer-page-header">
        <div>
          <h1>Customer Management</h1>
          <p>Manage and view all your customers</p>
        </div>

        <button className="add-customer-btn">
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      {/* Summary Cards */}
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

      {/* Filters */}
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

        <select>
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <select>
          <option>All Loan Types</option>
          <option>Home Loan</option>
          <option>Personal Loan</option>
          <option>Business Loan</option>
          <option>Vehicle Loan</option>
        </select>

        <select>
          <option>All KYC Status</option>
          <option>Verified</option>
          <option>Pending</option>
        </select>

      </div>

      {/* Customer Table */}
      <div className="customer-table-card">

        <div className="table-top">
          <div>
            <h2>Customer List</h2>
            <p>All registered customers</p>
          </div>

          <button className="export-btn">
            Export
          </button>
        </div>

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Customer</th>
                <th>Mobile Number</th>
                <th>Email ID</th>
                <th>Loan Type</th>
                <th>KYC Status</th>
                <th>Status</th>
                <th>Registered On</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {customers.map((customer) => (

                <tr key={customer.id}>

                  <td>
                    <span className="customer-id">
                      {customer.id}
                    </span>
                  </td>

                  <td>
                    <div className="customer-name">
                      <div className="customer-avatar">
                        {customer.name.charAt(0)}
                      </div>

                      <span>{customer.name}</span>
                    </div>
                  </td>

                  <td>{customer.mobile}</td>

                  <td>{customer.email}</td>

                  <td>
                    <span className="loan-type">
                      {customer.loanType}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`kyc-status ${customer.kycStatus.toLowerCase()}`}
                    >
                      {customer.kycStatus}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`customer-status ${customer.status.toLowerCase()}`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  <td>{customer.registeredOn}</td>

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

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </section>
  );
};

export default CustomerList;