

import React, { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../AuthContext";
import { db } from "../../Login/firebase";
import { motion } from "framer-motion";

interface MutualFundInvestment {
  id?: string;
  fundName: string;
  amount: string;
  duration: number;
  date: string;
}

const Display: React.FC = () => {
  const { user } = useAuth();
  const [mutualFundInvestments, setMutualFundInvestments] = useState<
    MutualFundInvestment[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (Array.isArray(data.mutualFundInvestments)) {
            setMutualFundInvestments(data.mutualFundInvestments);
          } else {
            setMutualFundInvestments([]);
          }
        } else {
          setMutualFundInvestments([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching mutual fund investments:", error);
        setError("Failed to load mutual fund investments.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (loading) return <p>Loading mutual fund investments...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (mutualFundInvestments.length === 0)
    return <p>No mutual fund investments available.</p>;

  
  const getFundImage = (fundName: string): string => {
    
    return ""; 
  };

  const boxStyle: React.CSSProperties = {
    position: "relative",
    width: "90%",
    maxWidth: "1200px",
    margin: "20px auto",
    backgroundColor: "rgb(19, 23, 34)",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    padding: "20px",
    color: "#E2E8F0",
    fontFamily: "'Inter', sans-serif",
  };

  const holdingsContainerStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    justifyContent: "center",
  };

  const holdingItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#2D3748",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
  };

  const fundImageStyle: React.CSSProperties = {
    width: "60px",
    height: "60px",
    marginRight: "20px",
    borderRadius: "50%",
    objectFit: "cover",
  };

  const fundInfoStyle: React.CSSProperties = {
    textAlign: "left",
    flex: 1,
  };

  const fundNameStyle: React.CSSProperties = {
    fontWeight: "600",
    fontSize: "1.1rem",
    marginBottom: "5px",
    color: "#CBD5E0",
  };

  const headingStyle: React.CSSProperties = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "24px",
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: "20px",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  return (
    <motion.div
      style={boxStyle}
      whileHover={{ boxShadow: "0 6px 16px rgba(0, 0, 0, 0.3)" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <h2 style={headingStyle}>Mutual Fund Investments</h2>
      <div style={holdingsContainerStyle}>
        {mutualFundInvestments.map((fund, index) => (
          <motion.div
            key={index}
            style={holdingItemStyle}
            whileHover={{
              translateY: -3,
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <img
              src={getFundImage(fund.fundName)}
              alt={`${fund.fundName} Logo`}
              style={fundImageStyle}
            />
            <div style={fundInfoStyle}>
              <p style={fundNameStyle}>{fund.fundName}</p>
              <p>Amount: ${fund.amount}</p>
              <p>Duration: {fund.duration} months</p>
              <p>Date: {fund.date}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Display;
