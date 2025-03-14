import React, { useEffect } from "react";
import { useAuth } from "../AuthContext";
import useStockHoldings from "./Holdings";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useBondHoldings } from "../bonds/bondholdings";

const Portfolio: React.FC = () => {
  const { userData, mutualFundInvestments, user } = useAuth();
  const { stockHoldings, loading, error } = useStockHoldings();
  const {
    bondHoldings,
    loading: bondLoading,
    error: bondError,
  } = useBondHoldings(user?.uid);

  useEffect(() => {
    console.log("User:", user);
    console.log("UserData:", userData);
    console.log("MutualFundInvestments:", mutualFundInvestments);
    console.log("Fetched Bond Data:", bondHoldings);
  }, [user, userData, mutualFundInvestments, bondHoldings]);

  if (!user) {
    return (
      <p style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
        🔒 Please log in to view your portfolio.
      </p>
    );
  }

  if (!userData) {
    return (
      <p style={{ textAlign: "center", color: "blue", fontWeight: "bold" }}>
        ⏳ Loading portfolio data...
      </p>
    );
  }

  const totalStockInvestment = stockHoldings.reduce(
    (total, holding) => total + holding.price * holding.quantity,
    0
  );
  const totalMutualFundInvestment = mutualFundInvestments.reduce(
    (total, investment) => total + Number(investment.amount),
    0
  );

  const totalBondInvestment = bondHoldings.reduce(
    (total, holding) => total + holding.investment,
    0
  );

  const totalInvestment =
    totalStockInvestment + totalMutualFundInvestment + totalBondInvestment;
  const totalPortfolioValue = totalInvestment + userData.walletAmount;

  const stockPercentage =
    totalInvestment > 0
      ? ((totalStockInvestment / totalInvestment) * 100).toFixed(1)
      : 0;
  const mutualFundPercentage =
    totalInvestment > 0
      ? ((totalMutualFundInvestment / totalInvestment) * 100).toFixed(1)
      : 0;
  const bondPercentage =
    totalInvestment > 0
      ? ((totalBondInvestment / totalInvestment) * 100).toFixed(1)
      : 0;

  const pieChartData =
    totalInvestment > 0
      ? [
          { name: "Stocks", value: Number(stockPercentage) },
          { name: "Mutual Funds", value: Number(mutualFundPercentage) },
          { name: "Bonds", value: Number(bondPercentage) },
        ]
      : [];

  const COLORS = ["#007bff", "#28a745", "#FFC300"];

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: "rgb(14, 15, 14)",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            flex: "1",
            minWidth: "300px",
            padding: "20px",
            border: "2px solid #444",
            borderRadius: "10px",
            backgroundColor: "#222",
            textAlign: "center",
          }}
        >
          <h2>📊 Investment Breakdown</h2>
          {totalInvestment > 0 ? (
            <PieChart width={500} height={400}>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={130}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(1)}%`
                }
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <p style={{ color: "gray" }}>No investments to display.</p>
          )}
        </div>

        <div
          style={{
            flex: "1",
            minWidth: "300px",
            padding: "20px",
            border: "2px solid #444",
            borderRadius: "10px",
            backgroundColor: "#222",
            textAlign: "center",
          }}
        >
          {/* Wallet Balance Section */}
          <h2>💰 Wallet Overview</h2>

          <h3
            style={{
              color: "lightgreen",
              fontSize: "1.3em",
              marginBottom: "5px",
            }}
          >
            Available Balance: ${userData.walletAmount.toFixed(2)}
          </h3>

          <p style={{ color: "#bbb", fontSize: "0.9em", marginBottom: "15px" }}>
            This is the total cash available in your wallet that you can invest
            or withdraw anytime.
          </p>

          <hr
            style={{ width: "50%", margin: "10px auto", borderColor: "#555" }}
          />

          {/* Investments */}
          <h4 style={{ fontSize: "1.2em", marginBottom: "5px" }}>
            📈 Stock Investments
          </h4>
          <h5
            style={{
              color: "lightblue",
              fontSize: "1.1em",
              marginBottom: "10px",
            }}
          >
            ${totalStockInvestment.toFixed(2)}
          </h5>

          <h4 style={{ fontSize: "1.2em", marginBottom: "5px" }}>
            📊 Mutual Fund Investments
          </h4>
          <h5
            style={{
              color: "lightcoral",
              fontSize: "1.1em",
              marginBottom: "10px",
            }}
          >
            ${totalMutualFundInvestment.toFixed(2)}
          </h5>

          <h4 style={{ fontSize: "1.2em", marginBottom: "5px" }}>
            🏦 Bond Investments
          </h4>
          <h5
            style={{
              color: "#FFC300",
              fontSize: "1.1em",
              marginBottom: "10px",
            }}
          >
            ${totalBondInvestment.toFixed(2)}
          </h5>

          <hr
            style={{ width: "50%", margin: "10px auto", borderColor: "#555" }}
          />

          {/* Portfolio Summary */}
          <h4 style={{ fontSize: "1.2em", marginBottom: "5px" }}>
            💼 Total Portfolio Value
          </h4>
          <h5
            style={{ color: "white", fontSize: "1.1em", marginBottom: "10px" }}
          >
            ${totalPortfolioValue.toFixed(2)}
          </h5>

          <h4
            style={{
              fontSize: "1.2em",
              color: totalPortfolioValue >= totalInvestment ? "green" : "red",
              marginBottom: "5px",
            }}
          >
            {totalPortfolioValue >= totalInvestment
              ? "📈 Net Gain"
              : "📉 Net Loss"}
          </h4>
          <h5
            style={{
              fontSize: "1.1em",
              color: totalPortfolioValue >= totalInvestment ? "green" : "red",
              marginBottom: "10px",
            }}
          >
            ${Math.abs(totalPortfolioValue - totalInvestment).toFixed(2)}
          </h5>
        </div>
      </div>

      <div
        style={{
          padding: "20px",
          border: "2px solid #444",
          borderRadius: "10px",
          backgroundColor: "#222",
          marginBottom: "20px",
        }}
      >
        <h2>📈 Stock Holdings</h2>
        {loading ? (
          <p>Loading stock data...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : stockHoldings.length === 0 ? (
          <p style={{ color: "gray" }}>No stock holdings available.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: "10px", borderBottom: "2px solid #444" }}>
                  Symbol
                </th>
                <th style={{ padding: "10px", borderBottom: "2px solid #444" }}>
                  Quantity
                </th>
                <th style={{ padding: "10px", borderBottom: "2px solid #444" }}>
                  Price ($)
                </th>
                <th style={{ padding: "10px", borderBottom: "2px solid #444" }}>
                  Total Value ($)
                </th>
              </tr>
            </thead>
            <tbody>
              {stockHoldings.map((holding, index) => (
                <tr key={index}>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #555" }}
                  >
                    {holding.symbol}
                  </td>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #555" }}
                  >
                    {holding.quantity}
                  </td>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #555" }}
                  >
                    ${holding.price.toFixed(2)}
                  </td>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #555" }}
                  >
                    ${(holding.price * holding.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div
        style={{
          padding: "20px",
          border: "2px solid #444",
          borderRadius: "10px",
          backgroundColor: "#222",
          marginTop: "20px",
        }}
      >
        <h2>💰 Mutual Fund Investments</h2>
        {mutualFundInvestments.length > 0 ? (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: "10px", borderBottom: "2px solid #444" }}>
                  Fund Name
                </th>
                <th style={{ padding: "10px", borderBottom: "2px solid #444" }}>
                  Investment Amount ($)
                </th>
                <th style={{ padding: "10px", borderBottom: "2px solid #444" }}>
                  Duration (Months)
                </th>
                <th style={{ padding: "10px", borderBottom: "2px solid #444" }}>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {mutualFundInvestments.map((investment, index) => (
                <tr key={index}>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #555" }}
                  >
                    {investment.fundName}
                  </td>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #555" }}
                  >
                    ${Number(investment.amount).toFixed(2)}
                  </td>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #555" }}
                  >
                    {investment.duration}
                  </td>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #555" }}
                  >
                    {new Date(investment.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "gray" }}>No mutual fund investments available.</p>
        )}
      </div>

      <div
        style={{
          padding: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "rgb(14, 15, 14)",
          color: "white",
        }}
      >
        <div
          style={{
            padding: "20px",
            border: "2px solid #444",
            borderRadius: "10px",
            backgroundColor: "#222",
            marginTop: "20px",
          }}
        >
          <h2>🏦 Bond Holdings</h2>
          {bondLoading ? (
            <p>Loading bond data...</p>
          ) : bondError ? (
            <p style={{ color: "red" }}>{bondError}</p>
          ) : bondHoldings.length === 0 ? (
            <p style={{ color: "gray" }}>No bond holdings available.</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{ padding: "10px", borderBottom: "2px solid #444" }}
                  >
                    Bond Name
                  </th>
                  <th
                    style={{ padding: "10px", borderBottom: "2px solid #444" }}
                  >
                    Investment ($)
                  </th>
                  <th
                    style={{ padding: "10px", borderBottom: "2px solid #444" }}
                  >
                    Profit ($)
                  </th>
                  <th
                    style={{ padding: "10px", borderBottom: "2px solid #444" }}
                  >
                    Total Return ($)
                  </th>
                  <th
                    style={{ padding: "10px", borderBottom: "2px solid #444" }}
                  >
                    Purchase Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {bondHoldings.map((holding, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #555",
                      }}
                    >
                      {holding.bondName}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #555",
                      }}
                    >
                      ${holding.investment.toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #555",
                      }}
                    >
                      ${holding.profit.toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #555",
                      }}
                    >
                      ${holding.totalReturn.toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #555",
                      }}
                    >
                      {holding.purchaseDate.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
