import { useState, useEffect } from "react";
import "./VerifyOtp.css";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend OTP feature
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(countdown);
  }, [timer]);

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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      setOtpError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);

    try {
      /*
        BACKEND/API CONNECTION:

        const response = await verifyOtp({
          email,
          otp
        });
      */

      console.log("OTP Verified successfully for:", email);

      // Navigate to Reset Password page passing necessary state
      navigate("/reset-password", {
        state: {
          email,
          otpVerified: true,
        },
      });
    } catch (error) {
      console.error("OTP Verification failed:", error);
      setOtpError("Invalid or expired OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      /*
        BACKEND/API CONNECTION:

        await resendOtp({ email });
      */

      console.log("Resending OTP to:", email);
      setTimer(30);
      setCanResend(false);
      setOtpError("");
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      setOtpError("Failed to resend OTP. Please try again later.");
    }
  };

  const handleBack = () => {
    navigate("/forgot-password");
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
          <ShieldCheck size={32} />
        </div>

        {/* HEADING */}
        <h2>Verify OTP</h2>

        <p className="verify-subtitle">
          We have sent a 6-digit verification code to
        </p>

        {email && <p className="verify-email">{email}</p>}

        {/* FORM */}
        <form onSubmit={handleVerifyOtp} noValidate>
          <div className="verify-form-group">
            <label htmlFor="otp-input">Enter OTP</label>

            <input
              id="otp-input"
              type="text"
              inputMode="numeric"
              placeholder="123456"
              value={otp}
              onChange={handleOtpChange}
              maxLength={6}
              autoComplete="one-time-code"
              aria-invalid={Boolean(otpError)}
              aria-describedby={otpError ? "otp-error" : undefined}
            />

            {otpError && (
              <p id="otp-error" className="verify-field-error" role="alert">
                {otpError}
              </p>
            )}
          </div>

          {/* VERIFY BUTTON */}
          <button
            type="submit"
            className="verify-btn"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* RESEND SECTION */}
        <div className="resend-section">
          <span>Didn't receive code? </span>
          {canResend ? (
            <button
              type="button"
              className="resend-btn"
              onClick={handleResendOtp}
            >
              Resend OTP
            </button>
          ) : (
            <span className="resend-timer">Resend in {timer}s</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;