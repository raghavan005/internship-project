import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/images/screenshot.png";
import { motion } from "framer-motion";
import { useAuth } from "../dashboard/AuthContext";
import CustomBox from "./buysell";
import Boxcontent from "./box";
import SearchBox from "../dashboard/SearchBox";
import Portfolio from "./portfolio/portfoliodata";
import BondSellingPage from "../dashboard/bonds/bond";
import { signOut } from "firebase/auth";
import { auth } from "../Login/firebase";
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
  { name: "Bonds", icon: <BookOpen size={20} /> },
  
];


const WalletDropdown = () => {
  const { user, userData, updateWallet } = useAuth();
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowWalletDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  if (!user || !userData) return null;

  const handleAddFunds = async () => {
    const amount = parseFloat(prompt("Enter amount to add:", "100") || "0");
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount to add.");
      return;
    }
    try {
      await updateWallet(amount);
      alert(`Added ₹${amount} successfully!`);
    } catch (error) {
      console.error("Error adding funds:", error);
      alert("Failed to add funds. Please try again.");
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
      await updateWallet(-amount);
      alert(`Withdrawn ₹${amount} successfully!`);
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      alert("Failed to withdraw funds. Please try again.");
    }
  };

  return (
    <div className="wallet-dropdown" ref={dropdownRef}>
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
        <CreditCard size={24} className="wallet-icon" />
        {userData?.walletAmount?.toFixed(2) || "0.00"}
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
            <strong>₹{userData?.walletAmount?.toFixed(2) || "0.00"}</strong>
          </p>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item wallet-add" onClick={handleAddFunds}>
            ➕ Add Funds
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
// User Profile Drop-down Component

const UserProfileDropdown = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  if (!user) return null;

  const handleLogout = async () => {
    console.log("Logout button clicked");
    try {
      await signOut(auth); 
      localStorage.removeItem("yourAuthToken");
      console.log("Signed out and local storage cleared");
      navigate("/login"); 
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to sign out. Please try again.");
    }
  };


  return (
    <div
      className="user-profile-dropdown"
      style={{ position: "relative", display: "inline-block" }}
      ref={dropdownRef}
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
        style={{ display: "flex", alignItems: "center" }}
      >
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt="Profile"
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              marginRight: "8px",
              objectFit: "cover",
            }}
          />
        ) : (
          <User size={24} style={{ marginRight: "8px" }} />
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
                src={user.profilePicture}
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
              <User size={30} style={{ marginRight: "8px" }} />
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
          <button className="dropdown-item text-danger" onClick={handleLogout}>
            <LogOut size={18} className="me-1" /> Logout
          </button>
        </motion.div>
      )}
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const stocks = useStockData();

  // Renders content based on selected menu
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
            
              <div style={{ display: "flex", flex: 1, gap: "20px" }}>
                <div style={{ flex: 1 }}>
                  <Trading />
                </div>
                <div style={{ flex: 1 }}>
                  <Boxcontent />
                </div>
              </div>

              
              <div style={{ flex: 1 }}>
                <PurchaseHistory />
              </div>
            </div>
          </>
        );
      case "Watchlist":
        return (
          <>
            <div className="watchlist-container">
              <Chart />
              <CustomBox />
            </div>
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
      case "Bonds":
        return (
          <>
            <BondSellingPage />
          </>
        );
      default:
        return <h2>Welcome to the App</h2>;
    }
  }, [activePage]);

  const memoizedStocks = useMemo(() => stocks || [], [stocks]);

  return (
    <div className="dashboard-container">
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

      <div
        className="user-navbar"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "5px 10px",
          height: "60px",
        }}
      >
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "clamp(300px, 80%, 500px)" }}>
            <SearchBox apiKey="HXYLHSGOWADTGDNR" />
          </div>
        </div>

        <div style={{ zIndex: 2, position: "relative" }}>
          <WalletDropdown />
        </div>

        <UserProfileDropdown />
      </div>
      <div className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="Providance Logo" className="sidebar-logo" />
        </div>
        <ul className="nav flex-column">
          {menuItems.map((item) => (
            <li key={item.name} className="nav-item">
              <motion.button
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 8,
                  duration: 0.1,
                }}
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
      <div className="main-content">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
