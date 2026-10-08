import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, FileText, CheckCircle2 } from "lucide-react";
import "./NewLoanApplication.css";

const NewLoanApplication = () => {
  const navigate = useNavigate();
  const [customersList, setCustomersList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isCustomerSelected, setIsCustomerSelected] = useState(false);

  // Document Upload Tracker
  const [documents, setDocuments] = useState({
    identityProof: null,
    addressProof: null,
    incomeProof: null,
    bankStatement: null,
  });

  // Form Main State
  const [formData, setFormData] = useState({
    customerId: "",
    name: "",
    mobile: "",
    email: "",
    dob: "",
    pan: "",
    gender: "",
    maritalStatus: "",
    loanType: "Home Loan",
    loanPurpose: "",
    loanAmount: "",
    interestRate: "",
    loanTenure: "",
    emi: "0.00",
    employmentType: "",
    orgName: "",
    monthlyIncome: "",
    addressLine1: "",
    city: "",
    state: "",
    pinCode: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    guarantorName: "",
    guarantorMobile: "",
    guarantorRelation: "",
  });

  useEffect(() => {
    const savedCustomers = JSON.parse(localStorage.getItem("customers")) || [
      {
        id: "CUST-10001",
        name: "Rahul Sharma",
        mobile: "9876543210",
        email: "rahul.s@example.com",
        dob: "1992-05-14",
        pan: "ABCDE1234F",
        gender: "Male",
        maritalStatus: "Married",
        addressLine1: "123 Main Street",
        city: "Bhopal",
        state: "Madhya Pradesh",
        pinCode: "462001",
      },
      {
        id: "CUST-10002",
        name: "Neha Verma",
        mobile: "9876543211",
        email: "neha.v@example.com",
        dob: "1995-08-22",
        pan: "XYZPS9876K",
        gender: "Female",
        maritalStatus: "Single",
        addressLine1: "45 Vijay Nagar",
        city: "Indore",
        state: "Madhya Pradesh",
        pinCode: "452010",
      },
    ];
    setCustomersList(savedCustomers);
  }, []);

  // Customer Select Handler & Auto-Lock Logic
  const handleCustomerSelect = (e) => {
    const selectedName = e.target.value;

    if (!selectedName) {
      setIsCustomerSelected(false);
      setFormData((prev) => ({
        ...prev,
        customerId: "",
        name: "",
        mobile: "",
        email: "",
        dob: "",
        pan: "",
        gender: "",
        maritalStatus: "",
        addressLine1: "",
        city: "",
        state: "",
        pinCode: "",
      }));
      return;
    }

    const selectedCust = customersList.find((c) => c.name === selectedName);

    if (selectedCust) {
      setIsCustomerSelected(true);
      setFormData((prev) => ({
        ...prev,
        customerId: selectedCust.id || "",
        name: selectedCust.name || "",
        mobile: selectedCust.mobile || "",
        email: selectedCust.email || "",
        dob: selectedCust.dob || "",
        pan: selectedCust.pan || "",
        gender: selectedCust.gender || "",
        maritalStatus: selectedCust.maritalStatus || "",
        addressLine1: selectedCust.addressLine1 || "",
        city: selectedCust.city || "",
        state: selectedCust.state || "",
        pinCode: selectedCust.pinCode || "",
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileUpload = (docKey, file) => {
    if (file) {
      setDocuments((prev) => ({ ...prev, [docKey]: file.name }));
      if (errors[docKey]) {
        setErrors((prev) => ({ ...prev, [docKey]: "" }));
      }
    }
  };

  // NewLoanApplications.jsx ke andar:
const handleStatusUpdate = (applicationId, newStatus) => {
  const existingLoans = JSON.parse(localStorage.getItem("loanApplications")) || [];

  const todayDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const updatedLoans = existingLoans.map((loan) => {
    if (loan.id === applicationId) {
      return {
        ...loan,
        status: newStatus,
        updatedOn: todayDate,     // Action lene ki date update ho jayegi
        actionDate: todayDate,
        approvalDate: newStatus === "Approved" ? todayDate : loan.approvalDate,
        rejectionDate: newStatus === "Rejected" ? todayDate : loan.rejectionDate,
      };
    }
    return loan;
  });

  localStorage.setItem("loanApplications", JSON.stringify(updatedLoans));
  // State update karke table/list re-render kar dein
};

  // Live EMI Calculation Logic
  useEffect(() => {
    const P = parseFloat(formData.loanAmount);
    const annualRate = parseFloat(formData.interestRate);
    const N = parseFloat(formData.loanTenure);

    if (P > 0 && annualRate > 0 && N > 0) {
      const R = annualRate / 12 / 100;
      const emiCalc = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
      setFormData((prev) => ({ ...prev, emi: emiCalc.toFixed(2) }));
    } else {
      setFormData((prev) => ({ ...prev, emi: "0.00" }));
    }
  }, [formData.loanAmount, formData.interestRate, formData.loanTenure]);

  const totalPayable = (
    parseFloat(formData.emi || 0) * parseFloat(formData.loanTenure || 0)
  ).toFixed(2);

  // Deep Comprehensive Validation Logic
  const validateForm = () => {
    const newErrors = {};

    // Applicant Validations
    if (!formData.name) newErrors.name = "Customer is required";
    if (!formData.mobile || !/^[6-9]\d{9}$/.test(formData.mobile))
      newErrors.mobile = "Enter valid 10-digit mobile number";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.pan || !/[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(formData.pan.toUpperCase()))
      newErrors.pan = "Valid PAN required (e.g. ABCDE1234F)";
    if (!formData.dob) newErrors.dob = "DOB is required";
    if (!formData.gender) newErrors.gender = "Gender is required";

    // Loan Validations
    if (!formData.loanPurpose) newErrors.loanPurpose = "Purpose required";
    if (!formData.loanAmount || formData.loanAmount <= 0)
      newErrors.loanAmount = "Enter a valid amount";
    if (!formData.interestRate || formData.interestRate <= 0)
      newErrors.interestRate = "Enter valid rate";
    if (!formData.loanTenure || formData.loanTenure <= 0)
      newErrors.loanTenure = "Tenure required";

    // Bank Details Validations
    if (!formData.bankName) newErrors.bankName = "Bank name required";
    if (!formData.accountNumber || formData.accountNumber.length < 9)
      newErrors.accountNumber = "Valid account number required";
    if (!formData.ifscCode || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase()))
      newErrors.ifscCode = "Valid IFSC required (e.g. HDFC0001234)";

    // Mandatory Document Checks
    if (!documents.identityProof) newErrors.identityProof = "Identity proof required";
    if (!documents.incomeProof) newErrors.incomeProof = "Income proof required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e, status = "Pending") => {
    if (e) e.preventDefault();
    if (status === "Pending" && !validateForm()) return;

    const existingLoans = JSON.parse(localStorage.getItem("loanApplications")) || [];
    const newApplication = {
      ...formData,
      documents,
      id: `LA-${Math.floor(10000 + Math.random() * 90000)}`,
      status,
      appliedOn: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      loanAmount: `₹ ${Number(formData.loanAmount || 0).toLocaleString("en-IN")}`,
    };

    localStorage.setItem(
      "loanApplications",
      JSON.stringify([newApplication, ...existingLoans])
    );
    window.dispatchEvent(new Event("loansUpdated"));

    navigate("/loanApplication");
  };

  return (
    <div className="new-loan-page">
      {/* Top Navigation Bar */}
      <div className="form-header">
        <div className="header-title">
          <button className="back-btn" onClick={() => navigate("/loanApplication")}>
            <ArrowLeft size={16} /> Back to List
          </button>
          <h1>New Loan Application</h1>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="draft-btn"
            onClick={() => handleSubmit(null, "Draft")}
          >
            <FileText size={15} /> Save Draft
          </button>
          <button
            type="button"
            className="submit-app-btn"
            onClick={(e) => handleSubmit(e, "Pending")}
          >
            <Save size={15} /> Save & Submit Application
          </button>
        </div>
      </div>

      <form className="main-form-layout" onSubmit={(e) => handleSubmit(e, "Pending")}>
        {/* SECTION 1: Applicant Information (FULL WIDTH) */}
        <div className="form-section full-width">
          <h3>Applicant Information</h3>
          <div className="grid-4">
            <div className="input-field">
              <label>Select Customer *</label>
              <select value={formData.name} onChange={handleCustomerSelect}>
                <option value="">Select Existing Customer</option>
                {customersList.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.id})
                  </option>
                ))}
              </select>
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="input-field">
              <label>Mobile Number *</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                disabled={isCustomerSelected}
                placeholder="10-Digit Mobile"
              />
              {errors.mobile && <span className="error-text">{errors.mobile}</span>}
            </div>

            <div className="input-field">
              <label>Email ID *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isCustomerSelected}
                placeholder="Email Address"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="input-field">
              <label>PAN Number *</label>
              <input
                type="text"
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                // disabled={isCustomerSelected}
                placeholder="PAN Number"
              />
              {errors.pan && <span className="error-text">{errors.pan}</span>}
            </div>

            <div className="input-field">
              <label>Date of Birth *</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                // disabled={isCustomerSelected}
              />
              {errors.dob && <span className="error-text">{errors.dob}</span>}
            </div>

            <div className="input-field">
              <label>Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                // disabled={isCustomerSelected}
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              {errors.gender && <span className="error-text">{errors.gender}</span>}
            </div>

            <div className="input-field">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                // disabled={isCustomerSelected}
                placeholder="City"
              />
            </div>

            <div className="input-field">
              <label>PIN Code</label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                // disabled={isCustomerSelected}
                placeholder="PIN Code"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Loan Details (FULL WIDTH) */}
        <div className="form-section full-width">
          <h3>Loan Details</h3>
          <div className="grid-4">
            <div className="input-field">
              <label>Loan Type *</label>
              <select name="loanType" value={formData.loanType} onChange={handleChange}>
                <option>Home Loan</option>
                <option>Personal Loan</option>
                <option>Business Loan</option>
                <option>Vehicle Loan</option>
              </select>
            </div>

            <div className="input-field">
              <label>Loan Purpose *</label>
              <select name="loanPurpose" value={formData.loanPurpose} onChange={handleChange}>
                <option value="">Select Purpose</option>
                <option>Purchase</option>
                <option>Refinance</option>
                <option>Expansion</option>
              </select>
              {errors.loanPurpose && <span className="error-text">{errors.loanPurpose}</span>}
            </div>

            <div className="input-field">
              <label>Loan Amount (₹) *</label>
              <input
                type="number"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleChange}
                placeholder="Amount in ₹"
              />
              {errors.loanAmount && <span className="error-text">{errors.loanAmount}</span>}
            </div>

            <div className="input-field">
              <label>Interest Rate (%) *</label>
              <input
                type="number"
                step="0.01"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleChange}
                placeholder="Annual Rate %"
              />
              {errors.interestRate && <span className="error-text">{errors.interestRate}</span>}
            </div>

            <div className="input-field">
              <label>Tenure (Months) *</label>
              <input
                type="number"
                name="loanTenure"
                value={formData.loanTenure}
                onChange={handleChange}
                placeholder="Months"
              />
              {errors.loanTenure && <span className="error-text">{errors.loanTenure}</span>}
            </div>

            <div className="input-field">
              <label>Calculated Monthly EMI</label>
              <input
                type="text"
                value={`₹ ${formData.emi}`}
                readOnly
                className="read-only-input font-bold"
              />
            </div>
          </div>
        </div>

        {/* ROW 1: SPLIT 50-50 (Loan Summary | Disbursal Bank Details) */}
        <div className="split-row">
          {/* Half Width: Loan Summary Card */}
          <div className="form-section half-width summary-widget">
            <h3>Loan Calculation Summary</h3>
            <div className="summary-compact-grid">
              <div className="summary-item">
                <span>Selected Type</span>
                <strong>{formData.loanType}</strong>
              </div>
              <div className="summary-item">
                <span>Requested Amount</span>
                <strong>₹ {Number(formData.loanAmount || 0).toLocaleString("en-IN")}</strong>
              </div>
              <div className="summary-item">
                <span>Interest Rate</span>
                <strong>{formData.interestRate || "0.00"}%</strong>
              </div>
              <div className="summary-item">
                <span>Tenure Period</span>
                <strong>{formData.loanTenure || 0} Months</strong>
              </div>
              <div className="summary-item highlight-box">
                <span>Monthly EMI</span>
                <strong className="primary-text">₹ {formData.emi}</strong>
              </div>
              <div className="summary-item highlight-box">
                <span>Total Payable Amount</span>
                <strong>₹ {Number(totalPayable || 0).toLocaleString("en-IN")}</strong>
              </div>
            </div>
          </div>

          {/* Half Width: Disbursal Bank Details */}
          <div className="form-section half-width">
            <h3>Disbursal Bank Details</h3>
            <div className="grid-2">
              <div className="input-field">
                <label>Bank Name *</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Bank Name"
                />
                {errors.bankName && <span className="error-text">{errors.bankName}</span>}
              </div>

              <div className="input-field">
                <label>Account Number *</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="Account Number"
                />
                {errors.accountNumber && <span className="error-text">{errors.accountNumber}</span>}
              </div>

              <div className="input-field full-span">
                <label>IFSC Code *</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  placeholder="e.g. HDFC0001234"
                />
                {errors.ifscCode && <span className="error-text">{errors.ifscCode}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: SPLIT 50-50 (Guarantor Details | Required Documents) */}
        <div className="split-row">
          {/* Half Width: Guarantor / Co-Applicant Details */}
          <div className="form-section half-width">
            <h3>Guarantor / Co-Applicant Details (Optional)</h3>
            <div className="grid-2">
              <div className="input-field full-span">
                <label>Guarantor Full Name</label>
                <input
                  type="text"
                  name="guarantorName"
                  value={formData.guarantorName}
                  onChange={handleChange}
                  placeholder="Full Name"
                />
              </div>

              <div className="input-field">
                <label>Mobile Number</label>
                <input
                  type="text"
                  name="guarantorMobile"
                  value={formData.guarantorMobile}
                  onChange={handleChange}
                  placeholder="10-digit Mobile"
                />
              </div>

              <div className="input-field">
                <label>Relationship</label>
                <select
                  name="guarantorRelation"
                  value={formData.guarantorRelation}
                  onChange={handleChange}
                >
                  <option value="">Select Relation</option>
                  <option>Spouse</option>
                  <option>Parent</option>
                  <option>Sibling</option>
                  <option>Business Partner</option>
                </select>
              </div>
            </div>
          </div>

          {/* Half Width: Required Documents Upload */}
          <div className="form-section half-width">
            <h3>Required Documents</h3>
            <div className="doc-upload-container">
              {[
                { key: "identityProof", label: "Identity Proof (Aadhaar/PAN) *" },
                { key: "addressProof", label: "Address Proof" },
                { key: "incomeProof", label: "Income Proof (Salary/ITR) *" },
                { key: "bankStatement", label: "Bank Statement (6 Months)" },
              ].map((doc) => (
                <div key={doc.key} className="doc-upload-row">
                  <div className="doc-meta">
                    <span className="doc-title">{doc.label}</span>
                    <span className="doc-file-status">
                      {documents[doc.key] || "No file uploaded"}
                    </span>
                    {errors[doc.key] && (
                      <span className="error-text">{errors[doc.key]}</span>
                    )}
                  </div>

                  <label className="upload-trigger">
                    {documents[doc.key] ? (
                      <CheckCircle2 size={16} className="green-icon" />
                    ) : (
                      <Upload size={14} />
                    )}
                    <input
                      type="file"
                      hidden
                      onChange={(e) =>
                        handleFileUpload(doc.key, e.target.files[0])
                      }
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewLoanApplication;