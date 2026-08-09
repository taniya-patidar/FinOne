import React, { useState , useEffect} from "react";
import "./Login.css";

// import finoneImage from "../../assets/FinOne.jpg"; 

import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  useEffect(()=>{
    document.body.style.overflow = "hidden";
    return ()=>{
    document.body.style.overflow = "auto";

    };
  }, [])
  const navigate = useNavigate();



  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState("");

 

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength("");
      return;
    }

    // Weak
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

    checkPasswordStrength(value);

    if (value.trim()) {
      setPasswordError("");
    }
  };


  const handleLogin = (e) => {
    e.preventDefault();

    
    setUsernameError("");
    setPasswordError("");

  
    if (!username.trim()) {
      setUsernameError("Please enter your username");
      return;
    }

  
    if (!password.trim()) {
      setPasswordError("Please enter your password");
      return;
    }

    console.log("Username:", username);
    console.log("Password:", password);

    navigate("/dashboard");
  };

  const handleGoogleSuccess = (credentialResponse) => {
  console.log("Google Login Success:", credentialResponse);

  navigate("/dashboard");
};

const handleGoogleError = () => {
  console.log("Google Login Failed");
};

  return (
    <div className="login-page">

       {/* left side  */}

      <div className="login-left">
        {/* <img
          src={finoneImage}
          alt="FinOne Loan Management System"
        /> */}
        <h1>Finon </h1>
        <h2>Loan Management System</h2>
      </div>

      {/* right side  */}

      <div className="login-right">

        <div className="login-card">

          <h2>Welcome Back!</h2>

          <p className="login-subtitle">
            Sign in to continue to FinOne
          </p>

          

          <form onSubmit={handleLogin}>

            

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
              />

              {usernameError && (
                <p className="field-error">
                  {usernameError}
                </p>
              )}

            </div>

          

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="password-wrapper">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
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
                  className={`password-strength ${passwordStrength.toLowerCase()}`}
                >
                  {passwordStrength === "Weak" &&
                    "Weak password"}

                  {passwordStrength === "Medium" &&
                    "Medium password"}

                  {passwordStrength === "Strong" &&
                    "Strong password"}
                </p>
              )}


              {passwordError && (
                <p className="field-error">
                  {passwordError}
                </p>
              )}

            </div>

   

            <div className="login-options">

              <label className="remember-me">

                <input type="checkbox" />

                <span>
                  Remember me
                </span>

              </label>

              <button
                type="button"
                className="forgot-btn"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>

            </div>

        

            <button
              type="submit"
              className="login-btn"
            >
              Login
            </button>

          </form>


          <div className="divider">
            <span>OR</span>
          </div>

          

          {/* <button
            type="button"
            className="google-btn"
          >
            <span className="google-icon">
              G
            </span>

            <span>
              Login with Google
            </span>
          </button> */}

          <div className="google-login-container">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </div>


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