import React, { useState, useCallback, useMemo,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/images/screenshot.png";
import {motion} from "framer-motion"
import { useAuth } from "../dashboard/AuthContext"; // ✅ Import Auth Context
import CustomBox from "./buysell"
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
import PurchaseHistory from "./PurchaseHistory"
import Box from "./userdetail";



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
  const { user } = useAuth(); // ✅ Fetch user
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null; // ✅ Hide dropdown if no user is logged in

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
      >
        <User size={24} style={{ marginRight: "8px" }} />
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
          <h6 className="dropdown-header">{user.displayName || "User"}</h6>
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
            onClick={() => navigate("/login")} // Redirect to login page
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
            <Trading />
            <PurchaseHistory />
            <Box />
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
        return <h2>💰 Mutual Funds Content</h2>;
      case "Portfolio":
        return <h2>📂 Portfolio Content</h2>;
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
      <div className="user-navbar">
        <WalletDropdown />
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
