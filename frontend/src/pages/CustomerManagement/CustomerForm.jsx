import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  X,
  CheckCircle,
  ArrowLeft,
  Save,
} from "lucide-react";
import "./CustomerForm.css";

const CustomerForm = () => {
  const navigate = useNavigate();

  // ======================================================
  // FORM DATA
  // ======================================================

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    mobile: "",
    email: "",

    address1: "",
    address2: "",
    city: "",
    state: "",
    pinCode: "",

    aadhaar: "",
    pan: "",

    occupation: "",
    companyName: "",
    monthlyIncome: "",
  });

  // ======================================================
  // FILES
  // ======================================================

  const [files, setFiles] = useState({
    aadhaarCard: null,
    panCard: null,
    salarySlip: null,
    bankStatement: null,
  });

  // ======================================================
  // ERRORS
  // ======================================================

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // ======================================================
  // HANDLE INPUT
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // ======================================================
  // HANDLE FILE
  // ======================================================

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    const maxSize = 2 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setErrors((previous) => ({
        ...previous,
        [fieldName]: "Only PDF, JPG or PNG files are allowed.",
      }));
      return;
    }

    if (file.size > maxSize) {
      setErrors((previous) => ({
        ...previous,
        [fieldName]: "File size must be less than 2MB.",
      }));
      return;
    }

    setFiles((previous) => ({
      ...previous,
      [fieldName]: file,
    }));

    setErrors((previous) => ({
      ...previous,
      [fieldName]: "",
    }));
  };

  // ======================================================
  // REMOVE FILE
  // ======================================================

  const removeFile = (fieldName) => {
    setFiles((previous) => ({
      ...previous,
      [fieldName]: null,
    }));
  };

  // ======================================================
  // VALIDATION
  // ======================================================

  const validateForm = () => {
    const newErrors = {};

    // Personal Info
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters.";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required.";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select gender.";
    }

    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10 digit mobile number.";
    }

    if (!formData.email) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Address Info
    if (!formData.address1.trim()) {
      newErrors.address1 = "Address is required.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!formData.state) {
      newErrors.state = "Please select state.";
    }

    if (!formData.pinCode) {
      newErrors.pinCode = "PIN code is required.";
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = "PIN code must contain 6 digits.";
    }

    // Identity Info
    if (!formData.aadhaar) {
      newErrors.aadhaar = "Aadhaar number is required.";
    } else if (!/^\d{12}$/.test(formData.aadhaar)) {
      newErrors.aadhaar = "Aadhaar must contain exactly 12 digits.";
    }

    if (!formData.pan) {
      newErrors.pan = "PAN number is required.";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan.toUpperCase())) {
      newErrors.pan = "Enter a valid PAN number.";
    }

    // Employment Details
    if (!formData.occupation.trim()) {
      newErrors.occupation = "Occupation is required.";
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required.";
    }

    if (!formData.monthlyIncome) {
      newErrors.monthlyIncome = "Monthly income is required.";
    } else if (Number(formData.monthlyIncome) <= 0) {
      newErrors.monthlyIncome = "Enter a valid income.";
    }

    // Document Uploads
    if (!files.aadhaarCard) {
      newErrors.aadhaarCard = "Aadhaar card is required.";
    }

    if (!files.panCard) {
      newErrors.panCard = "PAN card is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ======================================================
  // GENERATE CUSTOMER ID
  // ======================================================

  const generateCustomerId = (existingCustomers) => {
    let highestNumber = 10000;

    existingCustomers.forEach((customer) => {
      const id = String(customer.id || "");
      const match = id.match(/^CUST-(\d+)$/);

      if (match) {
        const number = Number(match[1]);
        if (number > highestNumber) {
          highestNumber = number;
        }
      }
    });

    return `CUST-${highestNumber + 1}`;
  };

  // ======================================================
  // SAVE CUSTOMER
  // ======================================================

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("");

    const isValid = validateForm();

    if (!isValid) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    let existingCustomers = [];

    try {
      const savedCustomers = JSON.parse(localStorage.getItem("customers"));
      if (Array.isArray(savedCustomers)) {
        existingCustomers = savedCustomers;
      }
    } catch (error) {
      console.error("Error reading customers:", error);
    }

    const newCustomerId = generateCustomerId(existingCustomers);

    // 📅 Exact Current Registration Date & Time Generation
    const today = new Date();
    
    // Exact Indian Standard Date Format (e.g., "25 Aug 2026")
    const formattedDate = today.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // Time Format (e.g., "12:13 PM")
    const formattedTime = today.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const currentDateString = `${formattedDate}, ${formattedTime}`;

    const newCustomer = {
      id: newCustomerId,
      name: formData.fullName.trim(),
      mobile: formData.mobile.trim(),
      email: formData.email.trim(),
      loanType: "",
      kycStatus: "Pending",
      status: "Active",
      
      // ✅ Current Today's Date Saved Here
      registeredOn: currentDateString,

      personalInformation: {
        fullName: formData.fullName.trim(),
        dob: formData.dob,
        gender: formData.gender,
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
      },
      addressInformation: {
        address1: formData.address1.trim(),
        address2: formData.address2.trim(),
        city: formData.city.trim(),
        state: formData.state,
        pinCode: formData.pinCode.trim(),
      },
      identityVerification: {
        aadhaar: formData.aadhaar.trim(),
        pan: formData.pan.trim().toUpperCase(),
      },
      employmentDetails: {
        occupation: formData.occupation.trim(),
        companyName: formData.companyName.trim(),
        monthlyIncome: formData.monthlyIncome,
      },
      documents: {
        aadhaarCard: files.aadhaarCard
          ? {
              name: files.aadhaarCard.name,
              type: files.aadhaarCard.type,
              size: files.aadhaarCard.size,
            }
          : null,
        panCard: files.panCard
          ? {
              name: files.panCard.name,
              type: files.panCard.type,
              size: files.panCard.size,
            }
          : null,
        salarySlip: files.salarySlip
          ? {
              name: files.salarySlip.name,
              type: files.salarySlip.type,
              size: files.salarySlip.size,
            }
          : null,
        bankStatement: files.bankStatement
          ? {
              name: files.bankStatement.name,
              type: files.bankStatement.type,
              size: files.bankStatement.size,
            }
          : null,
      },
    };

    const updatedCustomers = [...existingCustomers, newCustomer];

    localStorage.setItem("customers", JSON.stringify(updatedCustomers));
    setSuccessMessage("Customer added successfully!");

    setTimeout(() => {
      navigate("/customers");
    }, 1000);
  };

  // ======================================================
  // FILE UPLOAD COMPONENT
  // ======================================================

  const FileUpload = ({ title, fieldName, required = false }) => {
    const file = files[fieldName];

    return (
      <div className="file-group">
        <label className="file-label">
          {title}
          {required && <span className="required">*</span>}
        </label>

        {!file ? (
          <label className="upload-box">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, fieldName)}
            />
            <Upload size={25} />
            <span>Choose file or drag & drop</span>
            <small>PDF, JPG, PNG • Max 2MB</small>
          </label>
        ) : (
          <div className="selected-file">
            <div className="file-info">
              <CheckCircle size={20} />
              <div>
                <strong>{file.name}</strong>
                <small>{(file.size / 1024).toFixed(1)} KB</small>
              </div>
            </div>
            <button type="button" onClick={() => removeFile(fieldName)}>
              <X size={18} />
            </button>
          </div>
        )}

        {errors[fieldName] && <p className="error">{errors[fieldName]}</p>}
      </div>
    );
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <section className="customer-form-page">
      {/* HEADER */}
      <div className="form-header">
        <div>
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/customers")}
          >
            <ArrowLeft size={17} />
            Back to Customers
          </button>
          <h1>Add New Customer</h1>
          <p>Register a new customer and complete their KYC information.</p>
        </div>

        <div className="header-buttons">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/customers")}
          >
            Cancel
          </button>
          <button type="submit" form="customer-form" className="save-button">
            <Save size={17} />
            Save Customer
          </button>
        </div>
      </div>

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div className="success-message">
          <CheckCircle size={20} />
          {successMessage}
        </div>
      )}

      {/* FORM */}
      <form id="customer-form" onSubmit={handleSubmit}>
        {/* SECTION 1: PERSONAL INFORMATION */}
        <div className="form-card">
          <div className="section-heading">
            <div className="section-number">1</div>
            <div>
              <h2>Personal Information</h2>
              <p>Basic details of the customer</p>
            </div>
          </div>

          <div className="form-grid three">
            <div className="input-group">
              <label>
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <p className="error">{errors.fullName}</p>}
            </div>

            <div className="input-group">
              <label>
                Date of Birth <span className="required">*</span>
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
              {errors.dob && <p className="error">{errors.dob}</p>}
            </div>

            <div className="input-group">
              <label>
                Gender <span className="required">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="error">{errors.gender}</p>}
            </div>
          </div>

          <div className="form-grid two">
            <div className="input-group">
              <label>
                Mobile Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                maxLength="10"
                placeholder="Enter 10 digit mobile number"
                value={formData.mobile}
                onChange={handleChange}
              />
              {errors.mobile && <p className="error">{errors.mobile}</p>}
            </div>

            <div className="input-group">
              <label>
                Email Address <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
          </div>
        </div>

        {/* SECTION 2: ADDRESS */}
        <div className="form-card">
          <div className="section-heading">
            <div className="section-number">2</div>
            <div>
              <h2>Address Information</h2>
              <p>Residential address details</p>
            </div>
          </div>

          <div className="form-grid two">
            <div className="input-group">
              <label>
                Address Line 1 <span className="required">*</span>
              </label>
              <input
                type="text"
                name="address1"
                placeholder="Enter address"
                value={formData.address1}
                onChange={handleChange}
              />
              {errors.address1 && <p className="error">{errors.address1}</p>}
            </div>

            <div className="input-group">
              <label>Address Line 2</label>
              <input
                type="text"
                name="address2"
                placeholder="Apartment, landmark etc."
                value={formData.address2}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-grid three">
            <div className="input-group">
              <label>
                City <span className="required">*</span>
              </label>
              <input
                type="text"
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
              />
              {errors.city && <p className="error">{errors.city}</p>}
            </div>

            <div className="input-group">
              <label>
                State <span className="required">*</span>
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
              >
                <option value="">Select state</option>
                <option>Delhi</option>
                <option>Haryana</option>
                <option>Punjab</option>
                <option>Rajasthan</option>
                <option>Uttar Pradesh</option>
                <option>Maharashtra</option>
                <option>Gujarat</option>
                <option>Madhya Pradesh</option>
                <option>Bihar</option>
                <option>West Bengal</option>
              </select>
              {errors.state && <p className="error">{errors.state}</p>}
            </div>

            <div className="input-group">
              <label>
                PIN Code <span className="required">*</span>
              </label>
              <input
                type="text"
                name="pinCode"
                maxLength="6"
                placeholder="Enter PIN code"
                value={formData.pinCode}
                onChange={handleChange}
              />
              {errors.pinCode && <p className="error">{errors.pinCode}</p>}
            </div>
          </div>
        </div>

        {/* SECTION 3: IDENTITY */}
        <div className="form-card">
          <div className="section-heading">
            <div className="section-number">3</div>
            <div>
              <h2>Identity Verification</h2>
              <p>Government identity information</p>
            </div>
          </div>

          <div className="form-grid two">
            <div className="input-group">
              <label>
                Aadhaar Number <span className="required">*</span>
              </label>
              <input
                type="text"
                name="aadhaar"
                maxLength="12"
                placeholder="Enter 12 digit Aadhaar number"
                value={formData.aadhaar}
                onChange={handleChange}
              />
              <small className="hint">Enter 12 digits without spaces.</small>
              {errors.aadhaar && <p className="error">{errors.aadhaar}</p>}
            </div>

            <div className="input-group">
              <label>
                PAN Number <span className="required">*</span>
              </label>
              <input
                type="text"
                name="pan"
                maxLength="10"
                placeholder="Enter PAN number"
                value={formData.pan}
                onChange={(e) =>
                  setFormData((previous) => ({
                    ...previous,
                    pan: e.target.value.toUpperCase(),
                  }))
                }
              />
              <small className="hint">Example: ABCDE1234F</small>
              {errors.pan && <p className="error">{errors.pan}</p>}
            </div>
          </div>
        </div>

        {/* SECTION 4: EMPLOYMENT DETAILS */}
        <div className="form-card">
          <div className="section-heading">
            <div className="section-number">4</div>
            <div>
              <h2>Employment Details</h2>
              <p>Employment and income information</p>
            </div>
          </div>

          <div className="form-grid three">
            <div className="input-group">
              <label>
                Occupation <span className="required">*</span>
              </label>
              <input
                type="text"
                name="occupation"
                placeholder="e.g. Software Engineer"
                value={formData.occupation}
                onChange={handleChange}
              />
              {errors.occupation && (
                <p className="error">{errors.occupation}</p>
              )}
            </div>

            <div className="input-group">
              <label>
                Company Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={handleChange}
              />
              {errors.companyName && (
                <p className="error">{errors.companyName}</p>
              )}
            </div>

            <div className="input-group">
              <label>
                Monthly Income <span className="required">*</span>
              </label>
              <div className="money-input">
                <span>₹</span>
                <input
                  type="number"
                  name="monthlyIncome"
                  placeholder="Enter monthly income"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                />
              </div>
              {errors.monthlyIncome && (
                <p className="error">{errors.monthlyIncome}</p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 5: DOCUMENT UPLOAD */}
        <div className="form-card">
          <div className="section-heading">
            <div className="section-number">5</div>
            <div>
              <h2>Document Upload</h2>
              <p>Upload documents for KYC verification</p>
            </div>
          </div>

          <div className="file-grid">
            <FileUpload
              title="Aadhaar Card"
              fieldName="aadhaarCard"
              required
            />
            <FileUpload title="PAN Card" fieldName="panCard" required />
            <FileUpload title="Salary Slip" fieldName="salarySlip" />
            <FileUpload title="Bank Statement" fieldName="bankStatement" />
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="bottom-buttons">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/customers")}
          >
            Cancel
          </button>
          <button type="submit" className="save-button">
            <Save size={17} />
            Save Customer
          </button>
        </div>
      </form>
    </section>
  );
};

export default CustomerForm;