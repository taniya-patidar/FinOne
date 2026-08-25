import { useState } from "react";
import "./Register.css";

import finoneImage from "../../assets/FinOne.jpeg";

import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [passwordStrength, setPasswordStrength] =
    useState("");

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength("");
      return;
    }

    if (password.length < 6) {
      setPasswordStrength("Weak");
      return;
    }

    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    ) {
      setPasswordStrength("Strong");
      return;
    }

    setPasswordStrength("Medium");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove error while typing
    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }

    if (name === "password") {
      checkPasswordStrength(value);
    }

    if (name === "confirmPassword") {
      if (
        value &&
        value === formData.password
      ) {
        setErrors((previous) => ({
          ...previous,
          confirmPassword: "",
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const {
      fullName,
      username,
      email,
      phone,
      password,
      confirmPassword,
    } = formData;

    /* Full Name */

    if (!fullName.trim()) {
      newErrors.fullName =
        "Please enter your full name";
    } else if (fullName.trim().length < 3) {
      newErrors.fullName =
        "Name must be at least 3 characters";
    }

    /* Username */

    if (!username.trim()) {
      newErrors.username =
        "Please enter a username";
    } else if (username.trim().length < 4) {
      newErrors.username =
        "Username must be at least 4 characters";
    } else if (
      !/^[a-zA-Z0-9_]+$/.test(username)
    ) {
      newErrors.username =
        "Username can contain letters, numbers and underscore only";
    }

    /* Email */

    if (!email.trim()) {
      newErrors.email =
        "Please enter your email address";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      newErrors.email =
        "Please enter a valid email address";
    }

    /* Phone */

    if (!phone.trim()) {
      newErrors.phone =
        "Please enter your phone number";
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phone =
        "Please enter a valid 10-digit phone number";
    }

    /* Password */

    if (!password) {
      newErrors.password =
        "Please enter a password";
    } else if (password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters";
    } else if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      newErrors.password =
        "Use uppercase, lowercase, number and special character";
    }

    /* Confirm Password */

    if (!confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (
      password !== confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    /*
      BACKEND/API LATER:

      await registerUser(formData);

      Backend user ko database mein create karega.
    */

    console.log("Registration data:", formData);

    // Temporary frontend flow
    navigate("/");
  };

  return (
    <div className="register-page">

      {/* LEFT IMAGE */}

      <div className="register-left">

        <img
          src={finoneImage}
          alt="FinOne Loan Management System"
        />

      </div>

      {/* RIGHT SIDE */}

      <div className="register-right">

        <div className="register-card">

          <h2>Create Account</h2>

          <p className="register-subtitle">
            Create your account to get started with
            FinOne
          </p>

          <form
            onSubmit={handleRegister}
            noValidate
          >

            {/* FULL NAME */}

            <div className="register-form-group">

              <label htmlFor="fullName">
                Full Name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
                aria-invalid={Boolean(
                  errors.fullName
                )}
              />

              {errors.fullName && (
                <p className="register-field-error">
                  {errors.fullName}
                </p>
              )}

            </div>

            {/* USERNAME + EMAIL */}

            <div className="register-row">

              <div className="register-form-group">

                <label htmlFor="username">
                  Username
                </label>

                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  aria-invalid={Boolean(
                    errors.username
                  )}
                />

                {errors.username && (
                  <p className="register-field-error">
                    {errors.username}
                  </p>
                )}

              </div>

              <div className="register-form-group">

                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  aria-invalid={Boolean(
                    errors.email
                  )}
                />

                {errors.email && (
                  <p className="register-field-error">
                    {errors.email}
                  </p>
                )}

              </div>

            </div>

            {/* PHONE */}

            <div className="register-form-group">

              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                inputMode="numeric"
                autoComplete="tel"
                aria-invalid={Boolean(
                  errors.phone
                )}
              />

              {errors.phone && (
                <p className="register-field-error">
                  {errors.phone}
                </p>
              )}

            </div>

            {/* PASSWORD + CONFIRM PASSWORD */}

            <div className="register-row">

              <div className="register-form-group">

                <label htmlFor="password">
                  Password
                </label>

                <div className="register-password-wrapper">

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    aria-invalid={Boolean(
                      errors.password
                    )}
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

                {passwordStrength && (
                  <p
                    className={`register-password-strength ${passwordStrength.toLowerCase()}`}
                  >
                    {passwordStrength} password
                  </p>
                )}

                {errors.password && (
                  <p className="register-field-error">
                    {errors.password}
                  </p>
                )}

              </div>

              <div className="register-form-group">

                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <div className="register-password-wrapper">

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm password"
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    autoComplete="new-password"
                    aria-invalid={Boolean(
                      errors.confirmPassword
                    )}
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

                {errors.confirmPassword && (
                  <p className="register-field-error">
                    {errors.confirmPassword}
                  </p>
                )}

              </div>

            </div>

            {/* REGISTER BUTTON */}

            <button
              type="submit"
              className="register-btn"
            >
              Create Account
            </button>

          </form>

          {/* LOGIN */}

          <div className="register-login-link">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={() => navigate("/")}
            >
              Login
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;
