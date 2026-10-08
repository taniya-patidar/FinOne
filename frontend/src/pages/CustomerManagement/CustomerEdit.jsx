import React, {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Save,
  User,
  MapPin,
  CreditCard,
  Briefcase,
  FileText,
  Upload,
  X,
  CheckCircle,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "./CustomerEdit.css";

// ======================================================
// CUSTOMER EDIT
// ======================================================

const CustomerEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ======================================================
  // STATES
  // ======================================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [customer, setCustomer] =
    useState(null);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errors, setErrors] =
    useState({});

  // ======================================================
  // FORM DATA
  // ======================================================

  const [formData, setFormData] =
    useState({
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

      loanType: "",
      kycStatus: "Pending",
      status: "Active",
    });

  // ======================================================
  // FILES
  // ======================================================

  const [files, setFiles] =
    useState({
      aadhaarCard: null,
      panCard: null,
      salarySlip: null,
      bankStatement: null,
    });

  // ======================================================
  // LOAD CUSTOMER
  // ======================================================

  useEffect(() => {
    loadCustomer();
  }, [id]);

  // ======================================================
  // LOAD CUSTOMER FUNCTION
  // ======================================================

  const loadCustomer = () => {
    try {
      const savedCustomers =
        JSON.parse(
          localStorage.getItem("customers")
        ) || [];

      const foundCustomer =
        savedCustomers.find(
          (item) =>
            String(item.id) ===
            String(id)
        );

      if (!foundCustomer) {
        setLoading(false);
        return;
      }

      setCustomer(foundCustomer);

      // ==================================================
      // SAFE NESTED DATA
      // ==================================================

      const personal =
        foundCustomer.personalInformation ||
        {};

      const address =
        foundCustomer.addressInformation ||
        {};

      const identity =
        foundCustomer.identityVerification ||
        {};

      const employment =
        foundCustomer.employmentDetails ||
        {};

      // ==================================================
      // SET FORM DATA
      // ==================================================

      setFormData({
        fullName:
          personal.fullName ||
          foundCustomer.name ||
          "",

        dob:
          personal.dob ||
          "",

        gender:
          personal.gender ||
          "",

        mobile:
          personal.mobile ||
          foundCustomer.mobile ||
          "",

        email:
          personal.email ||
          foundCustomer.email ||
          "",

        address1:
          address.address1 ||
          "",

        address2:
          address.address2 ||
          "",

        city:
          address.city ||
          "",

        state:
          address.state ||
          "",

        pinCode:
          address.pinCode ||
          "",

        aadhaar:
          identity.aadhaar ||
          "",

        pan:
          identity.pan ||
          "",

        occupation:
          employment.occupation ||
          "",

        companyName:
          employment.companyName ||
          "",

        monthlyIncome:
          employment.monthlyIncome ||
          "",

        loanType:
          foundCustomer.loanType ||
          "",

        kycStatus:
          foundCustomer.kycStatus ||
          "Pending",

        status:
          foundCustomer.status ||
          "Active",
      });

      // ==================================================
      // EXISTING DOCUMENTS
      // ==================================================

      setFiles({
        aadhaarCard:
          foundCustomer.documents
            ?.aadhaarCard || null,

        panCard:
          foundCustomer.documents
            ?.panCard || null,

        salarySlip:
          foundCustomer.documents
            ?.salarySlip || null,

        bankStatement:
          foundCustomer.documents
            ?.bankStatement || null,
      });

      setLoading(false);
    } catch (error) {
      console.error(
        "Error loading customer:",
        error
      );

      setLoading(false);
    }
  };

  // ======================================================
  // HANDLE INPUT
  // ======================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setErrors(
      (previous) => ({
        ...previous,
        [name]: "",
      })
    );

    setSuccessMessage("");
  };

  // ======================================================
  // HANDLE FILE
  // ======================================================

  const handleFileChange = (
    e,
    fieldName
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    const maxSize =
      2 * 1024 * 1024;

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setErrors(
        (previous) => ({
          ...previous,
          [fieldName]:
            "Only PDF, JPG or PNG files are allowed.",
        })
      );

      return;
    }

    if (file.size > maxSize) {
      setErrors(
        (previous) => ({
          ...previous,
          [fieldName]:
            "File size must be less than 2MB.",
        })
      );

      return;
    }

    setFiles(
      (previous) => ({
        ...previous,
        [fieldName]: {
          name: file.name,
          type: file.type,
          size: file.size,
        },
      })
    );

    setErrors(
      (previous) => ({
        ...previous,
        [fieldName]: "",
      })
    );
  };

  // ======================================================
  // REMOVE FILE
  // ======================================================

  const removeFile = (
    fieldName
  ) => {
    setFiles(
      (previous) => ({
        ...previous,
        [fieldName]: null,
      })
    );
  };

  // ======================================================
  // VALIDATION
  // ======================================================

  const validateForm = () => {
    const newErrors = {};

    // ==================================================
    // PERSONAL
    // ==================================================

    if (
      !formData.fullName.trim()
    ) {
      newErrors.fullName =
        "Full name is required.";
    } else if (
      formData.fullName
        .trim()
        .length < 3
    ) {
      newErrors.fullName =
        "Full name must be at least 3 characters.";
    }

    if (!formData.dob) {
      newErrors.dob =
        "Date of birth is required.";
    }

    if (!formData.gender) {
      newErrors.gender =
        "Please select gender.";
    }

    if (!formData.mobile) {
      newErrors.mobile =
        "Mobile number is required.";
    } else if (
      !/^[6-9]\d{9}$/.test(
        formData.mobile
      )
    ) {
      newErrors.mobile =
        "Enter a valid 10 digit mobile number.";
    }

    if (!formData.email) {
      newErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    // ==================================================
    // ADDRESS
    // ==================================================

    if (
      !formData.address1.trim()
    ) {
      newErrors.address1 =
        "Address is required.";
    }

    if (
      !formData.city.trim()
    ) {
      newErrors.city =
        "City is required.";
    }

    if (!formData.state) {
      newErrors.state =
        "Please select state.";
    }

    if (!formData.pinCode) {
      newErrors.pinCode =
        "PIN code is required.";
    } else if (
      !/^\d{6}$/.test(
        formData.pinCode
      )
    ) {
      newErrors.pinCode =
        "PIN code must contain 6 digits.";
    }

    // ==================================================
    // IDENTITY
    // ==================================================

    if (!formData.aadhaar) {
      newErrors.aadhaar =
        "Aadhaar number is required.";
    } else if (
      !/^\d{12}$/.test(
        formData.aadhaar
      )
    ) {
      newErrors.aadhaar =
        "Aadhaar must contain exactly 12 digits.";
    }

    if (!formData.pan) {
      newErrors.pan =
        "PAN number is required.";
    } else if (
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(
        formData.pan.toUpperCase()
      )
    ) {
      newErrors.pan =
        "Enter a valid PAN number.";
    }

    // ==================================================
    // EMPLOYMENT
    // ==================================================

    if (
      !formData.occupation.trim()
    ) {
      newErrors.occupation =
        "Occupation is required.";
    }

    if (
      !formData.companyName.trim()
    ) {
      newErrors.companyName =
        "Company name is required.";
    }

    if (!formData.monthlyIncome) {
      newErrors.monthlyIncome =
        "Monthly income is required.";
    } else if (
      Number(
        formData.monthlyIncome
      ) <= 0
    ) {
      newErrors.monthlyIncome =
        "Enter a valid income.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  // ======================================================
  // SAVE CUSTOMER
  // ======================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    setSuccessMessage("");

    if (!validateForm()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setSaving(true);

    try {
      const savedCustomers =
        JSON.parse(
          localStorage.getItem("customers")
        ) || [];

      // ==================================================
      // FIND CUSTOMER INDEX
      // ==================================================

      const customerIndex =
        savedCustomers.findIndex(
          (item) =>
            String(item.id) ===
            String(id)
        );

      if (
        customerIndex === -1
      ) {
        setSaving(false);

        setErrors({
          general:
            "Customer not found.",
        });

        return;
      }

      const oldCustomer =
        savedCustomers[
          customerIndex
        ];

      // ==================================================
      // UPDATED CUSTOMER
      // ==================================================

      const updatedCustomer = {
        ...oldCustomer,

        // ------------------------------------------------
        // BASIC LIST DATA
        // ------------------------------------------------

        name:
          formData.fullName.trim(),

        mobile:
          formData.mobile.trim(),

        email:
          formData.email.trim(),

        loanType:
          formData.loanType,

        kycStatus:
          formData.kycStatus,

        status:
          formData.status,

        // ------------------------------------------------
        // PERSONAL
        // ------------------------------------------------

        personalInformation: {
          ...(oldCustomer.personalInformation ||
            {}),

          fullName:
            formData.fullName.trim(),

          dob:
            formData.dob,

          gender:
            formData.gender,

          mobile:
            formData.mobile.trim(),

          email:
            formData.email.trim(),
        },

        // ------------------------------------------------
        // ADDRESS
        // ------------------------------------------------

        addressInformation: {
          ...(oldCustomer.addressInformation ||
            {}),

          address1:
            formData.address1.trim(),

          address2:
            formData.address2.trim(),

          city:
            formData.city.trim(),

          state:
            formData.state,

          pinCode:
            formData.pinCode.trim(),
        },

        // ------------------------------------------------
        // IDENTITY
        // ------------------------------------------------

        identityVerification: {
          ...(oldCustomer.identityVerification ||
            {}),

          aadhaar:
            formData.aadhaar.trim(),

          pan:
            formData.pan
              .trim()
              .toUpperCase(),
        },

        // ------------------------------------------------
        // EMPLOYMENT
        // ------------------------------------------------

        employmentDetails: {
          ...(oldCustomer.employmentDetails ||
            {}),

          occupation:
            formData.occupation.trim(),

          companyName:
            formData.companyName.trim(),

          monthlyIncome:
            formData.monthlyIncome,
        },

        // ------------------------------------------------
        // DOCUMENTS
        // ------------------------------------------------

        documents: {
          ...(oldCustomer.documents ||
            {}),

          aadhaarCard:
            files.aadhaarCard,

          panCard:
            files.panCard,

          salarySlip:
            files.salarySlip,

          bankStatement:
            files.bankStatement,
        },
      };

      // ==================================================
      // UPDATE ARRAY
      // ==================================================

      const updatedCustomers =
        [...savedCustomers];

      updatedCustomers[
        customerIndex
      ] = updatedCustomer;

      // ==================================================
      // SAVE
      // ==================================================

      localStorage.setItem(
        "customers",
        JSON.stringify(
          updatedCustomers
        )
      );

      setCustomer(
        updatedCustomer
      );

      setSuccessMessage(
        "Customer details updated successfully!"
      );

      // ==================================================
      // GO BACK TO DETAIL
      // ==================================================

      setTimeout(() => {
        navigate(
          `/customers/${id}`
        );
      }, 900);
    } catch (error) {
      console.error(
        "Error updating customer:",
        error
      );

      setErrors({
        general:
          "Something went wrong while saving customer.",
      });

      setSaving(false);
    }
  };

  // ======================================================
  // FILE UPLOAD COMPONENT
  // ======================================================

  const FileUpload = ({
    title,
    fieldName,
    required = false,
  }) => {
    const file =
      files[fieldName];

    return (
      <div className="edit-file-group">

        <label className="edit-file-label">

          <span>
            {title}
          </span>

          {required && (
            <span className="required">
              *
            </span>
          )}

        </label>

        {!file ? (

          <label className="edit-upload-box">

            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) =>
                handleFileChange(
                  e,
                  fieldName
                )
              }
            />

            <div className="upload-icon">
              <Upload size={21} />
            </div>

            <div>
              <strong>
                Upload document
              </strong>

              <small>
                PDF, JPG or PNG · Max 2MB
              </small>
            </div>

          </label>

        ) : (

          <div className="edit-selected-file">

            <div className="edit-file-info">

              <div className="file-check">
                <CheckCircle
                  size={19}
                />
              </div>

              <div>
                <strong>
                  {file.name}
                </strong>

                {file.size && (
                  <small>
                    {(
                      file.size /
                      1024
                    ).toFixed(1)}{" "}
                    KB
                  </small>
                )}

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                removeFile(
                  fieldName
                )
              }
              title="Remove document"
            >
              <X size={17} />
            </button>

          </div>

        )}

        {errors[fieldName] && (
          <p className="error">
            {errors[fieldName]}
          </p>
        )}

      </div>
    );
  };

  // ======================================================
  // CUSTOMER NOT FOUND
  // ======================================================

  if (!loading && !customer) {
    return (
      <section className="customer-edit-page">

        <div className="edit-not-found">

          <div className="not-found-icon">
            <User size={28} />
          </div>

          <h2>
            Customer Not Found
          </h2>

          <p>
            The customer you are trying
            to edit does not exist.
          </p>

          <button
            className="edit-back-button"
            onClick={() =>
              navigate(
                "/customers"
              )
            }
          >
            <ArrowLeft size={17} />
            Back to Customers
          </button>

        </div>

      </section>
    );
  }

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <section className="customer-edit-page">

        <div className="edit-loading">
          <div className="loading-spinner" />
          <p>
            Loading customer details...
          </p>
        </div>

      </section>
    );
  }

  // ======================================================
  // RETURN
  // ======================================================

  return (
    <section className="customer-edit-page">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="edit-page-header">

        <div>

          <button
            type="button"
            className="edit-back-link"
            onClick={() =>
              navigate(
                `/customers/${id}`
              )
            }
          >
            <ArrowLeft size={17} />
            Back to Customer Details
          </button>

          <div className="edit-title-row">

            <div className="edit-title-icon">
              <PencilIcon />
            </div>

            <div>
              <h1>
                Edit Customer
              </h1>

              <p>
                Update customer information
                and KYC details.
              </p>
            </div>

          </div>

        </div>

        <div className="edit-header-meta">

          <span>
            Customer ID
          </span>

          <strong>
            {customer.id}
          </strong>

        </div>

      </div>

      {/* ==================================================
          SUCCESS
      ================================================== */}

      {successMessage && (
        <div className="edit-success-message">

          <CheckCircle
            size={20}
          />

          <span>
            {successMessage}
          </span>

        </div>
      )}

      {/* ==================================================
          GENERAL ERROR
      ================================================== */}

      {errors.general && (
        <div className="edit-general-error">
          {errors.general}
        </div>
      )}

      {/* ==================================================
          FORM
      ================================================== */}

      <form
        id="customer-edit-form"
        onSubmit={handleSubmit}
      >

        {/* ==================================================
            PERSONAL INFORMATION
        ================================================== */}

        <div className="edit-card">

          <div className="edit-section-header">

            <div className="edit-section-icon">
              <User size={19} />
            </div>

            <div>
              <h2>
                Personal Information
              </h2>

              <p>
                Basic details of the customer
              </p>
            </div>

          </div>

          <div className="edit-form-grid three">

            <div className="edit-input-group">

              <label>
                Full Name
                <span className="required">
                  *
                </span>
              </label>

              <input
                type="text"
                name="fullName"
                value={
                  formData.fullName
                }
                onChange={
                  handleChange
                }
                placeholder="Enter full name"
              />

              {errors.fullName && (
                <p className="error">
                  {errors.fullName}
                </p>
              )}

            </div>

            <div className="edit-input-group">

              <label>
                Date of Birth
                <span className="required">
                  *
                </span>
              </label>

              <input
                type="date"
                name="dob"
                value={
                  formData.dob
                }
                onChange={
                  handleChange
                }
              />

              {errors.dob && (
                <p className="error">
                  {errors.dob}
                </p>
              )}

            </div>

            <div className="edit-input-group">

              <label>
                Gender
                <span className="required">
                  *
                </span>
              </label>

              <select
                name="gender"
                value={
                  formData.gender
                }
                onChange={
                  handleChange
                }
              >
                <option value="">
                  Select gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

              {errors.gender && (
                <p className="error">
                  {errors.gender}
                </p>
              )}

            </div>

          </div>

          <div className="edit-form-grid two">

            <div className="edit-input-group">

              <label>
                Mobile Number
                <span className="required">
                  *
                </span>
              </label>

              <input
                type="tel"
                name="mobile"
                maxLength="10"
                value={
                  formData.mobile
                }
                onChange={
                  handleChange
                }
                placeholder="Enter mobile number"
              />

              {errors.mobile && (
                <p className="error">
                  {errors.mobile}
                </p>
              )}

            </div>

            <div className="edit-input-group">

              <label>
                Email Address
                <span className="required">
                  *
                </span>
              </label>

              <input
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                placeholder="Enter email address"
              />

              {errors.email && (
                <p className="error">
                  {errors.email}
                </p>
              )}

            </div>

          </div>

        </div>

        {/* ==================================================
            ADDRESS
        ================================================== */}

        <div className="edit-card">

          <div className="edit-section-header">

            <div className="edit-section-icon">
              <MapPin size={19} />
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

          <div className="edit-form-grid two">

            <div className="edit-input-group">

              <label>
                Address Line 1
                <span className="required">
                  *
                </span>
              </label>

              <input
                type="text"
                name="address1"
                value={
                  formData.address1
                }
                onChange={
                  handleChange
                }
                placeholder="Enter address"
              />

              {errors.address1 && (
                <p className="error">
                  {errors.address1}
                </p>
              )}

            </div>

            <div className="edit-input-group">

              <label>
                Address Line 2
              </label>

              <input
                type="text"
                name="address2"
                value={
                  formData.address2
                }
                onChange={
                  handleChange
                }
                placeholder="Apartment, landmark etc."
              />

            </div>

          </div>

          <div className="edit-form-grid three">

            <div className="edit-input-group">

              <label>
                City
                <span className="required">
                  *
                </span>
              </label>

              <input
                type="text"
                name="city"
                value={
                  formData.city
                }
                onChange={
                  handleChange
                }
                placeholder="Enter city"
              />

              {errors.city && (
                <p className="error">
                  {errors.city}
                </p>
              )}

            </div>

            <div className="edit-input-group">

              <label>
                State
                <span className="required">
                  *
                </span>
              </label>

              <select
                name="state"
                value={
                  formData.state
                }
                onChange={
                  handleChange
                }
              >

                <option value="">
                  Select state
                </option>

                <option value="Delhi">
                  Delhi
                </option>

                <option value="Haryana">
                  Haryana
                </option>

                <option value="Punjab">
                  Punjab
                </option>

                <option value="Rajasthan">
                  Rajasthan
                </option>

                <option value="Uttar Pradesh">
                  Uttar Pradesh
                </option>

                <option value="Maharashtra">
                  Maharashtra
                </option>

                <option value="Gujarat">
                  Gujarat
                </option>

                <option value="Madhya Pradesh">
                  Madhya Pradesh
                </option>

                <option value="Bihar">
                  Bihar
                </option>

                <option value="West Bengal">
                  West Bengal
                </option>

              </select>

              {errors.state && (
                <p className="error">
                  {errors.state}
                </p>
              )}

            </div>

            <div className="edit-input-group">

              <label>
                PIN Code
                <span className="required">
                  *
                </span>
              </label>

              <input
                type="text"
                name="pinCode"
                maxLength="6"
                value={
                  formData.pinCode
                }
                onChange={
                  handleChange
                }
                placeholder="Enter PIN code"
              />

              {errors.pinCode && (
                <p className="error">
                  {errors.pinCode}
                </p>
              )}

            </div>

          </div>

        </div>

        {/* ==================================================
            IDENTITY
        ================================================== */}

        <div className="edit-card">

          <div className="edit-section-header">

            <div className="edit-section-icon">
              <CreditCard size={19} />
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

          <div className="edit-form-grid two">

            <div className="edit-input-group">

              <label>
                Aadhaar Number
                <span className="required">
                  *
                </span>
              </label>

              <input
                type="text"
                name="aadhaar"
                maxLength="12"
                value={
                  formData.aadhaar
                }
                onChange={
                  handleChange
                }
                placeholder="Enter 12 digit Aadhaar"
              />

              <small className="edit-hint">
                Enter 12 digits without
                spaces.
              </small>

              {errors.aadhaar && (
                <p className="error">
                  {errors.aadhaar}
                </p>
              )}

            </div>

            <div className="edit-input-group">

              <label>
                PAN Number
                <span className="required">
                  *
                </span>
              </label>

              <input
                type="text"
                name="pan"
                maxLength="10"
                value={
                  formData.pan
                }
                onChange={(e) =>
                  setFormData(
                    (previous) => ({
                      ...previous,
                      pan:
                        e.target.value.toUpperCase(),
                    })
                  )
                }
                placeholder="ABCDE1234F"
              />

              <small className="edit-hint">
                Example: ABCDE1234F
              </small>

              {errors.pan && (
                <p className="error">
                  {errors.pan}
                </p>
              )}

            </div>

          </div>

        </div>

        {/* ==================================================
            EMPLOYMENT
        ================================================== */}

        <div className="edit-card">

          <div className="edit-section-header">

            <div className="edit-section-icon">
              <Briefcase size={19} />
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

          <div className="edit-form-grid three">

            <div className="edit-input-group">

              <label>
                Occupation
                <span className="required">
                  *
                </span>
              </label>

              <input
                type="text"
                name="occupation"
                value={
                  formData.occupation
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. Software Engineer"
              />

              {errors.occupation && (
                <p className="error">
                  {errors.occupation}
                </p>
              )}

            </div>

            <div className="edit-input-group">

              <label>
                Company Name
                <span className="required">
                  *
                </span>
              </label>

              <input
                type="text"
                name="companyName"
                value={
                  formData.companyName
                }
                onChange={
                  handleChange
                }
                placeholder="Enter company name"
              />

              {errors.companyName && (
                <p className="error">
                  {errors.companyName}
                </p>
              )}

            </div>

            <div className="edit-input-group">

              <label>
                Monthly Income
                <span className="required">
                  *
                </span>
              </label>

              <div className="edit-money-input">

                <span>
                  ₹
                </span>

                <input
                  type="number"
                  name="monthlyIncome"
                  value={
                    formData.monthlyIncome
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Monthly income"
                />

              </div>

              {errors.monthlyIncome && (
                <p className="error">
                  {errors.monthlyIncome}
                </p>
              )}

            </div>

          </div>

        </div>

        {/* ==================================================
            LOAN + STATUS
        ================================================== */}

        <div className="edit-card">

          <div className="edit-section-header">

            <div className="edit-section-icon">
              <Briefcase size={19} />
            </div>

            <div>
              <h2>
                Customer Status
              </h2>

              <p>
                Loan and account status
              </p>
            </div>

          </div>

          <div className="edit-form-grid three">

            <div className="edit-input-group">

              <label>
                Loan Type
              </label>

              <select
                name="loanType"
                value={
                  formData.loanType
                }
                onChange={
                  handleChange
                }
              >

                <option value="">
                  Select loan type
                </option>

                <option value="Home Loan">
                  Home Loan
                </option>

                <option value="Personal Loan">
                  Personal Loan
                </option>

                <option value="Business Loan">
                  Business Loan
                </option>

                <option value="Vehicle Loan">
                  Vehicle Loan
                </option>

              </select>

            </div>

            <div className="edit-input-group">

              <label>
                KYC Status
              </label>

              <select
                name="kycStatus"
                value={
                  formData.kycStatus
                }
                onChange={
                  handleChange
                }
              >

                <option value="Verified">
                  Verified
                </option>

                <option value="Pending">
                  Pending
                </option>

              </select>

            </div>

            <div className="edit-input-group">

              <label>
                Customer Status
              </label>

              <select
                name="status"
                value={
                  formData.status
                }
                onChange={
                  handleChange
                }
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* ==================================================
            DOCUMENTS
        ================================================== */}

        <div className="edit-card">

          <div className="edit-section-header">

            <div className="edit-section-icon">
              <FileText size={19} />
            </div>

            <div>
              <h2>
                Documents
              </h2>

              <p>
                Manage customer KYC documents
              </p>
            </div>

          </div>

          <div className="edit-file-grid">

            <FileUpload
              title="Aadhaar Card"
              fieldName="aadhaarCard"
              required
            />

            <FileUpload
              title="PAN Card"
              fieldName="panCard"
              required
            />

            <FileUpload
              title="Salary Slip"
              fieldName="salarySlip"
            />

            <FileUpload
              title="Bank Statement"
              fieldName="bankStatement"
            />

          </div>

        </div>

        {/* ==================================================
            BOTTOM ACTIONS
        ================================================== */}

        <div className="edit-bottom-bar">

          <button
            type="button"
            className="edit-cancel-button"
            onClick={() =>
              navigate(
                `/customers/${id}`
              )
            }
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="edit-save-button"
            disabled={saving}
          >

            {saving ? (
              <>
                <span className="button-spinner" />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Changes
              </>
            )}

          </button>

        </div>

      </form>

    </section>
  );
};

// ======================================================
// SMALL PENCIL ICON
// ======================================================

const PencilIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

export default CustomerEdit;