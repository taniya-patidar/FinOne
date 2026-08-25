import { useState } from "react";
import "./VerifyOtp.css";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleOtpChange = (e) => {
    const value = e.target.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    // Maximum 6 digits
    if (value.length > 6) {
      return;
    }

    setOtp(value);

    if (value.length > 0) {
      setOtpError("");
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();

    if (!otp) {
      setOtpError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    /*
      BACKEND/API LATER:

      const response = await verifyOtp({
        email,
        otp
      });

      Backend OTP verify karega.
    */

    // Temporary frontend-only OTP
    const demoOtp = "123456";

    if (otp !== demoOtp) {
      setOtpError("Invalid OTP. Please try again.");
      return;
    }

    // OTP verified
    navigate("/reset-password", {
      state: {
        email,
        otpVerified: true,
      },
    });
  };

  const handleBack = () => {
    navigate("/forgot-password");
  };

  const handleResendOtp = () => {
    /*
      Backend/API later:

      await resendOtp({
        email
      });
    */

    setOtp("");
    setOtpError("");

    console.log("Demo OTP resent");
  };

  return (
    <div className="verify-page">

      <div className="verify-card">

        {/* BACK BUTTON */}

        <button
          type="button"
          className="verify-back-btn"
          onClick={handleBack}
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        {/* ICON */}

        <div className="verify-icon">
          <ShieldCheck size={27} />
        </div>

        {/* HEADING */}

        <h2>Verify OTP</h2>

        <p className="verify-subtitle">
          Enter the 6-digit OTP sent to your
          registered email address.
        </p>

        {email && (
          <p className="verify-email">
            {email}
          </p>
        )}

        {/* FORM */}

        <form
          onSubmit={handleVerifyOtp}
          noValidate
        >

          <div className="otp-group">

            <label htmlFor="otp">
              Enter OTP
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={handleOtpChange}
              maxLength={6}
              aria-invalid={Boolean(otpError)}
              aria-describedby={
                otpError
                  ? "otp-error"
                  : undefined
              }
            />

            {otpError && (
              <p
                id="otp-error"
                className="otp-error"
                role="alert"
              >
                {otpError}
              </p>
            )}

          </div>

          <button
            type="submit"
            className="verify-btn"
          >
            Verify OTP
          </button>

        </form>

        {/* RESEND */}

        <div className="resend-section">

          <span>
            Didn't receive the OTP?
          </span>

          <button
            type="button"
            onClick={handleResendOtp}
          >
            Resend OTP
          </button>

        </div>

      </div>

    </div>
  );
};

export default VerifyOtp;