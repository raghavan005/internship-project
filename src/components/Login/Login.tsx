import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../Login.css";
import LoginImage from "../../assets/images/screenshot.png";
import SignInwithGoogle from "./signInWIthGoogle"; // Ensure correct import

const LoginPage: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="login-container min-vh-100 d-flex align-items-center justify-content-center">
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
                      transition: "transform 0.3s ease",
                    }}
                  />
                </div>
              </div>

              {/* Google Login Button */}
              <div className="text-center mt-4 mb-4">
                <SignInwithGoogle />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .login-container {
            position: relative;
            overflow: hidden;
            background: linear-gradient(135deg, rgb(12, 20, 69), rgb(254, 212, 160));
            background-size: 400% 400%;
            animation: gradientShift 8s infinite ease-in-out;
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
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border-radius: 12px;
          }

          .login-image {
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }

          .google-btn-wrapper {
            transition: transform 0.3s ease;
          }

          .google-btn-wrapper:hover {
            transform: translateY(-2px);
            filter: brightness(1.05);
          }

          .google-btn-wrapper:active {
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
