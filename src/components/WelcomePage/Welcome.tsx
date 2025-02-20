import React, { useState, useRef } from "react";
import { TrendingUp, Wallet, Coins, Diamond } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import video from "../../assets/images/welcome speech (1).mp4";
import "./welcome.css";
import logo from "../../assets/images/final.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import useNavigate

function Welcome() {
  
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const cardStyle = (index: number) => ({
    transition: "all 0.3s ease",
    cursor: "pointer",
    transform: hoveredCard === index ? "translateY(-5px)" : "none",
    boxShadow:
      hoveredCard === index ? "0 10px 20px rgba(0, 0, 0, 0.2)" : "none",
  });

  return (
    <motion.div>
      <div className="bg-dark flex p-2 text-white flex position='center'">
        {/* Header */}
        <header className="header">
          <img
            src={logo}
            alt="Providence Trade Logo"
            className="w-100"
            style={{ height: "300px", objectFit: "contain" }}
          />
        </header>

        {/* Main Content */}
        <main
          className="container-fluid d-flex justify-content-center align-items-center pt-10"
          style={{ backgroundColor: "rgb(7, 16, 63)", minHeight: "100vh" }}
        >
          <div className="row col-1 pt-5 w-100 gap-3 justify-content-center">
            {/* Market Analysis (Video) */}
            <div className="col-md-5 d-flex justify-content-center align-items-center">
              <div className="position-relative video-container">
                <video
                  ref={videoRef}
                  className="w-100 h-100 object-fit-cover rounded-3"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                >
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {/* Mute Button */}
                <button onClick={handleMuteToggle} className="mute-button">
                  {isMuted ? (
                    <span role="img" aria-label="unmute">
                      🔇
                    </span>
                  ) : (
                    <span role="img" aria-label="mute">
                      🔊
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Trading Assets */}
            <div className="col-md-5 d-flex flex-column align-items-center">
              <div className="bg-rgb(7, 16, 63) text-white rounded-3 shadow-lg p-4 w-100">
                <h2 className="text-center fs-2 fw-bold mb-4">
                  Trading Assets
                </h2>

                {/* Trading Assets Grid */}
                <div className="row w-100 gap-3 mb-3">
                  <div
                    className="col-6 d-flex justify-content-center align-items-center card"
                    style={{
                      ...cardStyle(1),
                      background: "transparent",
                      backdropFilter: "blur(30px)",
                    }}
                    onMouseEnter={() => setHoveredCard(1)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <TrendingUp className="text-white" size={40} />
                    <h3 className="fs-5 fw-bold text-white mb-2">Stocks</h3>
                    <p className="text-white">Trade global equity markets</p>
                  </div>

                  <div
                    className="col-6 d-flex justify-content-center align-items-center card"
                    style={{ ...cardStyle(2), background: "transparent" }}
                    onMouseEnter={() => setHoveredCard(2)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Wallet className="text-white" size={40} />
                    <h3 className="fs-5 fw-bold text-white mb-2">Bonds</h3>
                    <p className="text-white">
                      Government & corporate securities
                    </p>
                  </div>
                </div>

                <div className="row w-100 gap-3">
                  <div
                    className="col-6 d-flex justify-content-center align-items-center card"
                    style={{ ...cardStyle(3), background: "transparent" }}
                    onMouseEnter={() => setHoveredCard(3)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Coins className="text-white" size={40} />
                    <h3 className="fs-5 fw-bold text-white mb-2">
                      Commodities
                    </h3>
                    <p className="text-white">
                      Gold, silver, and raw materials
                    </p>
                  </div>

                  <div
                    className="col-6 d-flex justify-content-center align-items-center card"
                    style={{ ...cardStyle(4), background: "transparent" }}
                    onMouseEnter={() => setHoveredCard(4)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Diamond className="text-white" size={40} />
                    <h3 className="fs-5 fw-bold text-white mb-2">
                      Mutual Funds
                    </h3>
                    <p className="text-white">
                      Diversified investment portfolios
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Get Started Button */}
        <motion.button
        whileHover={{scale:1.3}}
        whileTap={{scale:0.9}}
          className="get-started-btn"
          onClick={() => (window.location.href = "/login")}
        >
          Get Started
        </motion.button>
      </div>
    </motion.div>
  );
 
}
 export default Welcome;