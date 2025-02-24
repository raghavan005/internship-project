import React, { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaChartLine, FaPercentage } from "react-icons/fa";
import { motion } from "framer-motion";
import Modal from "react-modal";
import Lottie from "lottie-react";
import { useAuth } from "../AuthContext"; // Import your AuthContext
import processingAnimation from "../../../assets/animation/Animation - loading.json"; // Replace with your file path
import successAnimation from "../../../assets/animation/Animation -success.json"; // Replace with your file path



Modal.setAppElement("#root");

interface MutualFund {
  name: string;
  house: string;
  category: string;
  nav: string;
  return1Y: number;
  return3Y: number;
  return5Y: number;
  risk: string;
  rating: number;
}

const mutualFunds: MutualFund[] = [
  {
    name: "Vanguard 500 Index Fund",
    house: "Vanguard Mutual Fund",
    category: "Large Cap",
    nav: "₹458.32",
    return1Y: 15.8,
    return3Y: 12.5,
    return5Y: 10.2,
    risk: "Moderate",
    rating: 5,
  },
  {
    name: "HDFC Mid-Cap Opportunities",
    house: "HDFC Mutual Fund",
    category: "Mid Cap",
    nav: "₹128.45",
    return1Y: 22.4,
    return3Y: 18.9,
    return5Y: 14.6,
    risk: "High",
    rating: 5,
  },
  {
    name: "Axis Bluechip Fund",
    house: "Axis Mutual Fund",
    category: "Large Cap",
    nav: "₹89.76",
    return1Y: 12.6,
    return3Y: 9.8,
    return5Y: 8.4,
    risk: "Low",
    rating: 5,
  },
];

