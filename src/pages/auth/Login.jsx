import { useEffect, useState } from "react";
import "./Login.css";

import finoneImage from "../../assets/FinOne.jpeg";

import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Prevent page scrolling on desktop login screen
  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Restore original behavior when leaving page
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Load remembered username
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");

    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleUsernameChange = (e) => {
    const value = e.target.value;

    setUsername(value);

    if (value.trim()) {
      setUsernameError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    setPassword(value);

    if (value.trim()) {
      setPasswordError("");
    }
  };

  const validateForm = () => {
    let isValid = true;

    setUsernameError("");
    setPasswordError("");

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setUsernameError("Please enter your username");
      isValid = false;
    } else if (trimmedUsername.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Please enter your password");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      /*
        Backend authentication yahan connect hoga.

        Example:

        const response = await loginUser({
          username: username.trim(),
          password,
        });

        Backend successful login ke baad
        secure authentication/session handle karega.
      */

      if (rememberMe) {
        localStorage.setItem(
          "rememberedUsername",
          username.trim()
        );
      } else {
        localStorage.removeItem("rememberedUsername");
      }

      console.log("Username:", username.trim());

      // Temporary frontend navigation
      // Backend integration ke baad success response ke andar hoga.
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);

      setPasswordError(
        "Unable to login. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    console.log(
      "Google Login Success:",
      credentialResponse
    );

    // Google credential backend ko send hoga.
    navigate("/dashboard");
  };

  const handleGoogleError = () => {
    console.error("Google Login Failed");
  };

  return (
    <div className="login-page">

      {/* ================= LEFT IMAGE ================= */}

      <div className="login-left">
        <img
          src={finoneImage}
          alt="FinOne Loan Management System"
        />
      </div>

      {/* ================= RIGHT LOGIN ================= */}

      <div className="login-right">

        <div className="login-card">

          <h2>Welcome Back!</h2>

          <p className="login-subtitle">
            Sign in to continue to FinOne
          </p>

          <form
            onSubmit={handleLogin}
            noValidate
          >

            {/* USERNAME */}

            <div className="form-group">

              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={handleUsernameChange}
                autoComplete="username"
                aria-invalid={Boolean(usernameError)}
                aria-describedby={
                  usernameError
                    ? "username-error"
                    : undefined
                }
              />

              {usernameError && (
                <p
                  id="username-error"
                  className="field-error"
                  role="alert"
                >
                  {usernameError}
                </p>
              )}

            </div>

            {/* PASSWORD */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="password-wrapper">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby={
                    passwordError
                      ? "password-error"
                      : undefined
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
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

              {passwordError && (
                <p
                  id="password-error"
                  className="field-error"
                  role="alert"
                >
                  {passwordError}
                </p>
              )}

            </div>

            {/* OPTIONS */}

            <div className="login-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />

                <span>
                  Remember me
                </span>

              </label>

              <button
                type="button"
                className="forgot-btn"
                onClick={() =>
                  navigate("/forgot-password")
                }
              >
                Forgot Password?
              </button>

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>

          </form>

          {/* DIVIDER */}

          <div className="divider">
            <span>OR</span>
          </div>

          {/* GOOGLE LOGIN */}

          <div className="google-login-container">

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />

          </div>

          {/* REGISTER */}

          <div className="register-link">

            <span>
              Don't have an account?
            </span>

            <button
              type="button"
              onClick={() => navigate("/register")}
            >
              Register
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;