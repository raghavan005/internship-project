import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import LoginImage from "../../assets/images/screenshot.png";
import SignInWithSocialMedia from "./SignInWithSocialMedia";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LoginPage: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <motion.div className="login-container">
      <div className="login-wrapper">
        {/* Left Side - Image */}
        <motion.div
          className="login-image-container"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 1 }}
          transition={{ type:'spring',duration: 2,stiffness:300 }}
        >
          <img
            src={LoginImage}
            alt="Login Illustration"
            className="login-image"
          />
        </motion.div>

        {/* Right Side - Login */}
        <motion.div className="login-card">
          <motion.div
            className="card-content"
            style={{
              transform: isHovered ? "translateY(-5px)" : "translateY(0)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <h2 className="text-center">Welcome Back</h2>
            <div className="text-center mt-4 mb-4">
              <SignInWithSocialMedia />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style>
        {`

         @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&display=swap');

          .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(to right, #6D53DC, #DC5356);
            background-size: 400% 400%;
            animation: gradientShift 5s infinite ease-in-out;
            font-family: 'Montserrat', sans-serif;
          }

          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .login-wrapper {
            display: flex;
            width: 80%;
            max-width: 900px;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }

          .login-image-container {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
          }

          .login-image {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }

          .login-card {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
          }

          .card-content {
            width: 100%;
            text-align: center;
          }

          h2 {
            color: white;
            font-weight: bold;
          }
        `}
      </style>
    </motion.div>
  );
};

export default LoginPage;
