import React from "react";
import { useAuth } from "../AuthContext"; // Adjust path
import { Container, Card, Table, Badge, Row, Col } from "react-bootstrap";

const Portfolio: React.FC = () => {
  const { userData, mutualFundInvestments, user } = useAuth();

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

  // ✅ Ensure purchaseHistory is retrieved properly
  const purchaseHistory = userData?.purchaseHistory || [];

  console.log("Fetched Stock Purchase History:", purchaseHistory); // Debugging log

  // ✅ Filter and sort only stock transactions (exclude mutual funds)
  const recentStockPurchases = purchaseHistory
    .filter((item) => item.investmentType === "stock") // Ensure only stocks are shown
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const recentMutualFundInvestments = [...mutualFundInvestments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // ✅ Stock Purchases Section
  const StockPurchases = () => {
    return (
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title className="text-primary">
            📈 Recent Stock Transactions
          </Card.Title>
          {recentStockPurchases.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Stock</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Price ($)</th>
                  <th>Brokerage Fee ($)</th>
                  <th>Total Amount ($)</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentStockPurchases.map((item, index) => (
                  <tr key={index}>
                    <td>{item.stock}</td>
                    <td>
                      <Badge bg={item.type === "buy" ? "success" : "danger"}>
                        {item.type.toUpperCase()}
                      </Badge>
                    </td>
                    <td>{item.quantity}</td>
                    <td>${item.price}</td>
                    <td>${item.brokerageFee}</td>
                    <td>${item.totalAmount}</td>
                    <td>{new Date(item.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted">
              No recent stock transactions available.
            </p>
          )}
        </Card.Body>
      </Card>
    );
  };

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
      <Card className="mb-4 shadow-lg text-center">
        <Card.Body>
          <Card.Title className="display-6 text-primary">
            📊 Your Investment Portfolio
          </Card.Title>
          <h4 className="text-success">
            Wallet Balance: ${userData.walletAmount.toFixed(2)}
          </h4>
        </Card.Body>
      </Card>

      <Row>
        <Col md={6}>
          <StockPurchases />
        </Col>
        <Col md={6}>
          <MutualFundInvestments />
        </Col>
      </Row>
    </Container>
  );
};

export default Portfolio;
