import React, { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../dashboard/AuthContext"; // Auth hook
import { db } from "../Login/firebase"; // Firestore instance
import img from "../../assets/images/1200x630wa.png";
import { motion } from "framer-motion";
import apple from "../../assets/images/8ed3d547-94ff-48e1-9f20-8c14a7030a02_2000x2000.jpg";
import micro from "../../assets/images/microsoft-logo-icon-editorial-free-vector.jpg";

interface MutualFund {
  fundName: string;
  quantity: number;
  purchasePrice: number;
}


const MutualFundHoldings = () => {
  const { user } = useAuth();
  const [mutualFundHoldings, setMutualFundHoldings] = useState<MutualFund[]>(
    []
  );
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
          if (Array.isArray(data.mutualFunds)) {
            setMutualFundHoldings(data.mutualFunds);
          } else {
            setMutualFundHoldings([]);
          }
        } else {
          setMutualFundHoldings([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching mutual fund data:", error);
        setError("Failed to load mutual fund holdings.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (loading) return <p>Loading mutual fund data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (mutualFundHoldings.length === 0) return <p>No mutual funds available.</p>;
  return (
    <motion.div
      style={{
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#f8f9fa",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        width: "300px",
        margin: "20px auto",
      }}
      whileHover={{ boxShadow: "0 6px 16px rgba(0, 0, 0, 0.3)" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
        Mutual Fund Holdings
      </h2>
      {mutualFundHoldings.map((fund, index) => (
        <motion.div
          key={index}
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginBottom: "8px",
            backgroundColor: "#fff",
          }}
          whileHover={{
            translateY: -3,
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ fontWeight: "bold" }}>{fund.fundName}</p>
            <p>Quantity: {fund.quantity}</p>
            <p>Purchase Price: ${fund.purchasePrice}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const Holdings = () => {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState<{ [stock: string]: number }>({});
  const [stockPrices, setStockPrices] = useState<{ [stock: string]: number }>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  const API_KEY = "cuqpds1r01qhaag2qr4gcuqpds1r01qhaag2qr50"; // Finnhub API Key

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    // Listen for real-time updates
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (Array.isArray(data.purchases)) {
          const stockHoldings: { [stock: string]: number } = {};

          // Calculate net holdings
          data.purchases.forEach((p) => {
            const stock = p.stock;
            if (!stockHoldings[stock]) stockHoldings[stock] = 0;
            stockHoldings[stock] += p.type === "buy" ? p.quantity : -p.quantity;
          });

          setHoldings(stockHoldings);
        }
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [user]);

  useEffect(() => {
    const fetchStockPrices = async () => {
      setError(null);
      setLoading(true);

      try {
        const stockSymbols = Object.keys(holdings);
        if (stockSymbols.length === 0) {
          setStockPrices({});
          setLoading(false);
          return;
        }

        const responses = await Promise.all(
          stockSymbols.map((stock) =>
            fetch(
              `https://finnhub.io/api/v1/quote?symbol=${stock}&token=${API_KEY}`
            )
          )
        );

        const data = await Promise.all(
          responses.map((res) => (res.ok ? res.json() : null))
        );

        const newStockPrices: { [stock: string]: number } = {};
        stockSymbols.forEach((stock, index) => {
          if (data[index] && data[index].c !== undefined) {
            newStockPrices[stock] = data[index].c;
          } else {
            newStockPrices[stock] = 0;
          }
        });

        setStockPrices(newStockPrices);
      } catch (err) {
        console.error("Error fetching stock prices:", err);
        setError("Failed to fetch stock prices.");
      } finally {
        setLoading(false);
      }
    };

    if (Object.keys(holdings).length > 0) {
      fetchStockPrices();
    }
  }, [holdings]);
  

  // Function to get stock logos
  const getStockImage = (stockName: string): string => {
    const images: { [key: string]: string } = {
      AAPL: apple,
      GOOGL: img,
      MSFT: micro,
    };
    return images[stockName] || "";
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
      <h2 style={headingStyle}>User Holdings</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : Object.keys(holdings).length === 0 ? (
        <p>No holdings available.</p>
      ) : (
        <div style={holdingsContainerStyle}>
          {Object.entries(holdings).map(([stock, quantity]) => {
            const stockValue = stockPrices[stock]
              ? `$${stockPrices[stock].toFixed(2)}`
              : "N/A";
            let totalValue = "N/A";

            if (stockPrices[stock]) {
              totalValue = (stockPrices[stock] * quantity).toFixed(2);
            }

            return (
              <motion.div
                key={stock}
                style={holdingItemStyle}
                whileHover={{
                  translateY: -3,
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <img
                  src={getStockImage(stock)}
                  alt={`${stock} Logo`}
                  style={stockImageStyle}
                />
                <div style={stockInfoStyle}>
                  <p style={stockNameStyle}>{stock}</p>
                  <p>Quantity: {quantity}</p>
                  <p>Price: {stockValue}</p>
                  <p>Total: ${totalValue}</p>
                </div>
              </motion.div>
            );
            
          })}
          
        </div>
      )}
    </motion.div>
  );
  
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

const stockImageStyle: React.CSSProperties = {
  width: "60px",
  height: "60px",
  marginRight: "20px",
  borderRadius: "50%",
  objectFit: "cover",
};

const stockInfoStyle: React.CSSProperties = {
  textAlign: "left",
  flex: 1,
};

const stockNameStyle: React.CSSProperties = {
  fontWeight: "600",
  fontSize: "1.1rem",
  marginBottom: "5px",
  color: "#CBD5E0",
};

export default Holdings;