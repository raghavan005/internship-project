import React, { useEffect } from "react";
import { Container, Card, Table, Row, Col } from "react-bootstrap";
import { useAuth } from "../AuthContext"; // Adjust path
import useStockHoldings from "./Holdings"; // Import the custom hook
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"; // Import Recharts components

interface MutualFundInvestment {
  fundName: string;
  amount: number; // Ensure this is a number
  duration: number;
  date: string;
}

const Portfolio: React.FC = () => {
  const { userData, mutualFundInvestments, user } = useAuth();
  const { stockHoldings, loading, error } = useStockHoldings();

  useEffect(() => {
    console.log("User in MyComponent:", user);
    console.log("UserData in MyComponent:", userData);
    console.log("MutualFundInvestments in MyComponent:", mutualFundInvestments);
  }, [user, userData, mutualFundInvestments]);

  if (!user) {
    return (
      <p className="text-center text-danger">
        Please log in to view your portfolio.
      </p>
    );
  }

  if (!userData) {
    return (
      <p className="text-center text-primary">Loading portfolio data...</p>
    );
  }

  // ✅ Filter and sort mutual fund investments
  const recentMutualFundInvestments = [...mutualFundInvestments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // ✅ Calculate total investment in stocks
  const totalStockInvestment = stockHoldings.reduce(
    (total, holding) => total + holding.price * holding.quantity,
    0
  );

  // ✅ Calculate total investment in mutual funds
  const totalMutualFundInvestment = mutualFundInvestments.reduce(
    (total, investment) => total + Number(investment.amount), // Convert to number if necessary
    0
  );

  // ✅ Calculate percentages for the pie chart and fix to one decimal place
  const totalInvestment = totalStockInvestment + totalMutualFundInvestment;
  const stockPercentage = parseFloat(
    ((totalStockInvestment / totalInvestment) * 100).toFixed(1)
  );
  const mutualFundPercentage = parseFloat(
    ((totalMutualFundInvestment / totalInvestment) * 100).toFixed(1)
  );

  // ✅ Data for the pie chart
  const pieChartData = [
    { name: "Stocks", value: stockPercentage },
    { name: "Mutual Funds", value: mutualFundPercentage },
  ];

  // ✅ Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F"];

  // ✅ Mutual Fund Investments Section
  const MutualFundInvestments = () => {
    return (
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="text-success">
            💰 Recent Mutual Fund Investments
          </Card.Title>
          {recentMutualFundInvestments.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Fund Name</th>
                  <th>Investment Amount ($)</th>
                  <th>Duration (Months)</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentMutualFundInvestments.map((investment, index) => (
                  <tr key={index}>
                    <td>{investment.fundName}</td>
                    <td>${investment.amount}</td>
                    <td>{investment.duration}</td>
                    <td>{new Date(investment.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted">
              No recent mutual fund investments available.
            </p>
          )}
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container className="mt-4">
      {/* Portfolio Overview Card with Pie Chart */}
      <Card className="mb-4 shadow-lg text-center" style={{ width: "39.7vw" }}>
        <Card.Body>
          <Card.Title className="display-6 text-primary">
            📊 Your Investment Portfolio
          </Card.Title>
          <h4 className="text-success">
            Wallet Balance: ${userData.walletAmount.toFixed(2)}
          </h4>

          {/* Pie Chart */}
          <PieChart width={700} height={300}>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
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
        </Card.Body>
      </Card>
      <Card className="mb-4 shadow-lg text-center" style={{ width: "33.7vw" }}>
        <Card.Body>
          <Card.Title className="display-6 text-primary">
            📊 Your Investment Portfolio
          </Card.Title>
          <h4 className="text-success">
            Wallet Balance: ${userData.walletAmount.toFixed(2)}
          </h4>
        </Card.Body>
      </Card>
      {/* Stock Holdings Table */}
      <Row>
        <Col md={12}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title className="text-primary">
                📈 Stock Holdings
              </Card.Title>
              {loading ? (
                <p>Loading stock data...</p>
              ) : error ? (
                <p className="text-danger">{error}</p>
              ) : stockHoldings.length === 0 ? (
                <p className="text-muted">No stock holdings available.</p>
              ) : (
                <Table striped bordered hover responsive>
                  <thead className="table-primary">
                    <tr>
                      <th>Symbol</th>
                      <th>Quantity</th>
                      <th>Price ($)</th>
                      <th>Total Value ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockHoldings.map((holding, index) => (
                      <tr key={index}>
                        <td>{holding.symbol}</td>
                        <td>{holding.quantity}</td>
                        <td>${holding.price.toFixed(2)}</td>
                        <td>
                          ${(holding.price * holding.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Mutual Fund Investments Section */}
      <Row>
        <Col md={12}>
          <MutualFundInvestments />
        </Col>
      </Row>
    </Container>
  );
};

export default Portfolio;
