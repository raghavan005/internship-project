import React, { useState, useRef } from "react";
import { TrendingUp, Wallet, Coins, Diamond } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import video from "../../assets/images/welcome speech (1).mp4";
import "./welcome.css";
import logo from "../../assets/images/screenshot.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Container animation with stagger for child elements
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.3 },
  },
};

// Header animation: slide from top
const headerVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

// Video section animation: slide from left
const videoVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

// Assets container animation: slide from right with staggered children
const assetsContainerVariants = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

// Individual card animation: fade in & scale up; interactive hover/tap effects
const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: { y: -10, scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.9)" },
  tap: { scale: 0.95 },
};

// Button animation for hover and tap
const buttonVariants = {
  hover: { scale: 1.1, boxShadow: "0 0 25px rgba(255,255,255,0.9)" },
  tap: { scale: 0.95 },
};

function Welcome() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div
      className="main-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background with motion (cycling images) */}
      <div className="background-motion"></div>

      {/* Header with glassy finish */}
      <header className="header glass">
        <motion.img
          src={logo}
          alt="Providence Trade Logo"
          className="logo"
          variants={headerVariants}
        />
      </header>

      <main className="container-fluid">
        <div className="row content-row">
          {/* Video Section */}
          <div className="col-md-5 video-section">
            <motion.div
              className="video-container glass"
              variants={videoVariants}
            >
              <video
                ref={videoRef}
                className="video"
                autoPlay
                loop
                muted={isMuted}
                playsInline
              >
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button onClick={handleMuteToggle} className="mute-button">
                {isMuted ? "🔇" : "🔊"}
              </button>
            </motion.div>
          </div>

          {/* Trading Assets Section */}
          <div className="col-md-5 assets-section">
            <motion.div
              className="assets-container glass"
              variants={assetsContainerVariants}
            >
              <h2 className="assets-title">Trading Assets</h2>
              <div className="row assets-cards">
                <motion.div
                  className="col-6 card glass"
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <TrendingUp className="icon" size={40} />
                  <h3 className="card-title">Stocks</h3>
                  <p className="card-text">Trade global equity markets</p>
                </motion.div>

                <motion.div
                  className="col-6 card glass"
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Wallet className="icon" size={40} />
                  <h3 className="card-title">Bonds</h3>
                  <p className="card-text">Government & corporate securities</p>
                </motion.div>
              </div>
              <div className="row assets-cards">
                <motion.div
                  className="col-6 card glass"
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Coins className="icon" size={40} />
                  <h3 className="card-title">Commodities</h3>
                  <p className="card-text">Gold, silver, and raw materials</p>
                </motion.div>

                <motion.div
                  className="col-6 card glass"
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Diamond className="icon" size={40} />
                  <h3 className="card-title">Mutual Funds</h3>
                  <p className="card-text">Diversified investment portfolios</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Get Started Button with interactive motion */}
      <motion.button
        className="get-started-btn glass"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => navigate("/login")}
      >
        Get Started
      </motion.button>
    </motion.div>
  );
}

export default Welcome;
