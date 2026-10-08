import React, { useEffect, useState } from "react";
import { CheckCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    /*
     * ============================================================
     * FRONTEND LOGOUT
     * ============================================================
     * For now, authentication is handled using localStorage.
     *
     * When the backend is connected, this is the place where
     * the real logout/API request can be added.
     */

    const performLogout = () => {
      try {
        // Remove current login/session information
        localStorage.removeItem("currentUser");
        localStorage.removeItem("authUser");
        localStorage.removeItem("loggedInUser");

        /*
         * Do NOT remove:
         * - registeredUser
         * - customers
         * - loanApplications
         *
         * These are application data and should remain available
         * after logout.
         */

        // Notify other open components/tabs
        window.dispatchEvent(new Event("authUpdated"));

        setIsLoggingOut(false);

        // Redirect to login page
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1200);
      } catch (error) {
        console.error("Logout error:", error);

        setIsLoggingOut(false);

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1200);
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {isLoggingOut ? (
          <>
            <div style={styles.iconWrapper}>
              <LogOut size={32} />
            </div>

            <h1 style={styles.title}>
              Signing out...
            </h1>

            <p style={styles.message}>
              Please wait while we securely sign you out.
            </p>

            <div style={styles.loader} />
          </>
        ) : (
          <>
            <div
              style={{
                ...styles.iconWrapper,
                ...styles.successIcon,
              }}
            >
              <CheckCircle size={32} />
            </div>

            <h1 style={styles.title}>
              Logged Out Successfully
            </h1>

            <p style={styles.message}>
              You have been successfully signed out of FinOne.
            </p>

            <p style={styles.redirectText}>
              Redirecting to login...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
    padding: "24px",
    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "42px 32px",
    textAlign: "center",
    boxShadow:
      "0 20px 50px rgba(15, 23, 42, 0.10)",
    border: "1px solid #e2e8f0",
    boxSizing: "border-box",
  },

  iconWrapper: {
    width: "72px",
    height: "72px",
    margin: "0 auto 22px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eff6ff",
    color: "#2563eb",
  },

  successIcon: {
    background: "#ecfdf5",
    color: "#10b981",
  },

  title: {
    margin: "0 0 10px",
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
  },

  message: {
    margin: "0 auto",
    maxWidth: "320px",
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#64748b",
  },

  redirectText: {
    marginTop: "20px",
    fontSize: "13px",
    color: "#94a3b8",
  },

  loader: {
    width: "28px",
    height: "28px",
    margin: "24px auto 0",
    border: "3px solid #dbeafe",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
    animation: "finoneLogoutSpin 0.8s linear infinite",
  },
};

export default Logout;