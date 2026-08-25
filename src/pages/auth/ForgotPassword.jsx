import { useState } from "react";
import "./ForgotPassword.css";

import { ArrowLeft, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError("Please enter your registered email");
      return false;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address");
      return false;
    }

    setEmailError("");
    return true;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;

    setEmail(value);

    if (value.trim()) {
      setEmailError("");
    }
  };

  const handleSendOtp = (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    /*
      Backend/API baad mein yahan connect hogi.

      Example:

      await sendForgotPasswordOtp({
        email: email.trim()
      });

      Abhi frontend-only flow hai,
      isliye directly Verify OTP page par jayenge.
    */

    navigate("/verify-otp", {
      state: {
        email: email.trim(),
      },
    });
  };

  return (
    <div className="forgot-page">

      <div className="forgot-card">

        {/* BACK TO LOGIN */}

        <button
          type="button"
          className="back-login-btn"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={18} />
          <span>Back to Login</span>
        </button>

        {/* ICON */}

        <div className="forgot-icon">
          <Mail size={26} />
        </div>

        {/* HEADING */}

        <h2>Forgot Password?</h2>

        <p className="forgot-subtitle">
          Don't worry! Enter your registered email
          address and we'll help you reset your password.
        </p>

        {/* FORM */}

        <form
          onSubmit={handleSendOtp}
          noValidate
        >

          <div className="forgot-form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={handleEmailChange}
              autoComplete="email"
              aria-invalid={Boolean(emailError)}
              aria-describedby={
                emailError
                  ? "email-error"
                  : undefined
              }
            />

            {emailError && (
              <p
                id="email-error"
                className="forgot-field-error"
                role="alert"
              >
                {emailError}
              </p>
            )}

          </div>

          <button
            type="submit"
            className="send-otp-btn"
          >
            Send OTP
          </button>

        </form>

        {/* FOOTER */}

        <p className="forgot-footer">
          Remember your password?
          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Login
          </button>
        </p>

      </div>

    </div>
  );
};

export default ForgotPassword;