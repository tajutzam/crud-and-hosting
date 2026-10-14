import React, { useState } from "react";
import "./Login.css";
import dishineLogo from "../../assets/Dishine Logo.png";
import { NavLink } from "react-router-dom";

import EyeFill from "../../assets/eye-fill.svg";
import EyeShut from "../../assets/eye-slash.svg";

function Login() {

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div>
      <div className="register">
        <div className="container-xl row">
          <div className="col-7 m-auto d-none d-lg-flex">
            <img src={dishineLogo} className="w-75" alt="Dishine Logo" />
          </div>
          <div className="col-lg-5 col-sm-10 d-flex m-auto justify-content-center">
            <form className="form">
              <h3 className="mb-3">Login to your account</h3>
              <p>Email</p>
              <input
                className="mb-3 form-input"
                type="email"
                placeholder="Enter your email"
              />

              {/* 🔑 New container for Password label and Forgot link */}
              <div className="password-header">
                <p>Password</p>
                <a href="" className="forgot-link ms-2">
                  Forgot ?
                </a>
              </div>

              <div className="password-input-wrapper mb-4">
                <input
                  className="form-input password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                />
                <span
                  className="password-toggle-icon"
                  onClick={togglePasswordVisibility}
                >
                  <img
                    src={showPassword ? EyeFill : EyeShut}
                    alt={showPassword ? "Hide Password" : "Show Password"}
                    className="eye-icon-img"
                  />
                </span>
              </div>

              <button className="button mb-3" type="submit">
                Login Account
              </button>
              <p className="text-center">
                Don't Have An Account?
                <NavLink
                  to="/Register"
                  className="link ms-2"
                  style={{ width: "35px" }}
                >
                  Sign Up
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
