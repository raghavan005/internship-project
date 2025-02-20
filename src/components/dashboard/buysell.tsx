import React, { useState } from "react";
import { motion } from "framer-motion";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../Login/firebase"; // Ensure Firebase is correctly imported
import useStockData from "../hook/useStockData";
import { useAuth } from "../dashboard/AuthContext";

const CustomBox = () => {
  const stocks = useStockData();
  const { user, userData, updateWallet } = useAuth();
  const [selectedStock, setSelectedStock] = useState(
    stocks.length > 0 ? stocks[0].name : ""
  );
  const [quantity, setQuantity] = useState(1);

  const stock = stocks.find((s) => s.name === selectedStock) || {
    name: "Select Stock",
    value: "0",
  };

  // Convert stock value to a valid number
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
      await updateWallet(-stockPrice); // Deduct from wallet
    } else if (type === "sell") {
      await updateWallet(stockPrice); // Add to wallet
    }

    // Reference to user's Firestore document
    const userRef = doc(db, "users", user.uid);

    try {
      await updateDoc(userRef, {
        purchaseHistory: arrayUnion({
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
      {/* Dropdown to select stock */}
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

      {/* Stock Name and Price */}
      <span>
        {stock.name}: ${stock.value}
      </span>

      {/* Quantity Input */}
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

      {/* Buy and Sell Buttons */}
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
          disabled={!selectedStock}
          style={{
            backgroundColor: selectedStock ? "red" : "gray",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: selectedStock ? "pointer" : "not-allowed",
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
