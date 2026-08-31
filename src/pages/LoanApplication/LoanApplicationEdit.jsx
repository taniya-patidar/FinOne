import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import "./LoanApplicationEdit.css";

const LoanApplicationEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    mobile: "",
    email: "",
    loanType: "Personal Loan",
    loanAmount: "",
    tenureMonths: "12",
    interestRate: "10.5",
    status: "Pending",
    employmentType: "Salaried",
    monthlyIncome: "",
    address: "",
    appliedOn: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load existing application data on mount
  useEffect(() => {
    try {
      const savedLoans = JSON.parse(localStorage.getItem("loanApplications")) || [];
      const currentLoan = savedLoans.find((item) => String(item.id) === String(id));

      if (currentLoan) {
        // Auto-fill existing fields
        setFormData({
          id: currentLoan.id || id,
          name: currentLoan.name || currentLoan.fullName || "",
          mobile: currentLoan.mobile || currentLoan.phone || "",
          email: currentLoan.email || "",
          loanType: currentLoan.loanType || "Personal Loan",
          loanAmount: currentLoan.loanAmount ? String(currentLoan.loanAmount).replace(/[^0-9]/g, "") : "",
          tenureMonths: currentLoan.tenureMonths || "24",
          interestRate: currentLoan.interestRate || "10.5",
          status: currentLoan.status || "Pending",
          employmentType: currentLoan.employmentType || "Salaried",
          monthlyIncome: currentLoan.monthlyIncome || "",
          address: currentLoan.address || "",
          appliedOn: currentLoan.appliedOn || new Date().toLocaleDateString("en-GB"),
        });
      } else {
        setError("Loan application not found.");
      }
    } catch (err) {
      console.error("Error fetching loan detail:", err);
      setError("Failed to load application data.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    try {
      const savedLoans = JSON.parse(localStorage.getItem("loanApplications")) || [];
      
      const updatedLoans = savedLoans.map((item) => {
        if (String(item.id) === String(id)) {
          return {
            ...item,
            ...formData,
            loanAmount: `₹ ${Number(formData.loanAmount).toLocaleString("en-IN")}`,
          };
        }
        return item;
      });

      localStorage.setItem("loanApplications", JSON.stringify(updatedLoans));
      window.dispatchEvent(new Event("loansUpdated"));
      alert("Application updated successfully!");
      navigate("/loanApplication"); // Navigate back to list page
    } catch (err) {
      console.error("Error updating application:", err);
      alert("Failed to save updates.");
    }
  };

  if (loading) {
    return <div className="edit-loan-page loading-text">Loading application details...</div>;
  }

  if (error) {
    return (
      <div className="edit-loan-page">
        <div className="error-card">
          <p>{error}</p>
          <button className="back-btn" onClick={() => navigate("/loan-application")}>
            <ArrowLeft size={16} /> Back to Applications List
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="edit-loan-page">
      {/* Header */}
      <div className="form-header">
        <div className="header-title">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1>Edit Application #{formData.id}</h1>
            <span className="applied-date">Applied on: {formData.appliedOn}</span>
          </div>
        </div>

        <div className="header-actions">
          <button className="cancel-btn" onClick={() => navigate(-1)}>
            <X size={16} /> Cancel
          </button>
          <button className="submit-app-btn" onClick={handleSave}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form className="main-form-layout" onSubmit={handleSave}>
        {/* Application Status Admin Override */}
        <div className="form-section highlight-status-box">
          <h3>Admin Control & Status</h3>
          <div className="grid-2">
            <div className="input-field">
              <label>Application Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="input-field">
              <label>Application ID (Read-Only)</label>
              <input type="text" value={formData.id} disabled className="read-only-input" />
            </div>
          </div>
        </div>

        {/* Applicant Details */}
        <div className="form-section">
          <h3>Applicant Information</h3>
          <div className="grid-2">
            <div className="input-field">
              <label>Customer Name</label>
  <input
    type="text"
    value={formData.name}
    disabled 
    className="input-disabled"
  />
  <small className="help-text">
    Note: Customer name can only be updated from the Customer Management page.
  </small>
            </div>

            <div className="input-field">
              <label>Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-field">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-field">
              <label>Employment Type</label>
              <select name="employmentType" value={formData.employmentType} onChange={handleChange}>
                <option value="Salaried">Salaried</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Business">Business Owner</option>
              </select>
            </div>

            <div className="input-field full-span">
              <label>Residential Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Loan Details */}
        <div className="form-section">
          <h3>Loan Requirements</h3>
          <div className="grid-4">
            <div className="input-field">
              <label>Loan Type</label>
              <select name="loanType" value={formData.loanType} onChange={handleChange}>
                <option value="Home Loan">Home Loan</option>
                <option value="Personal Loan">Personal Loan</option>
                <option value="Business Loan">Business Loan</option>
                <option value="Vehicle Loan">Vehicle Loan</option>
              </select>
            </div>

            <div className="input-field">
              <label>Loan Amount (₹)</label>
              <input
                type="number"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-field">
              <label>Tenure (Months)</label>
              <input
                type="number"
                name="tenureMonths"
                value={formData.tenureMonths}
                onChange={handleChange}
              />
            </div>

            <div className="input-field">
              <label>Interest Rate (%)</label>
              <input
                type="text"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default LoanApplicationEdit;