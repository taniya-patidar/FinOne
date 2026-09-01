
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

  const [usernameError, setUsernameError] =
    useState("");
  const [passwordError, setPasswordError] =
    useState("");
  const [formError, setFormError] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  /*
   * ============================================================
   * PAGE SETUP
   * ============================================================
   */

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  /*
   * ============================================================
   * REMEMBERED USERNAME
   * ============================================================
   */

  useEffect(() => {
    const savedUsername =
      localStorage.getItem(
        "rememberedUsername"
      );

    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  /*
   * ============================================================
   * INPUT HANDLERS
   * ============================================================
   */

  const handleUsernameChange = (e) => {
    const value = e.target.value;

    setUsername(value);

    if (value.trim()) {
      setUsernameError("");
    }

    if (formError) {
      setFormError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    setPassword(value);

    if (value.trim()) {
      setPasswordError("");
    }

    if (formError) {
      setFormError("");
    }
  };

  /*
   * ============================================================
   * FORM VALIDATION
   * ============================================================
   */

  const validateForm = () => {
    let isValid = true;

    setUsernameError("");
    setPasswordError("");
    setFormError("");

    const trimmedUsername =
      username.trim();

    if (!trimmedUsername) {
      setUsernameError(
        "Please enter your username or email"
      );

      isValid = false;
    }

    if (!password) {
      setPasswordError(
        "Please enter your password"
      );

      isValid = false;
    }

    return isValid;
  };

  /*
   * ============================================================
   * CREATE CURRENT USER SESSION
   * ============================================================
   *
   * This is the temporary frontend authentication
   * layer.
   *
   * Later, when backend is connected, this will be
   * replaced by the authenticated user returned
   * from the backend.
   */

  const createCurrentUserSession = (
    user,
    loginType = "local"
  ) => {
    const currentUser = {
      id:
        user.id ||
        user.googleId ||
        `USR-${Date.now()}`,

      fullName:
        user.fullName ||
        user.name ||
        "User",

      username:
        user.username || "",

      email:
        user.email || "",

      phone:
        user.phone || "",

      avatar:
        user.avatar ||
        user.picture ||
        "",

      authProvider: loginType,

      loggedInAt:
        new Date().toISOString(),
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(currentUser)
    );

    /*
     * Notify Header and other components
     * immediately.
     */
    window.dispatchEvent(
      new Event("currentUserUpdated")
    );

    return currentUser;
  };

  /*
   * ============================================================
   * NORMAL LOGIN
   * ============================================================
   */

  const handleLogin = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const savedUserRaw =
        localStorage.getItem(
          "registeredUser"
        );

      if (!savedUserRaw) {
        setFormError(
          "No registered user found. Please register first!"
        );

        setIsLoading(false);

        return;
      }

      const savedUser =
        JSON.parse(savedUserRaw);

      const inputVal =
        username.trim().toLowerCase();

      const savedUsername =
        String(
          savedUser.username || ""
        ).toLowerCase();

      const savedEmail =
        String(
          savedUser.email || ""
        ).toLowerCase();

      const isUsernameMatch =
        inputVal === savedUsername ||
        inputVal === savedEmail;

      const isPasswordMatch =
        password === savedUser.password;

      if (
        isUsernameMatch &&
        isPasswordMatch
      ) {

        /*
         * Remember username
         */
        if (rememberMe) {
          localStorage.setItem(
            "rememberedUsername",
            username.trim()
          );
        } else {
          localStorage.removeItem(
            "rememberedUsername"
          );
        }

        /*
         * Create logged-in session
         */
        createCurrentUserSession(
          savedUser,
          "local"
        );

        alert("Login Successful!");

        navigate("/dashboard");

      } else {

        setFormError(
          "Invalid Username/Email or Password!"
        );

      }

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      setFormError(
        "Something went wrong during login."
      );

    } finally {

      setIsLoading(false);

    }
  };

  /*
   * ============================================================
   * GOOGLE CREDENTIAL DECODER
   * ============================================================
   *
   * Frontend-only implementation.
   *
   * Later the backend should verify the Google
   * credential instead of trusting decoded data
   * directly in the browser.
   */

  const decodeGoogleCredential = (
    credential
  ) => {

    try {

      if (!credential) {
        return null;
      }

      const parts =
        credential.split(".");

      if (parts.length !== 3) {
        return null;
      }

      const base64Url =
        parts[1];

      const base64 =
        base64Url
          .replace(/-/g, "+")
          .replace(/_/g, "/");

      const paddedBase64 =
        base64.padEnd(
          base64.length +
            ((4 -
              (base64.length % 4)) %
              4),
          "="
        );

      const decoded =
        atob(paddedBase64);

      const bytes =
        Uint8Array.from(
          decoded,
          (character) =>
            character.charCodeAt(0)
        );

      const jsonString =
        new TextDecoder().decode(
          bytes
        );

      return JSON.parse(
        jsonString
      );

    } catch (error) {

      console.error(
        "Google credential decoding failed:",
        error
      );

      return null;
    }
  };

  /*
   * ============================================================
   * GOOGLE LOGIN
   * ============================================================
   */

  const handleGoogleSuccess = (
    credentialResponse
  ) => {

    try {

      const credential =
        credentialResponse?.credential;

      if (!credential) {

        setFormError(
          "Unable to get Google account information."
        );

        return;
      }

      const googleUser =
        decodeGoogleCredential(
          credential
        );

      if (!googleUser) {

        setFormError(
          "Unable to read Google account information."
        );

        return;
      }

      /*
       * Google normally provides:
       *
       * name
       * given_name
       * family_name
       * email
       * picture
       * sub
       */

      const googleUserData = {

        id:
          googleUser.sub ||
          `GOOGLE-${Date.now()}`,

        googleId:
          googleUser.sub || "",

        fullName:
          googleUser.name ||
          googleUser.given_name ||
          "Google User",

        email:
          googleUser.email || "",

        avatar:
          googleUser.picture || "",

        username:
          googleUser.email
            ? googleUser.email.split("@")[0]
            : "",

        phone: "",

      };

      /*
       * Store current Google user
       */
      createCurrentUserSession(
        googleUserData,
        "google"
      );

      navigate("/dashboard");

    } catch (error) {

      console.error(
        "Google Login error:",
        error
      );

      setFormError(
        "Something went wrong with Google Login."
      );
    }
  };

  /*
   * ============================================================
   * GOOGLE LOGIN ERROR
   * ============================================================
   */

  const handleGoogleError = () => {

    console.error(
      "Google Login Failed"
    );

    setFormError(
      "Google Login failed. Please try again."
    );
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (

    <div className="login-page">

      {/* LEFT IMAGE */}

      <div className="login-left">

        <img
          src={finoneImage}
          alt="FinOne Loan Management System"
        />

      </div>

      {/* RIGHT SIDE */}

      <div className="login-right">

        <div className="login-card">

          <h2>
            Welcome Back!
          </h2>

          <p className="login-subtitle">
            Sign in to continue to FinOne
          </p>

          {formError && (
            <p className="field-error form-level-error">
              {formError}
            </p>
          )}

          {/* NORMAL LOGIN */}

          <form
            onSubmit={handleLogin}
            noValidate
          >

            {/* USERNAME */}

            <div className="form-group">

              <label htmlFor="username">
                Username or Email
              </label>

              <input
                id="username"
                type="text"
                placeholder="Enter username or email"
                value={username}
                onChange={
                  handleUsernameChange
                }
                autoComplete="username"
                aria-invalid={Boolean(
                  usernameError
                )}
              />

              {usernameError && (
                <p className="field-error">
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
                  onChange={
                    handlePasswordChange
                  }
                  autoComplete="current-password"
                  aria-invalid={Boolean(
                    passwordError
                  )}
                />

                <button
                  type="button"
                  className="password-toggle"
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

              {passwordError && (
                <p className="field-error">
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
                    setRememberMe(
                      e.target.checked
                    )
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
                  navigate(
                    "/forgot-password"
                  )
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

              {isLoading
                ? "Signing in..."
                : "Login"}

            </button>

          </form>

          {/* DIVIDER */}

          <div className="divider">
            <span>
              OR
            </span>
          </div>

          {/* GOOGLE */}

          <div className="google-login-container">

            <GoogleLogin
              onSuccess={
                handleGoogleSuccess
              }
              onError={
                handleGoogleError
              }
            />

          </div>

          {/* REGISTER */}

          <div className="register-link">

            <span>
              Don't have an account?
            </span>

            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
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

