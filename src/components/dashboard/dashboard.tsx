import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/images/screenshot.png";
import { motion } from "framer-motion";
import { useAuth } from "../dashboard/AuthContext"; // ✅ Import Auth Context
import CustomBox from "./buysell";
import Boxcontent from "./box";
import SearchBox from "../dashboard/SearchBox"; // Adjust the path if necessary
import Portfolio from "../dashboard/portfolio/data";
import {
  TrendingUp,
  Briefcase,
  Wallet,
  FileText,
  BookOpen,
  User,
  Edit,
  Settings,
  LogOut,
  CreditCard,
} from "lucide-react";
import useStockData from "../hook/useStockData";
import Chart from "./chart";
import "./dashboard.css";
import Trading from "./symbol";
import PurchaseHistory from "./PurchaseHistory";
import MutualFundsDashboard from "../dashboard/mutualfuns/mutualfunds";

const menuItems = [
  { name: "Dashboard", icon: <TrendingUp size={20} /> },
  { name: "Watchlist", icon: <Briefcase size={20} /> },
  { name: "Mutual Funds", icon: <Wallet size={20} /> },
  { name: "Portfolio", icon: <FileText size={20} /> },
  { name: "Reports", icon: <BookOpen size={20} /> },
];

// ✅ Wallet Dropdown Component
const WalletDropdown = () => {
  const { user, userData, updateWallet } = useAuth(); // Access userData and updateWallet

  const [showWalletDropdown, setShowWalletDropdown] = useState(false);

  useEffect(() => {
    // No need to initialize walletAmount here. It's coming from userData.
  }, [userData]); // Re-run effect when userData changes

  if (!user || !userData) return null; // Hide if no user or userData is available

  const handleAddFunds = async () => {
    try {
      await updateWallet(100); // Use updateWallet from context
      alert("Added ₹100 successfully!"); // Provide user feedback
    } catch (error) {
      console.error("Error adding funds:", error);
      alert("Failed to add funds. Please try again."); // Handle errors
    }
  };

  const handleWithdrawFunds = async () => {
    const amount = parseFloat(
      prompt("Enter amount to withdraw:", "100") || "0"
    );
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount to withdraw.");
      return;
    }
    try {
      await updateWallet(-amount); // Use updateWallet with a negative amount
      alert(`Withdrawn ₹${amount} successfully!`);
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      alert("Failed to withdraw funds. Please try again.");
    }
  };

  return (
    <div className="wallet-dropdown">
      <motion.button
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="btn btn-warning dropdown-toggle wallet-button"
        type="button"
        onClick={() => setShowWalletDropdown(!showWalletDropdown)}
        aria-haspopup="true"
        aria-expanded={showWalletDropdown}
      >
        <CreditCard size={24} className="wallet-icon" />$
        {userData?.walletAmount?.toFixed(2) || "0.00"}{" "}
      </motion.button>

      {showWalletDropdown && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="dropdown-menu dropdown-menu-right wallet-menu"
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h6 className="dropdown-header">Wallet Balance</h6>
          <p className="dropdown-item-text wallet-balance">
            <strong>₹{userData?.walletAmount?.toFixed(2) || "0.00"}</strong>{" "}
          </p>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item wallet-add" onClick={handleAddFunds}>
            ➕ Add ₹100
          </button>
          <button
            className="dropdown-item wallet-withdraw"
            onClick={handleWithdrawFunds}
          >
            ➖ Withdraw
          </button>
        </motion.div>
      )}
    </div>
  );
};

