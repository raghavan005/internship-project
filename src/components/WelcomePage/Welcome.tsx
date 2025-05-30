import React, { useRef, useEffect } from "react";
import { TrendingUp, Wallet, Coins, Diamond } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import video from "../../assets/images/welcome speech (1).mp4";
import "./welcome.css";
import logo from "../../assets/images/screenshot.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LetterGlitch from "./animation/letterglitch";

const containerVariants = {
  hidden: { opacity: 0.1 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.3 },
  },
};

const headerVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const videoVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

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

const buttonVariants = {
  hover: { scale: 1.1, boxShadow: "0 0 25px rgba(255,255,255,0.9)" },
  tap: { scale: 0.95 },
};

function Welcome() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current
        .play()
        .catch((error) => console.error("Autoplay failed:", error));
    }
  }, []);

  return (
    <motion.div
      className="main-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
      >
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
          glitchColors={["red", "blue", "green"]}
        />
      </div>

      <header
        className="header glass"
        style={{ position: "relative", zIndex: 1 }}
      >
        <motion.img
          src={logo}
          alt="Providence Trade Logo"
          className="logo"
          variants={headerVariants}
        />
      </header>

      <main
        className="container-fluid"
        style={{ position: "relative", zIndex: 1 }}
      >
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
                playsInline
                muted={false}
                controls // Adding controls for debugging
              >
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </div>

          {/* Assets Section */}
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

      {/* Get Started Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          type: "spring",
          duration: 0.1,
        }}
        className="get-started-btn glass"
        onClick={() => navigate("/login")}
        style={{
          position: "fixed",
          bottom: "2rem",
          left: "calc(50% - 5rem)",
          zIndex: 1,
        }}
      >
        Get Started
      </motion.button>
    </motion.div>
  );
}

export default Welcome;
