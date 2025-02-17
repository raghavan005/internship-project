import React, { useState } from "react";
import {
  Search,
  Bell,
  User,
  TrendingUp,
  Briefcase,
  Wallet,
  FileText,
  BookOpen,
  AlertCircle,
} from "lucide-react";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("market");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const marketIndices = [
    { name: "NIFTY 50", value: "22,212.70", change: "+0.75%", color: "green" },
    { name: "SENSEX", value: "73,158.24", change: "+0.68%", color: "green" },
    { name: "BANK NIFTY", value: "46,751.15", change: "-0.12%", color: "red" },
  ];

  const watchlist = [
    {
      symbol: "INFY",
      name: "Infosys Ltd",
      price: "₹1,567.80",
      change: "+1.2%",
      color: "green",
    },
    {
      symbol: "WIPRO",
      name: "Wipro Ltd",
      price: "₹456.30",
      change: "-0.5%",
      color: "red",
    },
    {
      symbol: "HCLTECH",
      name: "HCL Technologies",
      price: "₹1,234.50",
      change: "+0.8%",
      color: "green",
    },
  ];

  const portfolio = [
    {
      symbol: "TATASTEEL",
      shares: 100,
      avgPrice: "₹145.30",
      currentPrice: "₹150.25",
      returns: "+3.4%",
    },
    {
      symbol: "ITC",
      shares: 200,
      avgPrice: "₹380.50",
      currentPrice: "₹395.75",
      returns: "+4.0%",
    },
    {
      symbol: "SUNPHARMA",
      shares: 50,
      avgPrice: "₹890.25",
      currentPrice: "₹875.50",
      returns: "-1.7%",
    },
  ];

  const funds = {
    available: "₹50,000",
    invested: "₹2,50,000",
    total: "₹3,00,000",
  };

  const notifications = [
    { id: 1, message: "NIFTY 50 up by 1% today", time: "2 mins ago" },
    { id: 2, message: "Your order for INFY executed", time: "1 hour ago" },
    {
      id: 3,
      message: "Market holiday on upcoming Monday",
      time: "2 hours ago",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "watchlist":
        return (
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h5 style={{ marginBottom: "20px" }}>My Watchlist</h5>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Company</th>
                    <th>Price</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {watchlist.map((stock, index) => (
                    <tr key={index}>
                      <td>{stock.symbol}</td>
                      <td>{stock.name}</td>
                      <td>{stock.price}</td>
                      <td style={{ color: stock.color }}>{stock.change}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "portfolio":
        return (
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h5 style={{ marginBottom: "20px" }}>Portfolio Summary</h5>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Shares</th>
                    <th>Avg Price</th>
                    <th>Current Price</th>
                    <th>Returns</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((holding, index) => (
                    <tr key={index}>
                      <td>{holding.symbol}</td>
                      <td>{holding.shares}</td>
                      <td>{holding.avgPrice}</td>
                      <td>{holding.currentPrice}</td>
                      <td
                        style={{
                          color: holding.returns.startsWith("+")
                            ? "green"
                            : "red",
                        }}
                      >
                        {holding.returns}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "funds":
        return (
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h5 style={{ marginBottom: "20px" }}>Funds Overview</h5>
            <div className="row g-4">
              <div className="col-md-4">
                <div
                  style={{
                    padding: "20px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                  }}
                >
                  <h6 style={{ color: "#6c757d" }}>Available Funds</h6>
                  <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                    {funds.available}
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div
                  style={{
                    padding: "20px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                  }}
                >
                  <h6 style={{ color: "#6c757d" }}>Invested Amount</h6>
                  <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                    {funds.invested}
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div
                  style={{
                    padding: "20px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                  }}
                >
                  <h6 style={{ color: "#6c757d" }}>Total Value</h6>
                  <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                    {funds.total}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "reports":
        return (
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h5 style={{ marginBottom: "20px" }}>Trading Reports</h5>
            <div className="row g-4">
              <div className="col-md-6">
                <div
                  style={{
                    padding: "20px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                  }}
                >
                  <h6>Profit & Loss Statement</h6>
                  <p style={{ color: "#6c757d" }}>
                    View your trading performance
                  </p>
                  <button className="btn btn-primary">Download</button>
                </div>
              </div>
              <div className="col-md-6">
                <div
                  style={{
                    padding: "20px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                  }}
                >
                  <h6>Transaction History</h6>
                  <p style={{ color: "#6c757d" }}>View your trade history</p>
                  <button className="btn btn-primary">Download</button>
                </div>
              </div>
            </div>
          </div>
        );

      case "ipo":
        return (
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h5 style={{ marginBottom: "20px" }}>IPO Dashboard</h5>
            <div
              className="alert alert-info"
              role="alert"
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <AlertCircle size={18} />
              <div>New IPO opening tomorrow! Check details below.</div>
            </div>
            <div className="table-responsive mt-4">
              <table className="table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Price Band</th>
                    <th>Issue Size</th>
                    <th>Open Date</th>
                    <th>Close Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Tech Solutions Ltd</td>
                    <td>₹500 - ₹550</td>
                    <td>₹1,200 Cr</td>
                    <td>Mar 15, 2024</td>
                    <td>Mar 18, 2024</td>
                    <td>
                      <button className="btn btn-sm btn-primary">Apply</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return (
          <div
            style={{
              backgroundColor: "white",
              marginTop: "20px",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h5 style={{ marginBottom: "15px" }}>Market Overview</h5>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Company</th>
                    <th>Price</th>
                    <th>Change</th>
                    <th>Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>RELIANCE</td>
                    <td>Reliance Industries</td>
                    <td>₹2,845.25</td>
                    <td style={{ color: "green" }}>+1.25%</td>
                    <td>₹19.2T</td>
                  </tr>
                  <tr>
                    <td>TCS</td>
                    <td>Tata Consultancy Services</td>
                    <td>₹3,912.15</td>
                    <td style={{ color: "red" }}>-0.45%</td>
                    <td>₹14.3T</td>
                  </tr>
                  <tr>
                    <td>HDFC</td>
                    <td>HDFC Bank</td>
                    <td>₹1,567.80</td>
                    <td style={{ color: "green" }}>+0.88%</td>
                    <td>₹8.7T</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          backgroundColor: "#343a40",
          padding: "20px",
          color: "white",
        }}
      >
        <h4
          style={{ marginBottom: "25px", color: "#fff", cursor: "pointer" }}
          onClick={() => setActiveTab("market")}
        >
          Providance Trade
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("watchlist");
            }}
            style={{
              color: "white",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px",
              backgroundColor:
                activeTab === "watchlist" ? "#495057" : "transparent",
              borderRadius: "4px",
            }}
          >
            <TrendingUp size={18} /> Watchlist
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("portfolio");
            }}
            style={{
              color: "white",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px",
              backgroundColor:
                activeTab === "portfolio" ? "#495057" : "transparent",
              borderRadius: "4px",
            }}
          >
            <Briefcase size={18} /> Portfolio
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("funds");
            }}
            style={{
              color: "white",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px",
              backgroundColor:
                activeTab === "funds" ? "#495057" : "transparent",
              borderRadius: "4px",
            }}
          >
            <Wallet size={18} /> Funds
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("reports");
            }}
            style={{
              color: "white",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px",
              backgroundColor:
                activeTab === "reports" ? "#495057" : "transparent",
              borderRadius: "4px",
            }}
          >
            <FileText size={18} /> Reports
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("ipo");
            }}
            style={{
              color: "white",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px",
              backgroundColor: activeTab === "ipo" ? "#495057" : "transparent",
              borderRadius: "4px",
            }}
          >
            <BookOpen size={18} /> IPO
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        {/* Top Bar */}
        <div
          style={{
            padding: "15px",
            backgroundColor: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="input-group" style={{ maxWidth: "400px" }}>
            <span
              className="input-group-text"
              style={{ backgroundColor: "white" }}
            >
              <Search size={18} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: "1px solid #dee2e6" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              position: "relative",
            }}
          >
            <a href="#" style={{ textDecoration: "none", color: "#333" }}>
              Explore
            </a>

            <div style={{ position: "relative" }}>
              <Bell
                size={18}
                style={{ cursor: "pointer" }}
                onClick={() => setShowNotifications(!showNotifications)}
              />
              {notifications.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    background: "#dc3545",
                    color: "white",
                    borderRadius: "50%",
                    width: "16px",
                    height: "16px",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {notifications.length}
                </span>
              )}

              {showNotifications && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: "0",
                    marginTop: "10px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    width: "300px",
                    zIndex: 1000,
                  }}
                >
                  <div
                    style={{
                      padding: "15px",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    <h6 style={{ margin: 0 }}>Notifications</h6>
                  </div>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      style={{
                        padding: "15px",
                        borderBottom: "1px solid #dee2e6",
                      }}
                    >
                      <div style={{ fontSize: "14px" }}>
                        {notification.message}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6c757d",
                          marginTop: "5px",
                        }}
                      >
                        {notification.time}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ position: "relative" }}>
              <User
                size={18}
                style={{ cursor: "pointer" }}
                onClick={() => setShowUserMenu(!showUserMenu)}
              />

              {showUserMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: "0",
                    marginTop: "10px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    width: "200px",
                    zIndex: 1000,
                  }}
                >
                  <div
                    style={{
                      padding: "15px",
                      borderBottom: "1px solid #dee2e6",
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>John Doe</div>
                    <div style={{ fontSize: "14px", color: "#6c757d" }}>
                      john@example.com
                    </div>
                  </div>
                  <div style={{ padding: "8px" }}>
                    <a
                      href="#"
                      className="dropdown-item"
                      style={{
                        padding: "8px",
                        color: "#212529",
                        textDecoration: "none",
                      }}
                    >
                      Profile
                    </a>
                    <a
                      href="#"
                      className="dropdown-item"
                      style={{
                        padding: "8px",
                        color: "#212529",
                        textDecoration: "none",
                      }}
                    >
                      Settings
                    </a>
                    <a
                      href="#"
                      className="dropdown-item"
                      style={{
                        padding: "8px",
                        color: "#dc3545",
                        textDecoration: "none",
                      }}
                    >
                      Logout
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Dashboard */}
        <div
          style={{
            backgroundColor: "white",
            padding: "15px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            marginBottom: "20px",
          }}
        >
          <div className="row g-3">
            {marketIndices.map((index, i) => (
              <div key={i} className="col-md-4">
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid #dee2e6",
                  }}
                >
                  <div
                    style={{
                      color: "#6c757d",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {index.name}
                  </div>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      margin: "5px 0",
                    }}
                  >
                    {index.value}
                  </div>
                  <div style={{ color: index.color, fontWeight: "500" }}>
                    {index.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: "0 20px" }}>{renderContent()}</div>
      </div>
    </div>
  );
}

export default App;