// ✅ User Profile Drop-down Component
const UserProfileDropdown = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  return (
    <div
      className="user-profile-dropdown"
      style={{ position: "relative", display: "inline-block" }}
    >
      <motion.button
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="btn btn-secondary dropdown-toggle"
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-haspopup="true"
        aria-expanded={showDropdown}
        style={{ display: "flex", alignItems: "center" }} // Align icon and name/picture
      >
        {user.profilePicture ? (
          <img
            src={user.profilePicture} // Assuming your user object has profilePicture URL
            alt="Profile"
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              marginRight: "8px",
              objectFit: "cover", // ensures the image fits within the bounds
            }}
          />
        ) : (
          <User size={24} style={{ marginRight: "8px" }} /> // Fallback if no profile picture
        )}
        {user.displayName || "User"}
      </motion.button>

      {showDropdown && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="dropdown-menu dropdown-menu-right"
          style={{ display: "block" }}
        >
          <div
            style={{ display: "flex", alignItems: "center", padding: "8px" }}
          >
            {user.profilePicture ? (
              <img
                src={user.profilePicture} // Assuming your user object has profilePicture URL
                alt="Profile"
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  marginRight: "8px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <User size={30} style={{ marginRight: "8px" }} /> // Fallback if no profile picture
            )}
            <h6 className="dropdown-header">{user.displayName || "User"}</h6>
          </div>
          <p className="dropdown-item-text">{user.email || "No Email"}</p>
          <div className="dropdown-divider"></div>
          <motion.button
            className="dropdown-item"
            onClick={() => navigate("/profile")}
          >
            <Edit size={18} className="me-1" /> Edit Profile
          </motion.button>
          <button
            className="dropdown-item"
            onClick={() => navigate("/settings")}
          >
            <Settings size={18} className="me-1" /> Settings
          </button>
          <button
            className="dropdown-item text-danger"
            onClick={() => {
              console.log("Logout button clicked");
              setTimeout(() => {
                navigate("/login");
              }, 100);
            }}
          >
            <LogOut size={18} className="me-1" /> Logout
          </button>
        </motion.div>
      )}
    </div>
  );
};

// ✅ Dashboard Component
const Dashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const stocks = useStockData();

  // ✅ Renders content based on selected menu
  const renderContent = useCallback(() => {
    switch (activePage) {
      case "Dashboard":
        return (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                padding: "20px",
              }}
            >
              {/* Top Section - Trading & Boxcontent */}
              <div style={{ display: "flex", flex: 1, gap: "20px" }}>
                <div style={{ flex: 1 }}>
                  <Trading />
                </div>
                <div style={{ flex: 1 }}>
                  <Boxcontent />
                </div>
              </div>

              {/* Bottom Section - Purchase History */}
              <div style={{ flex: 1 }}>
                <PurchaseHistory />
              </div>
            </div>
          </>
        );
      case "Watchlist":
        return (
          <>
            <Chart />
            <CustomBox />
          </>
        );
      case "Mutual Funds":
        return (
          <>
            <MutualFundsDashboard />
          </>
        );
      case "Portfolio":
        return (
          <>
            <Portfolio />
          </>
        );
      case "Reports":
        return <h2>📑 Reports Content</h2>;
      default:
        return <h2>Welcome to the App</h2>;
    }
  }, [activePage]);

  const memoizedStocks = useMemo(() => stocks || [], [stocks]);

  return (
    <div className="dashboard-container">
      {/* ✅ Stock Ticker Navbar */}
      <div className="stock-ticker-bar">
        <div className="ticker-container">
          {memoizedStocks.length > 0 ? (
            memoizedStocks.map((stock, index) => (
              <div key={index} className="ticker-item">
                <span className="stock-name">{stock.name}</span>
                <span className="stock-value">{stock.value}</span>
                <span
                  className={stock.positive ? "text-success" : "text-danger"}
                >
                  {stock.change}
                </span>
              </div>
            ))
          ) : (
            <p className="loading-message">Loading stock data...</p>
          )}
        </div>
      </div>

      {/* ✅ User Profile & Wallet Navbar */}
      <div
        className="user-navbar"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "5px 10px",
          height: "60px",
        }}
      >
        {/* Search Box Wrapper */}
        <div
          style={{
            flexGrow: 1, // Allows it to take available space
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "clamp(300px, 80%, 500px)" }}>
            <SearchBox apiKey="HXYLHSGOWADTGDNR" />
          </div>
        </div>

        {/* Wallet Dropdown */}
        <div style={{ zIndex: 2, position: "relative" }}>
          <WalletDropdown />
        </div>

        {/* User Profile Dropdown */}
        <UserProfileDropdown />
      </div>

      {/* ✅ Sidebar Navigation */}
      <div className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="Providance Logo" className="sidebar-logo" />
        </div>
        <ul className="nav flex-column">
          {menuItems.map((item) => (
            <li key={item.name} className="nav-item">
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className={`nav-button ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => setActivePage(item.name)}
                aria-label={`Navigate to ${item.name}`}
              >
                {item.icon} <span className="nav-text">{item.name}</span>
              </motion.button>
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ Main Content */}
      <div className="main-content">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
