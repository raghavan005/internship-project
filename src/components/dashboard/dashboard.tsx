import React, { useState, useCallback, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/images/screenshot.png";
import {
  TrendingUp,
  Briefcase,
  Wallet,
  FileText,
  BookOpen,
  User,
} from "lucide-react";
import useStockData from "../hook/useStockData";
import Chart from "./chart";
import "./dashboard.css";
import Trading from "./symbol"
import TradingViewTickerTape from "./tape"

const menuItems = [
  { name: "Dashboard", icon: <TrendingUp size={20} /> },
  { name: "Watchlist", icon: <Briefcase size={20} /> },
  { name: "Mutual Funds", icon: <Wallet size={20} /> },
  { name: "Portfolio", icon: <FileText size={20} /> },
  { name: "Reports", icon: <BookOpen size={20} /> },
];

const Dashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const stocks = useStockData();

  const renderContent = useCallback(() => {
    switch (activePage) {
      case "Dashboard":
        return (
          <>
            <Trading />
            <TradingViewTickerTape />
          </>
        );
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

      {/* ✅ User Profile Navbar */}
      <div className="user-navbar">
        <div className="user-profile">
          <User size={24} /> <span>John Doe</span>
        </div>
      </div>

      {/* ✅ Sidebar */}
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
