import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Printer,
  FileText,
  User,
  MapPin,
  Briefcase,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  ShieldCheck,
  Phone,
  Mail,
  Calendar,
  Building,
  IndianRupee,
} from "lucide-react";
import "./LoanApplicationView.css";

const LoanApplicationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    // 1. First priority: Check if data was passed directly via Router Navigation state
    const stateData = location.state?.customer || location.state?.application;

    if (stateData) {
      setApplication(normalizeData(stateData));
      return;
    }

    // 2. Fetch from LocalStorage (Checking both loanApplications & customers arrays)
    const savedLoans =
      JSON.parse(localStorage.getItem("loanApplications")) || [];
    const savedCustomers =
      JSON.parse(localStorage.getItem("customers")) || [];

    // Search in loan applications first, then fallback to customers list
    const foundData =
      savedLoans.find(
        (item) =>
          String(item.id) === String(id) ||
          String(item.applicationId) === String(id) ||
          String(item.customerId) === String(id)
      ) ||
      savedCustomers.find(
        (item) =>
          String(item.id) === String(id) ||
          String(item.customerId) === String(id)
      );

    if (foundData) {
      setApplication(normalizeData(foundData));
    }
  }, [id, location.state]);

  // Helper function to handle different key names from CustomerDetail or Forms
  const normalizeData = (data) => {
    if (!data) return null;

    // Address Object vs Flat String Handler
    const rawAddress = data.address || data.customerAddress || {};
    const street =
      typeof rawAddress === "object"
        ? rawAddress.street || rawAddress.addressLine1 || rawAddress.line1
        : data.address || data.addressLine1 || data.street || "-";

    const city =
      typeof rawAddress === "object"
        ? rawAddress.city
        : data.city || data.cityName || "-";

    const state =
      typeof rawAddress === "object"
        ? rawAddress.state
        : data.state || "-";

    const pinCode =
      typeof rawAddress === "object"
        ? rawAddress.pincode || rawAddress.pin || rawAddress.zip
        : data.pinCode || data.pincode || data.zipCode || data.zip || "-";

    return {
      ...data,
      appId: data.applicationId || data.id || data.customerId || id,
      applicantName:
        data.applicantName ||
        data.customerName ||
        data.name ||
        data.fullName ||
        "N/A",
      mobile: data.mobile || data.phone || data.contactNumber || "-",
      email: data.email || data.emailId || "-",
      panNumber:
        data.panNumber || data.pan || data.panCard || data.panNo || "-",
      address: street,
      city: city,
      state: state,
      pinCode: pinCode,
      occupation:
        data.occupation ||
        data.employmentType ||
        data.jobType ||
        data.profession ||
        "-",
      companyName:
        data.companyName ||
        data.company ||
        data.employerName ||
        data.organization ||
        "-",
      monthlyIncome:
        data.monthlyIncome || data.income || data.salary || data.netIncome || 0,
      loanType: data.loanType || data.type || "Personal Loan",
      loanAmount: data.loanAmount || data.amount || data.requestedAmount || 0,
      tenure: data.tenure || data.duration || data.months || "-",
      interestRate: data.interestRate || data.rate || "-",
      status: data.status || "Pending",
      appliedDate:
        data.appliedDate || data.createdDate || data.date || "N/A",
      documents: data.documents || data.docs || {},
    };
  };

  // Page Print handler
  const handlePrint = () => {
    window.print();
  };

  // Helper function: Status Badges render karne ke liye
  const getStatusPill = (status = "Pending") => {
    const statusLower = String(status).toLowerCase();
    switch (statusLower) {
      case "approved":
        return (
          <span className="status-pill status-approved">
            <CheckCircle size={15} /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="status-pill status-rejected">
            <XCircle size={15} /> Rejected
          </span>
        );
      default:
        return (
          <span className="status-pill status-pending">
            <Clock size={15} /> Pending Review
          </span>
        );
    }
  };

  // Application Not Found State
  if (!application) {
    return (
      <div className="view-not-found-wrapper">
        <div className="not-found-card">
          <XCircle size={48} className="icon-error" />
          <h2>Application Not Found</h2>
          <p>
            The details for ID <strong>#{id}</strong> could not be located in records.
          </p>
          <button onClick={() => navigate(-1)} className="btn-secondary">
            <ArrowLeft size={16} /> Return Back
          </button>
        </div>
      </div>
    );
  }

  // Avatar Initials
  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="loan-view-page-wrapper">
      {/* 1. Header Area */}
      <div className="profile-header-card">
        <div className="applicant-profile-info">
          <div className="avatar-circle">
            {getInitials(application.applicantName)}
          </div>
          <div className="profile-details-text">
            <div className="badge-and-id">
              <span className="app-id-badge">#{application.appId}</span>
              {getStatusPill(application.status)}
            </div>
            <h1 className="applicant-name">{application.applicantName}</h1>
            <p className="submission-meta">
              <Calendar size={14} /> Applied on: {application.appliedDate}
            </p>
          </div>
        </div>

        <div className="header-action-buttons">
          <button className="btn-ghost" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Back
          </button>
          <button className="btn-primary" onClick={handlePrint}>
            <Printer size={18} /> Print Details
          </button>
        </div>
      </div>

      {/* 2. Main Dashboard Grid Layout */}
      <div className="view-dashboard-grid">
        {/* LEFT COLUMN: Core Details */}
        <div className="main-content-column">
          {/* Section: Loan Info */}
          <div className="detail-card">
            <div className="card-header">
              <h3>
                <CreditCard size={18} /> Loan Details
              </h3>
            </div>
            <div className="card-grid-body">
              <div className="grid-item">
                <span className="field-label">Loan Type</span>
                <span className="field-valueHighlight">
                  {application.loanType}
                </span>
              </div>
              <div className="grid-item">
                <span className="field-label">Requested Amount</span>
                <span className="field-valueHighlight amount">
                  ₹{Number(application.loanAmount).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="grid-item">
                <span className="field-label">Tenure</span>
                <span className="field-value">
                  {application.tenure !== "-"
                    ? `${application.tenure} Months`
                    : "-"}
                </span>
              </div>
              <div className="grid-item">
                <span className="field-label">Interest Rate</span>
                <span className="field-value">
                  {application.interestRate !== "-"
                    ? `${application.interestRate}%`
                    : "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Personal Info */}
          <div className="detail-card">
            <div className="card-header">
              <h3>
                <User size={18} /> Personal Information
              </h3>
            </div>
            <div className="card-grid-body">
              <div className="grid-item">
                <span className="field-label">Full Name</span>
                <span className="field-value">{application.applicantName}</span>
              </div>
              <div className="grid-item">
                <span className="field-label">Mobile Number</span>
                <span className="field-value icon-flex">
                  <Phone size={14} /> {application.mobile}
                </span>
              </div>
              <div className="grid-item">
                <span className="field-label">Email Address</span>
                <span className="field-value icon-flex">
                  <Mail size={14} /> {application.email}
                </span>
              </div>
              <div className="grid-item">
                <span className="field-label">PAN Number</span>
                <span className="field-value uppercase">
                  {application.panNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Address Details */}
          <div className="detail-card">
            <div className="card-header">
              <h3>
                <MapPin size={18} /> Address Information
              </h3>
            </div>
            <div className="card-grid-body">
              <div className="grid-item full-width">
                <span className="field-label">Street Address</span>
                <span className="field-value">{application.address}</span>
              </div>
              <div className="grid-item">
                <span className="field-label">City</span>
                <span className="field-value">{application.city}</span>
              </div>
              <div className="grid-item">
                <span className="field-label">State</span>
                <span className="field-value">{application.state}</span>
              </div>
              <div className="grid-item">
                <span className="field-label">Pincode</span>
                <span className="field-value">{application.pinCode}</span>
              </div>
            </div>
          </div>

          {/* Section: Employment Details */}
          <div className="detail-card">
            <div className="card-header">
              <h3>
                <Briefcase size={18} /> Employment & Financials
              </h3>
            </div>
            <div className="card-grid-body">
              <div className="grid-item">
                <span className="field-label">Occupation Type</span>
                <span className="field-value">{application.occupation}</span>
              </div>
              <div className="grid-item">
                <span className="field-label">Company / Employer</span>
                <span className="field-value icon-flex">
                  <Building size={14} /> {application.companyName}
                </span>
              </div>
              <div className="grid-item">
                <span className="field-label">Monthly Net Income</span>
                <span className="field-value">
                  {Number(application.monthlyIncome) > 0
                    ? `₹${Number(application.monthlyIncome).toLocaleString("en-IN")}`
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Documents & Verification */}
        <div className="side-content-column">
          <div className="detail-card">
            <div className="card-header">
              <h3>
                <FileText size={18} /> Attached Documents
              </h3>
            </div>
            <div className="documents-list-wrapper">
              {Object.keys(application.documents).length > 0 ? (
                Object.entries(application.documents).map(
                  ([docKey, docValue]) => (
                    <div key={docKey} className="document-row-item">
                      <div className="doc-icon-box">
                        <FileText size={18} />
                      </div>
                      <div className="doc-details-text">
                        <span className="doc-type-title">
                          {docKey.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className="doc-file-name">
                          {typeof docValue === "object"
                            ? docValue.name || "File attached"
                            : String(docValue)}
                        </span>
                      </div>
                      <button
                        className="btn-doc-download"
                        title="Download Document"
                      >
                        <Download size={15} />
                      </button>
                    </div>
                  )
                )
              ) : (
                <div className="empty-docs-state">
                  <FileText size={32} />
                  <p>No verification documents attached.</p>
                </div>
              )}
            </div>
          </div>

          <div className="detail-card verification-summary-card">
            <div className="card-header">
              <h3>
                <ShieldCheck size={18} /> Verification Status
              </h3>
            </div>
            <div className="verification-steps-list">
              <div className="verif-step done">
                <CheckCircle size={16} />
                <span>Identity Verification (PAN)</span>
              </div>
              <div className="verif-step done">
                <CheckCircle size={16} />
                <span>Address Proof Verification</span>
              </div>
              <div className="verif-step pending">
                <Clock size={16} />
                <span>Income Verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationView;
