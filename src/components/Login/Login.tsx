import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../Login.css";
import SignInwithGoogle from "./signInWIthGoogle"; // Import Google Login Component

// Import the image correctly
import LoginImage from "../../assets/images/screenshot.png";

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg p-4">
              <div className="text-center">
                <img
                  src={LoginImage}
                  alt="Login Illustration"
                  className="login-image"
                />
                <h2 className="fw-bold">Login to your account</h2>
              </div>

              {/* Google Login Button */}
              <div className="text-center mt-3">
                <SignInwithGoogle />
              </div>

              <div className="text-center mt-3">
                <p>
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-decoration-none">
                    Sign up
                  </Link>
                </p>
                <Link to="/forgot-password" className="text-decoration-none">
                  Forgot Password?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
