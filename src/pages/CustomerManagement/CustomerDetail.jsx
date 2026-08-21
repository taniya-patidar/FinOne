import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  Briefcase,
  FileText,
  CheckCircle,
  Pencil,
} from "lucide-react";

import "./CustomerDetail.css";

const CustomerDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);

  // ======================================================
  // LOAD CUSTOMER
  // ======================================================

  useEffect(() => {
    const savedCustomers =
      JSON.parse(localStorage.getItem("customers")) || [];

    const foundCustomer = savedCustomers.find(
      (item) => String(item.id) === String(id)
    );

    setCustomer(foundCustomer);
  }, [id]);

  // ======================================================
  // CUSTOMER NOT FOUND
  // ======================================================

  if (!customer) {
    return (
      <section className="customer-detail-page">
        <div className="detail-not-found">
          <h2>Customer Not Found</h2>

          <p>
            The customer you are looking for does not exist.
          </p>

          <button
            className="back-button"
            onClick={() => navigate("/customers")}
          >
            <ArrowLeft size={17} />
            Back to Customers
          </button>
        </div>
      </section>
    );
  }

  // ======================================================
  // SUPPORT BOTH DATA FORMATS
  // ======================================================

  const personal =
    customer.personalInformation || {};

  const address =
    customer.addressInformation || {};

  const identity =
    customer.identityVerification || {};

  const employment =
    customer.employmentDetails || {};

  const documents =
    customer.documents || {};

  // ======================================================
  // PERSONAL DATA
  // ======================================================

  const fullName =
    personal.fullName ||
    customer.fullName ||
    customer.name ||
    "-";

  const dob =
    personal.dob ||
    customer.dob ||
    "-";

  const gender =
    personal.gender ||
    customer.gender ||
    "-";

  const mobile =
    personal.mobile ||
    customer.mobile ||
    "-";

  const email =
    personal.email ||
    customer.email ||
    "-";

  // ======================================================
  // ADDRESS DATA
  // ======================================================

  const address1 =
    address.address1 ||
    customer.address1 ||
    "-";

  const address2 =
    address.address2 ||
    customer.address2 ||
    "-";

  const city =
    address.city ||
    customer.city ||
    "-";

  const state =
    address.state ||
    customer.state ||
    "-";

  const pinCode =
    address.pinCode ||
    customer.pinCode ||
    "-";

  // ======================================================
  // IDENTITY DATA
  // ======================================================

  const aadhaar =
    identity.aadhaar ||
    customer.aadhaar ||
    "-";

  const pan =
    identity.pan ||
    customer.pan ||
    "-";

  // ======================================================
  // EMPLOYMENT DATA
  // ======================================================

  const occupation =
    employment.occupation ||
    customer.occupation ||
    "-";

  const companyName =
    employment.companyName ||
    customer.companyName ||
    "-";

  const monthlyIncome =
    employment.monthlyIncome ||
    customer.monthlyIncome ||
    "";

  // ======================================================
  // RETURN
  // ======================================================

  return (
    <section className="customer-detail-page">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="detail-header">

        <div>

          <button
            className="back-button"
            onClick={() =>
              navigate("/customers")
            }
          >
            <ArrowLeft size={17} />
            Back to Customers
          </button>

          <h1>
            Customer Details
          </h1>

          <p>
            View complete information about this customer.
          </p>

        </div>

        <button
          className="edit-button"
          onClick={() =>
            navigate(
              `/customers/${customer.id}/edit`
            )
          }
        >
          <Pencil size={17} />
          Edit Customer
        </button>

      </div>

      {/* ==================================================
          CUSTOMER PROFILE
      ================================================== */}

      <div className="customer-profile-card">

        <div className="profile-avatar">

          {fullName !== "-"
            ? fullName
                .charAt(0)
                .toUpperCase()
            : "C"}

        </div>

        <div className="profile-info">

          <h2>
            {fullName}
          </h2>

          <p>
            Customer ID:{" "}
            <strong>
              {customer.id}
            </strong>
          </p>

          <p>
            Mobile:{" "}
            <strong>
              {mobile}
            </strong>
          </p>

        </div>

        <div className="profile-status">

          <span
            className={`customer-status ${
              customer.status
                ?.toLowerCase() || ""
            }`}
          >
            {customer.status || "Active"}
          </span>

          <span
            className={`kyc-status ${
              customer.kycStatus
                ?.toLowerCase() || ""
            }`}
          >
            KYC:{" "}
            {customer.kycStatus || "Pending"}
          </span>

        </div>

      </div>

      {/* ==================================================
          PERSONAL INFORMATION
      ================================================== */}

      <div className="detail-card">

        <div className="detail-heading">

          <div className="detail-icon">
            <User size={20} />
          </div>

          <div>
            <h2>
              Personal Information
            </h2>

            <p>
              Basic customer information
            </p>
          </div>

        </div>

        <div className="detail-grid">

          <div className="detail-item">
            <span>
              Full Name
            </span>

            <strong>
              {fullName}
            </strong>
          </div>

          <div className="detail-item">
            <span>
              Date of Birth
            </span>

            <strong>
              {dob}
            </strong>
          </div>

          <div className="detail-item">
            <span>
              Gender
            </span>

            <strong>
              {gender}
            </strong>
          </div>

          <div className="detail-item">
            <span>
              Mobile Number
            </span>

            <strong>
              {mobile}
            </strong>
          </div>

          <div className="detail-item">
            <span>
              Email Address
            </span>

            <strong>
              {email}
            </strong>
          </div>

          <div className="detail-item">
            <span>
              Registered On
            </span>

            <strong>
              {customer.registeredOn || "-"}
            </strong>
          </div>

        </div>

      </div>

      {/* ==================================================
          ADDRESS INFORMATION
      ================================================== */}

      <div className="detail-card">

        <div className="detail-heading">

          <div className="detail-icon">
            <MapPin size={20} />
          </div>

          <div>

            <h2>
              Address Information
            </h2>

            <p>
              Customer residential address
            </p>

          </div>

        </div>

        <div className="detail-grid">

          <div className="detail-item detail-full">

            <span>
              Address Line 1
            </span>

            <strong>
              {address1}
            </strong>

          </div>

          <div className="detail-item detail-full">

            <span>
              Address Line 2
            </span>

            <strong>
              {address2}
            </strong>

          </div>

          <div className="detail-item">

            <span>
              City
            </span>

            <strong>
              {city}
            </strong>

          </div>

          <div className="detail-item">

            <span>
              State
            </span>

            <strong>
              {state}
            </strong>

          </div>

          <div className="detail-item">

            <span>
              PIN Code
            </span>

            <strong>
              {pinCode}
            </strong>

          </div>

        </div>

      </div>

      {/* ==================================================
          IDENTITY VERIFICATION
      ================================================== */}

      <div className="detail-card">

        <div className="detail-heading">

          <div className="detail-icon">
            <CreditCard size={20} />
          </div>

          <div>

            <h2>
              Identity Verification
            </h2>

            <p>
              Government identity information
            </p>

          </div>

        </div>

        <div className="detail-grid">

          <div className="detail-item">

            <span>
              Aadhaar Number
            </span>

            <strong>
              {aadhaar}
            </strong>

          </div>

          <div className="detail-item">

            <span>
              PAN Number
            </span>

            <strong>
              {pan}
            </strong>

          </div>

        </div>

      </div>

      {/* ==================================================
          EMPLOYMENT DETAILS
      ================================================== */}

      <div className="detail-card">

        <div className="detail-heading">

          <div className="detail-icon">
            <Briefcase size={20} />
          </div>

          <div>

            <h2>
              Employment Details
            </h2>

            <p>
              Employment and income information
            </p>

          </div>

        </div>

        <div className="detail-grid">

          <div className="detail-item">

            <span>
              Occupation
            </span>

            <strong>
              {occupation}
            </strong>

          </div>

          <div className="detail-item">

            <span>
              Company Name
            </span>

            <strong>
              {companyName}
            </strong>

          </div>

          <div className="detail-item">

            <span>
              Monthly Income
            </span>

            <strong>

              {monthlyIncome
                ? `₹ ${Number(
                    monthlyIncome
                  ).toLocaleString("en-IN")}`
                : "-"}

            </strong>

          </div>

        </div>

      </div>

      {/* ==================================================
          DOCUMENTS
      ================================================== */}

      <div className="detail-card">

        <div className="detail-heading">

          <div className="detail-icon">
            <FileText size={20} />
          </div>

          <div>

            <h2>
              Documents
            </h2>

            <p>
              Uploaded customer documents
            </p>

          </div>

        </div>

        <div className="document-list">

          {/* AADHAAR */}

          <div className="document-item">

            <div>

              <strong>
                Aadhaar Card
              </strong>

              <span>
                {documents.aadhaarCard?.name ||
                  "Not uploaded"}
              </span>

            </div>

            {documents.aadhaarCard && (
              <CheckCircle size={20} />
            )}

          </div>

          {/* PAN */}

          <div className="document-item">

            <div>

              <strong>
                PAN Card
              </strong>

              <span>
                {documents.panCard?.name ||
                  "Not uploaded"}
              </span>

            </div>

            {documents.panCard && (
              <CheckCircle size={20} />
            )}

          </div>

          {/* SALARY SLIP */}

          <div className="document-item">

            <div>

              <strong>
                Salary Slip
              </strong>

              <span>
                {documents.salarySlip?.name ||
                  "Not uploaded"}
              </span>

            </div>

            {documents.salarySlip && (
              <CheckCircle size={20} />
            )}

          </div>

          {/* BANK STATEMENT */}

          <div className="document-item">

            <div>

              <strong>
                Bank Statement
              </strong>

              <span>
                {documents.bankStatement?.name ||
                  "Not uploaded"}
              </span>

            </div>

            {documents.bankStatement && (
              <CheckCircle size={20} />
            )}

          </div>

        </div>

      </div>

      {/* ==================================================
          BOTTOM BUTTONS
      ================================================== */}

      <div className="detail-bottom">

        <button
          className="back-button"
          onClick={() =>
            navigate("/customers")
          }
        >
          <ArrowLeft size={17} />
          Back to Customers
        </button>

        <button
          className="edit-button"
          onClick={() =>
            navigate(
              `/customers/${customer.id}/edit`
            )
          }
        >
          <Pencil size={17} />
          Edit Customer
        </button>

      </div>

    </section>
  );
};

export default CustomerDetail;