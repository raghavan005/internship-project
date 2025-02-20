import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/images/screenshot.png";
import { useAuth } from "../dashboard/AuthContext"; // ✅ Import Auth Context
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
} from "lucide-react";
import useStockData from "../hook/useStockData";
import Chart from "./chart";
import "./dashboard.css";
import Trading from "./symbol";

const menuItems = [
  { name: "Dashboard", icon: <TrendingUp size={20} /> },
  { name: "Watchlist", icon: <Briefcase size={20} /> },
  { name: "Mutual Funds", icon: <Wallet size={20} /> },
  { name: "Portfolio", icon: <FileText size={20} /> },
  { name: "Reports", icon: <BookOpen size={20} /> },
];

// ✅ User Profile Drop-down Component
const UserProfileDropdown = () => {
  const { user, logout } = useAuth(); // ✅ Fetch user & logout function
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null; // ✅ Hide dropdown if no user is logged in

  return (
    <div
      className="user-profile-dropdown"
      style={{ position: "relative", display: "inline-block" }}
    >
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-haspopup="true"
        aria-expanded={showDropdown}
      >
        <User size={24} style={{ marginRight: "8px" }} />
        {user.displayName || "User"}
      </button>

      {showDropdown && (
        <div
          className="dropdown-menu dropdown-menu-right"
          style={{ display: "block" }}
        >
          <h6 className="dropdown-header">{user.displayName || "User"}</h6>
          <p className="dropdown-item-text">{user.email || "No Email"}</p>
          <div className="dropdown-divider"></div>
          <button
            className="dropdown-item"
            onClick={() => navigate("/profile")}
          >
            <Edit size={18} className="me-1" /> Edit Profile
          </button>
          <button
            className="dropdown-item"
            onClick={() => navigate("/settings")}
          >
            <Settings size={18} className="me-1" /> Settings
          </button>
          <button className="dropdown-item text-danger" onClick={logout}>
            <LogOut size={18} className="me-1" /> Logout
          </button>
        </div>
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
        return <Trading />;
      case "Watchlist":
        return <Chart />;
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

      {/* ✅ User Profile Nav */}
      <div className="user-navbar">
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
              <button
                className={`nav-button ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => setActivePage(item.name)}
                aria-label={`Navigate to ${item.name}`}
              >
                {item.icon} <span className="nav-text">{item.name}</span>
              </button>
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
