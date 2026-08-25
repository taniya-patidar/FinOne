import { useState } from "react";
import "./ResetPassword.css";

import { ArrowLeft, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const otpVerified = location.state?.otpVerified || false;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] =
    useState("");

  const [showNewPassword, setShowNewPassword] =
    useState(false);

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

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;

    setNewPassword(value);

    checkPasswordStrength(value);

    if (value) {
      setNewPasswordError("");
    }

    if (
      confirmPassword &&
      value === confirmPassword
    ) {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;

    setConfirmPassword(value);

    if (value) {
      setConfirmPasswordError("");
    }

    if (newPassword && value !== newPassword) {
      setConfirmPasswordError(
        "Passwords do not match"
      );
    }
  };

  const validateForm = () => {
    let isValid = true;

    setNewPasswordError("");
    setConfirmPasswordError("");

    if (!newPassword) {
      setNewPasswordError(
        "Please enter your new password"
      );
      isValid = false;
    } else if (newPassword.length < 8) {
      setNewPasswordError(
        "Password must be at least 8 characters"
      );
      isValid = false;
    } else if (
      !/[A-Z]/.test(newPassword) ||
      !/[a-z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword) ||
      !/[^A-Za-z0-9]/.test(newPassword)
    ) {
      setNewPasswordError(
        "Use uppercase, lowercase, number and special character"
      );
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError(
        "Please confirm your password"
      );
      isValid = false;
    } else if (
      newPassword !== confirmPassword
    ) {
      setConfirmPasswordError(
        "Passwords do not match"
      );
      isValid = false;
    }

    return isValid;
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    /*
      BACKEND/API LATER:

      await resetPassword({
        email,
        otp,
        newPassword
      });

      Backend actual password update karega.
    */

    console.log("Password reset successfully");

    navigate("/");
  };

  const handleBack = () => {
    navigate("/verify-otp", {
      state: {
        email,
      },
    });
  };

  return (
    <div className="reset-page">

      <div className="reset-card">

        {/* BACK BUTTON */}

        <button
          type="button"
          className="reset-back-btn"
          onClick={handleBack}
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        {/* ICON */}

        <div className="reset-icon">
          <LockKeyhole size={27} />
        </div>

        {/* HEADING */}

        <h2>Reset Password</h2>

        <p className="reset-subtitle">
          Create a new password for your account.
        </p>

        {email && (
          <p className="reset-email">
            {email}
          </p>
        )}

        {/* FORM */}

        <form
          onSubmit={handleResetPassword}
          noValidate
        >

          {/* NEW PASSWORD */}

          <div className="reset-form-group">

            <label htmlFor="new-password">
              New Password
            </label>

            <div className="reset-password-wrapper">

              <input
                id="new-password"
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter new password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                autoComplete="new-password"
                aria-invalid={Boolean(
                  newPasswordError
                )}
              />

              <button
                type="button"
                className="reset-password-toggle"
                onClick={() =>
                  setShowNewPassword(
                    (previous) => !previous
                  )
                }
                aria-label={
                  showNewPassword
                    ? "Hide new password"
                    : "Show new password"
                }
              >
                {showNewPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            {passwordStrength && (
              <p
                className={`reset-password-strength ${passwordStrength.toLowerCase()}`}
              >
                {passwordStrength} password
              </p>
            )}

            {newPasswordError && (
              <p
                className="reset-field-error"
                role="alert"
              >
                {newPasswordError}
              </p>
            )}

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="reset-form-group">

            <label htmlFor="confirm-password">
              Confirm Password
            </label>

            <div className="reset-password-wrapper">

              <input
                id="confirm-password"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={
                  handleConfirmPasswordChange
                }
                autoComplete="new-password"
                aria-invalid={Boolean(
                  confirmPasswordError
                )}
              />

              <button
                type="button"
                className="reset-password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    (previous) => !previous
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

            {confirmPasswordError && (
              <p
                className="reset-field-error"
                role="alert"
              >
                {confirmPasswordError}
              </p>
            )}

          </div>

          {/* RESET BUTTON */}

          <button
            type="submit"
            className="reset-password-btn"
          >
            Reset Password
          </button>

        </form>

        {/* FOOTER */}

        <p className="reset-footer">
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

export default ResetPassword;