const MutualFundsDashboard = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState<MutualFund | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [investmentDuration, setInvestmentDuration] = useState<number | null>(
    null
  );
  const [finalAmount, setFinalAmount] = useState<string | null>(null);
  const {
    userData,
    recordMutualFundInvestment,
    mutualFundInvestments,
    getUserMutualFunds,
    user,
  } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const walletBalance = userData?.walletAmount || 0;

  useEffect(() => {
    if (user) {
      getUserMutualFunds();
    }
  }, [getUserMutualFunds, user]);

  const openModal = (fund: MutualFund) => {
    setSelectedFund(fund);
    setModalIsOpen(true);
    setInvestmentAmount("");
    setInvestmentDuration(null);
    setFinalAmount(null);
    setIsProcessing(false);
    setIsSuccess(false);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedFund(null);
    setIsProcessing(false);
    setIsSuccess(false);
  };

  const calculateFinalAmount = () => {
    if (!selectedFund || !investmentAmount || !investmentDuration) return;

    const amount = parseFloat(investmentAmount);
    const duration = investmentDuration;
    const rate = selectedFund.return1Y / 100;

    const futureValue = amount * Math.pow(1 + rate, duration);
    setFinalAmount(futureValue.toFixed(2));
  };

  const confirmInvestment = async () => {
    if (!selectedFund || !investmentAmount || !investmentDuration) return;

    const amount = parseFloat(investmentAmount);

    if (amount > walletBalance) {
      alert("Insufficient wallet balance.");
      return;
    }

    setIsProcessing(true); // Start processing animation immediately
    try {
      await recordMutualFundInvestment(
        selectedFund.name,
        Number(amount),
        Number(investmentDuration)
      );
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (error) {
      setIsProcessing(false); // Stop processing animation on error
      console.error("Investment failed:", error);
      alert("Investment failed. Please try again.");
    }
  };

   const processingOptions = {
     loop: true,
     autoplay: true,
     animationData: processingAnimation,
     rendererSettings: {
       preserveAspectRatio: "xMidYMid slice",
     },
   };

   const successOptions = {
     loop: false,
     autoplay: true,
     animationData: successAnimation,
     rendererSettings: {
       preserveAspectRatio: "xMidYMid slice",
     },
   };

  return (
    <div style={styles.dashboardContainer}>
      <h1 style={styles.title}>Mutual Funds</h1>
      <p style={styles.subtitle}>
        Explore and invest in top-performing mutual funds
      </p>

      <div style={styles.statsGrid}>
        <motion.div whileHover={{ scale: 1.05 }} style={styles.statCard}>
          <span style={styles.statNumber}>{mutualFunds.length}</span>
          <span style={styles.statLabel}>Total Funds</span>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} style={styles.statCard}>
          <FaChartLine style={styles.statIcon} />
          <span style={styles.statLabel}>
            Average Returns (1Y):{" "}
            <strong style={styles.statValue}>
              +
              {(
                mutualFunds.reduce((sum, fund) => sum + fund.return1Y, 0) /
                mutualFunds.length
              ).toFixed(2)}
              %
            </strong>
          </span>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} style={styles.statCard}>
          <FaPercentage style={styles.statIcon} />
          <span style={styles.statLabel}>
            Avg Expense Ratio: <strong style={styles.statValue}>1.28%</strong>
          </span>
        </motion.div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>FUND DETAILS</th>
            <th style={styles.tableHeader}>CATEGORY</th>
            <th style={styles.tableHeader}>NAV</th>
            <th style={styles.tableHeader}>1Y RETURN</th>
            <th style={styles.tableHeader}>3Y RETURN</th>
            <th style={styles.tableHeader}>5Y RETURN</th>
            <th style={styles.tableHeader}>RISK</th>
            <th style={styles.tableHeader}>RATING</th>
            <th style={styles.tableHeader}>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {mutualFunds.map((fund, index) => (
            <tr key={index}>
              <td style={styles.tableCell}>
                <strong style={styles.fundName}>{fund.name}</strong>
                <br />
                <small style={styles.fundHouse}>{fund.house}</small>
              </td>
              <td style={styles.tableCell}>{fund.category}</td>
              <td style={styles.tableCell}>{fund.nav}</td>
              <td style={{ ...styles.tableCell, color: "green" }}>
                {fund.return1Y}%
              </td>
              <td style={{ ...styles.tableCell, color: "green" }}>
                {fund.return3Y}%
              </td>
              <td style={{ ...styles.tableCell, color: "green" }}>
                {fund.return5Y}%
              </td>
              <td
                style={{
                  ...styles.tableCell,
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
              <td style={styles.tableCell}>{"⭐".repeat(fund.rating)}</td>
              <td style={styles.tableCell}>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openModal(fund);
                  }}
                  style={styles.investButton}
                >
                  Invest
                </motion.a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.investmentsContainer}>
        <h2 style={styles.investmentsTitle}>Your Investments</h2>
        {mutualFundInvestments.length === 0 ? (
          <p style={styles.noInvestments}>
            You have no mutual fund investments.
          </p>
        ) : (
          <ul style={styles.investmentsList}>
            {mutualFundInvestments.map((investment) => (
              <li key={investment.id} style={styles.investmentItem}>
                <strong style={styles.investmentFundName}>Fund Name:</strong>{" "}
                {investment.fundName},
                <strong style={styles.investmentAmount}> Amount:</strong>{" "}
                {investment.amount},
                <strong style={styles.investmentDuration}> Duration:</strong>{" "}
                {investment.duration} months,
                <strong style={styles.investmentDate}> Date:</strong>{" "}
                {investment.date}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={styles.modalStyles}
        contentLabel="Invest Modal"
      >
        {selectedFund && (
          <>
            <h2 style={styles.modalTitle}>
              Investment Details - {selectedFund.name}
            </h2>
            <p style={styles.modalText}>
              Enter the amount you wish to invest (Wallet Balance: ₹
              {walletBalance}):
            </p>
            <input
              type="number"
              placeholder="Amount"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              style={styles.modalInput}
            />
            <p style={styles.modalText}>Select investment duration:</p>
            <div style={styles.modalDurationButtons}>
              <button
                onClick={() => setInvestmentDuration(1)}
                style={{
                  ...styles.durationButton,
                  backgroundColor:
                    investmentDuration === 1 ? "#007bff" : "white",
                  color: investmentDuration === 1 ? "white" : "black",
                }}
              >
                1Y
              </button>
              <button
                onClick={() => setInvestmentDuration(2)}
                style={{
                  ...styles.durationButton,
                  backgroundColor:
                    investmentDuration === 2 ? "#007bff" : "white",
                  color: investmentDuration === 2 ? "white" : "black",
                }}
              >
                2Y
              </button>
              <button
                onClick={() => setInvestmentDuration(3)}
                style={{
                  ...styles.durationButton,
                  backgroundColor:
                    investmentDuration === 3 ? "#007bff" : "white",
                  color: investmentDuration === 3 ? "white" : "black",
                }}
              >
                3Y
              </button>
            </div>
            <button
              onClick={calculateFinalAmount}
              style={styles.calculateButton}
            >
              Calculate Final Amount
            </button>
            {finalAmount && (
              <p style={styles.finalAmount}>Final Amount: ₹{finalAmount}</p>
            )}

            {/* Lottie Animations Added Here */}
            {isProcessing && (
              <Lottie
                animationData={processingOptions.animationData}
                height={150}
                width={150}
              />
            )}

            {isSuccess && (
              <Lottie
                animationData={successOptions.animationData}
                height={150}
                width={150}
              />
            )}
            {/* Conditional Rendering of Buttons */}
            {!isProcessing && !isSuccess && (
              <div style={styles.modalButtons}>
                <button onClick={closeModal} style={styles.cancelButton}>
                  Cancel
                </button>
                <button
                  onClick={confirmInvestment}
                  style={styles.confirmButton}
                >
                  Confirm Investment
                </button>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "auto",
    padding: "30px",
    borderRadius: "12px",
    backgroundColor: "#121212",
    fontFamily: "Arial, sans-serif",
    color: "white",
  },
  title: { fontWeight: "bold", color: "#007bff", marginBottom: "10px" },
  subtitle: { fontSize: "18px", color: "#ccc", marginBottom: "20px" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  },
  statCard: {
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#333",
    display: "flex",
    alignItems: "center",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
    border: "1px solid #444",
  },
  statNumber: {
    fontSize: "1.8rem",
    marginRight: "10px",
    fontWeight: "bold",
    color: "#007bff",
  },
  statLabel: { color: "#ccc", fontSize: "1rem" },
  statIcon: { color: "#007bff", fontSize: "1.8rem", marginRight: "10px" },
  statValue: { color: "green", fontWeight: "bold" },
  table: {
    width: "100%",
    borderCollapse: "collapse" as "collapse", // Explicitly defining the type
    marginBottom: "20px",
  },
  tableHeader: {
    backgroundColor: "#333",
    padding: "10px",
    textAlign: "left" as const,
    borderBottom: "1px solid #444",
  },
  tableCell: {
    padding: "10px",
    borderBottom: "1px solid #444",
    verticalAlign: "middle",
  },
  fundName: { fontWeight: "bold", color: "#007bff" },
  fundHouse: { color: "#999", fontSize: "0.8rem" },
  investButton: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "8px 15px",
    borderRadius: "5px",
    textDecoration: "none",
    display: "inline-block",
  },
  investmentsContainer: {
    backgroundColor: "#222",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  investmentsTitle: { color: "#007bff", marginBottom: "10px" },
  noInvestments: { color: "#ccc" },
  investmentsList: { listStyleType: "none", padding: 0 },
  investmentItem: {
    backgroundColor: "#333",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "5px",
  },
  investmentFundName: {
    fontWeight: "bold",
    marginRight: "5px",
    color: "#007bff",
  },
  investmentAmount: { marginRight: "5px" },
  investmentDuration: { marginRight: "5px" },
  investmentDate: { color: "#999", fontSize: "0.8rem" },
  modalStyles: {
    overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#121212",
      padding: "20px",
      borderRadius: "8px",
      width: "500px",
      maxWidth: "90%",
    },
  },
  modalTitle: { color: "#007bff", marginBottom: "10px" },
  modalText: { color: "#ccc", marginBottom: "10px" },
  modalInput: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    backgroundColor: "#333",
    color: "white",
    border: "1px solid #555",
    borderRadius: "5px",
  },
  modalDurationButtons: { display: "flex", gap: "10px", marginBottom: "10px" },
  durationButton: {
    padding: "8px 15px",
    border: "1px solid #555",
    borderRadius: "5px",
    color: "black",
    backgroundColor: "white",
    cursor: "pointer",
  },
  calculateButton: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "8px 15px",
    border: "none",
    borderRadius: "5px",
    marginRight: "10px",
    cursor: "pointer",
  },
  finalAmount: { color: "green", marginTop: "10px" },
  modalButtons: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
  },
  cancelButton: {
    backgroundColor: "red",
    color: "white",
    padding: "8px 15px",
    border: "none",
    borderRadius: "5px",
    marginRight: "10px",
    cursor: "pointer",
  },
  confirmButton: {
    backgroundColor: "green",
    color: "white",
    padding: "8px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default MutualFundsDashboard;
