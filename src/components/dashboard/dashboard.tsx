import React from "react";
import { Container, Navbar, Nav, Row, Col, Table, Card } from "react-bootstrap";
import { BsGraphUp, BsCurrencyDollar, BsBarChart } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard: React.FC = () => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3 vh-100" style={{ width: "250px" }}>
        <h4 className="text-center">Providence Trade</h4>
        <Nav className="flex-column mt-4">
          <Nav.Item>
            <Nav.Link href="#" className="text-white">
              Dashboard
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#" className="text-white">
              Market
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#" className="text-white">
              Portfolio
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#" className="text-white">
              Transactions
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Navbar */}
        <Navbar variant="light" expand="lg" className="bg-light p-2">
          <Navbar.Brand className="ms-3">Dashboard</Navbar.Brand>
        </Navbar>

        <Container fluid className="mt-4">
          <Row>
            {/* Market Indices */}
            <Col md={4}>
              <Card className="p-3 text-center">
                <BsGraphUp size={40} className="text-primary" />
                <h5>Nifty 50</h5>
                <p>₹19,800 (+1.2%)</p>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="p-3 text-center">
                <BsCurrencyDollar size={40} className="text-success" />
                <h5>SENSEX</h5>
                <p>₹65,500 (+0.9%)</p>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="p-3 text-center">
                <BsBarChart size={40} className="text-warning" />
                <h5>Bank Nifty</h5>
                <p>₹45,200 (+1.5%)</p>
              </Card>
            </Col>
          </Row>

          {/* Portfolio Holdings */}
          <Row className="mt-4">
            <Col>
              <Card>
                <Card.Header>Portfolio Holdings</Card.Header>
                <Card.Body>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Stock</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>TCS</td>
                        <td>10</td>
                        <td>₹3,500</td>
                        <td className="text-success">+2.3%</td>
                      </tr>
                      <tr>
                        <td>Reliance</td>
                        <td>5</td>
                        <td>₹2,700</td>
                        <td className="text-danger">-1.1%</td>
                      </tr>
                      <tr>
                        <td>Infosys</td>
                        <td>8</td>
                        <td>₹1,450</td>
                        <td className="text-success">+1.5%</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
