import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Login.css";
import LoginImage from "../../assets/images/screenshot.png";
import SignInWithSocialMedia from "./SignInWithSocialMedia"; // Combined Google and GitHub Sign-In component import
import { useNavigate } from "react-router-dom"; // useNavigate for redirect

const LoginPage: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated"); // Example of checking auth status (use your actual method)

    // If the user is authenticated, redirect to dashboard
    if (isAuthenticated === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="login min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container position-relative">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div
              className="card shadow-lg p-4 border-0"
              style={{
                transform: isHovered ? "translateY(-5px)" : "translateY(0)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="text-center">
                <div className="image-wrapper position-relative mb-4">
                  <img
                    src={LoginImage}
                    alt="Login Illustration"
                    className="login-image"
                    style={{
                      maxWidth: "300px",
                      transform: isHovered ? "scale(1.02)" : "scale(1)",
                      transition: "transform 0.9s ease",
                    }}
                  />
                </div>
              </div>

              {/* Social Media Login Buttons */}
              <div className="text-center mt-4 mb-4">
                <SignInWithSocialMedia />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .login {
            position: relative;
            overflow: hidden;
            background: linear-gradient(135deg, rgb(12, 20, 69), rgb(254, 212, 160),rgb(105, 62, 9));
            background-size: 400% 400%;
            animation: gradientShift 5s infinite ease-in-out;
          }
          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          .card {
            width: 500px; /* Increase width */
            height: 500px; /* Increase height */
            padding: 2rem; /* Add more padding inside */
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
          }


          .login-image {
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }

          .google-btn-wrapper,
          .github-btn-wrapper {
            transition: transform 0.3s ease;
          }

          .google-btn-wrapper:hover,
          .github-btn-wrapper:hover {
            transform: translateY(-2px);
            filter: brightness(1.05);
          }

          .google-btn-wrapper:active,
          .github-btn-wrapper:active {
            transform: translateY(0);
          }

          h2, .text-white {
            color: white !important;
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;
