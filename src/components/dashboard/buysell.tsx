import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../Login/firebase";
import useStockData from "../hook/useStockData";
import { useAuth } from "../dashboard/AuthContext";

const CustomBox = () => {
  const stocks = useStockData();
  const { user, userData, updateWallet } = useAuth();
  const [selectedStock, setSelectedStock] = useState(
    stocks.length > 0 ? stocks[0].name : ""
  );
  const [quantity, setQuantity] = useState(1);
  const [userHoldings, setUserHoldings] = useState(0);
  const [equityDetails, setEquityDetails] = useState({
    invested: 0,
    current: 0,
    todayPL: 0,
    todayPLPercent: 0,
    totalPL: 0,
    totalPLPercent: 0,
  });

  useEffect(() => {
    const fetchHoldings = async () => {
      if (user && userData && selectedStock) {
        const userRef = doc(db, "users", user.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();

            // Fetch user holdings
            if (Array.isArray(data.purchases)) {
              const buyOrders = data.purchases.filter(
                (p) =>
                  p.stock.toLowerCase() === selectedStock.toLowerCase() &&
                  p.type === "buy"
              );
              const sellOrders = data.purchases.filter(
                (p) =>
                  p.stock.toLowerCase() === selectedStock.toLowerCase() &&
                  p.type === "sell"
              );
              const holdings =
                buyOrders.reduce((acc, p) => acc + p.quantity, 0) -
                sellOrders.reduce((acc, p) => acc + p.quantity, 0);
              setUserHoldings(holdings);
            } else {
              setUserHoldings(0);
            }

            // Fetch equity details (adjust field name if needed)
            if (data.equityDetails) {
              setEquityDetails(data.equityDetails);
            } else {
              setEquityDetails({
                invested: 0,
                current: 0,
                todayPL: 0,
                todayPLPercent: 0,
                totalPL: 0,
                totalPLPercent: 0,
              });
            }
          } else {
            setUserHoldings(0);
            setEquityDetails({
              invested: 0,
              current: 0,
              todayPL: 0,
              todayPLPercent: 0,
              totalPL: 0,
              totalPLPercent: 0,
            });
          }
        } catch (error) {
          console.error("Error fetching holdings:", error);
          setUserHoldings(0);
          setEquityDetails({
            invested: 0,
            current: 0,
            todayPL: 0,
            todayPLPercent: 0,
            totalPL: 0,
            totalPLPercent: 0,
          });
        }
      } else {
        setUserHoldings(0);
        setEquityDetails({
          invested: 0,
          current: 0,
          todayPL: 0,
          todayPLPercent: 0,
          totalPL: 0,
          totalPLPercent: 0,
        });
      }
    };
    fetchHoldings();
  }, [user, userData, selectedStock]);

  const stock = stocks.find((s) => s.name === selectedStock) || {
    name: "Select Stock",
    value: "0",
  };

  const stockPrice = parseFloat(stock.value.replace(/[^0-9.]/g, "")) * quantity;

  const handleTransaction = async (type: "buy" | "sell") => {
    if (!user || !userData) {
      alert("User data not found. Please login.");
      return;
    }

    if (selectedStock === "" || isNaN(stockPrice) || stockPrice <= 0) {
      alert("Invalid stock selection or price.");
      return;
    }

    if (type === "buy") {
      if (userData.walletAmount < stockPrice) {
        alert("Insufficient balance");
        return;
      }
      try {
        await updateWallet(-stockPrice);
      } catch (error) {
        alert("Error updating wallet.");
        return;
      }
    } else if (type === "sell") {
      if (quantity > userHoldings) {
        alert("Insufficient holdings to sell.");
        return;
      }
      try {
        await updateWallet(stockPrice);
      } catch (error) {
        alert("Error updating wallet.");
        return;
      }
    }

    const userRef = doc(db, "users", user.uid);

    try {
      await updateDoc(userRef, {
        purchases: arrayUnion({
          stock: stock.name,
          type,
          quantity,
          price: stockPrice.toFixed(2),
          date: new Date().toISOString(),
        }),
      });

      alert(
        `${type === "buy" ? "Bought" : "Sold"} ${quantity} ${
          stock.name
        } for $${stockPrice.toFixed(2)}`
      );
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Error saving transaction. Please try again.");
    }
  };

  return (
    <div
      style={{
        width: "calc(100% - 320px)",
        height: "61px",
        backgroundColor: "rgb(15, 15, 15)",
        color: "white",
        fontSize: "18px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",
        bottom: "0",
        left: "285px",
        padding: "0 20px",
        borderRadius: "5px 5px 0 0",
        boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.2)",
      }}
    >
      <motion.select
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        value={selectedStock}
        onChange={(e) => setSelectedStock(e.target.value)}
        style={{
          backgroundColor: "rgb(30, 30, 30)",
          color: "white",
          border: "none",
          padding: "10px 20px",
          marginRight: "10px",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        <option value="">Select Stock</option>
        {stocks.map((s) => (
          <option key={s.name} value={s.name}>
            {s.name}
          </option>
        ))}
      </motion.select>

      <span>
        {stock.name}: ${stock.value}
      </span>

      <motion.input
        type="number"
        value={quantity}
        min="1"
        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
        style={{
          backgroundColor: "rgb(30, 30, 30)",
          color: "white",
          border: "none",
          padding: "10px 20px",
          marginRight: "10px",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
          textAlign: "center",
          width: "80px",
        }}
      />

      <span>Holdings: {userHoldings}</span>

      <div>
        <motion.button
          onClick={() => handleTransaction("buy")}
          disabled={!selectedStock}
          style={{
            backgroundColor: selectedStock ? "green" : "gray",
            color: "white",
            border: "none",
            padding: "10px 20px",
            marginRight: "10px",
            borderRadius: "5px",
            cursor: selectedStock ? "pointer" : "not-allowed",
            fontSize: "16px",
          }}
        >
          Buy
        </motion.button>

        <motion.button
          onClick={() => handleTransaction("sell")}
          disabled={!selectedStock || userHoldings < 1}
          style={{
            backgroundColor: selectedStock ? "red" : "gray",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor:
              selectedStock && userHoldings >= 1 ? "pointer" : "not-allowed",
            fontSize: "16px",
          }}
        >
          Sell
        </motion.button>
      </div>
    </div>
  );
};

export default CustomBox;
