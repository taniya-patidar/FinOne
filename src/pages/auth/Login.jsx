import React from "react";
import "./Login.css";
import finoneImage from "../../assets/FinOne.jpg";

const Login = () => {
  return (
    <div className="login-page">

      {/* Left Side */}
      <div className="login-left">
        <img src={finoneImage} alt="FinOne" />
      </div>

      {/* Right Side */}
      <div className="login-right">

        <div className="login-card">

          <h2>Welcome Back!</h2>
          <p>Sign in to continue to FinOne</p>

         
          <form>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
              />
            </div>

           
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <div className="login-options">

              <label>
                <input type="checkbox" />
                Remember me
              </label>

              <button type="button">
                Forgot Password?
              </button>

            </div>

           
            <button type="submit" className="login-btn">
              Login
            </button>

          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button className="google-btn">
            Login with Google
          </button>

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