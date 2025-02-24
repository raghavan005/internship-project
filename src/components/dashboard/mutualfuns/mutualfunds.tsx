import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaChartLine, FaPercentage } from "react-icons/fa";
import { motion } from "framer-motion";

const mutualFunds = [
  {
    name: "Vanguard 500 Index Fund",
    house: "Vanguard Mutual Fund",
    category: "Large Cap",
    nav: "₹458.32",
    return1Y: "+15.8%",
    return3Y: "+12.5%",
    return5Y: "+10.2%",
    risk: "Moderate",
    rating: 5,
  },
  {
    name: "HDFC Mid-Cap Opportunities",
    house: "HDFC Mutual Fund",
    category: "Mid Cap",
    nav: "₹128.45",
    return1Y: "+22.4%",
    return3Y: "+18.9%",
    return5Y: "+14.6%",
    risk: "High",
    rating: 5,
  },
  {
    name: "Axis Bluechip Fund",
    house: "Axis Mutual Fund",
    category: "Large Cap",
    nav: "₹89.76",
    return1Y: "+12.6%",
    return3Y: "+9.8%",
    return5Y: "+8.4%",
    risk: "Low",
    rating: 5,
  },
];

const MutualFundsDashboard = () => {
  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "auto",
        padding: "30px",
        borderRadius: "12px",
        backgroundColor: "#f4f6f9",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        fontFamily: "Arial, sans-serif",
        color: "#333",
      }}
    >
      <h2 style={{ fontWeight: "bold", color: "#007bff" }}>Mutual Funds</h2>
      <p style={{ fontSize: "16px", color: "#666" }}>
        Explore and invest in top-performing mutual funds
      </p>

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            flex: "1",
            padding: "15px",
            borderRadius: "8px",
            backgroundColor: "rgb(118, 215, 247)",
            display: "flex",
            alignItems: "center",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
            border: "1px solid #ddd",
          }}
        >
          <span
            style={{
              fontSize: "1.8rem",
              marginRight: "10px",
              fontWeight: "bold",
            }}
          >
            3
          </span>
          <span>Total Funds</span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            flex: "1",
            padding: "15px",
            borderRadius: "8px",
            backgroundColor: "rgb(118, 215, 247)",
            display: "flex",
            alignItems: "center",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
            border: "1px solid #ddd",
          }}
        >
          <FaChartLine
            style={{ color: "green", fontSize: "1.8rem", marginRight: "10px" }}
          />
          <span>
            Average Returns (1Y):{" "}
            <strong style={{ color: "green" }}>+16.9%</strong>
          </span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            flex: "1",
            padding: "15px",
            borderRadius: "8px",
            backgroundColor: "rgb(118, 215, 247)",
            display: "flex",
            alignItems: "center",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
            border: "1px solid #ddd",
          }}
        >
          <FaPercentage
            style={{ color: "blue", fontSize: "1.8rem", marginRight: "10px" }}
          />
          <span>
            Avg Expense Ratio: <strong>1.28%</strong>
          </span>
        </motion.div>
      </div>

      <input
        type="text"
        placeholder="Search funds by name or fund house..."
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          marginBottom: "20px",
        }}
      />

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
          fontSize: "14px",
          border: "1px solid #ddd",
        }}
      >
        <thead
          style={{
            backgroundColor: "rgb(118, 215, 247)",
            color: "rgb(63, 67, 67)",
          }}
        >
          <tr>
            <th>FUND DETAILS</th>
            <th>CATEGORY</th>
            <th>NAV</th>
            <th>1Y RETURN</th>
            <th>3Y RETURN</th>
            <th>5Y RETURN</th>
            <th>RISK</th>
            <th>RATING</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {mutualFunds.map((fund, index) => (
            <tr key={index}>
              <td>
                <strong>{fund.name}</strong>
                <br />
                <small>{fund.house}</small>
              </td>
              <td>{fund.category}</td>
              <td>{fund.nav}</td>
              <td style={{ color: "green" }}>{fund.return1Y}</td>
              <td style={{ color: "green" }}>{fund.return3Y}</td>
              <td style={{ color: "green" }}>{fund.return5Y}</td>
              <td
                style={{
                  color:
                    fund.risk === "High"
                      ? "red"
                      : fund.risk === "Low"
                      ? "green"
                      : "orange",
                }}
              >
                {fund.risk}
              </td>
              <td>{"⭐".repeat(fund.rating)}</td>
              <td>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href="#"
                  style={{
                    color: "#007bff",
                    textDecoration: "none",
                    padding: "6px 12px",
                    border: "1px solid #007bff",
                    borderRadius: "4px",
                    display: "inline-block",
                  }}
                >
                  View Details
                </motion.a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <button
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Buy
        </button>
        <button
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Sell
        </button>
      </div>
    </div>
  );
};

export default MutualFundsDashboard;
