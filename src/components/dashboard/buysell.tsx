import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../Login/firebase";
import useStockData from "../hook/useStockData";
import { useAuth } from "../dashboard/AuthContext";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animation/Animation - loading.json";
import success from "../../assets/animation/Animation -success.json";

const CustomBox = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
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
  const [showBuyPopup, setShowBuyPopup] = useState(false);
  const [showSellPopup, setShowSellPopup] = useState(false);

  useEffect(() => {
    const fetchHoldings = async () => {
      if (user && userData && selectedStock) {
        const userRef = doc(db, "users", user.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();

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

      setSuccessAnimation(true);
      setTimeout(() => setSuccessAnimation(false), 2000);
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Error saving transaction. Please try again.");
    }
  };

  const handleBuyClick = () => {
    if (selectedStock) {
      setShowBuyPopup(true);
    }
  };

  const closeBuyPopup = () => {
    setShowBuyPopup(false);
  };

  const confirmBuy = async () => {
    setShowAnimation(true);
    await handleTransaction("buy");
    setShowBuyPopup(false);
    setShowAnimation(false);
  };

  const handleSellClick = () => {
    if (selectedStock && userHoldings > 0) {
      setShowSellPopup(true);
    }
  };

  const closeSellPopup = () => {
    setShowSellPopup(false);
  };

  const confirmSell = async () => {
    setShowAnimation(true);
    await handleTransaction("sell");
    setShowSellPopup(false);
    setShowAnimation(false);
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
        {stock.name}: {stock.value}
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "16px", color: "white" }}>QTY:</span>
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
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            textAlign: "center",
            width: "80px",
          }}
        />
      </div>

      <span>Holdings: {userHoldings}</span>

      <div>
        <motion.button
          whileHover={{ scale: 0.9 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBuyClick}
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
          whileHover={{ scale: 0.9 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSellClick}
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

      <AnimatePresence>
        {showBuyPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 600,
              damping: 20,
              duration: 0.1,
            }}
            style={{
              position: "fixed",
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgb(12, 20, 70)",
              color: "white",
              padding: "20px",
              borderRadius: "8px",
              backdropFilter: "blur(10px)",
              zIndex: 1000,
              fontFamily: "'Courier New', Courier, monospace",
            }}
          >
            <h2>Confirm Buy</h2>
            <p>Stock: {stock.name}</p>
            <p>Price: {stock.value}</p>
            <p>Quantity: {quantity}</p>
            <p>Total: ${stockPrice.toFixed(2)}</p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "10px",
              }}
            >
              <motion.button
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.9 }}
                onClick={confirmBuy}
                style={{
                  backgroundColor: "green",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "4px",
                }}
              >
                Confirm
              </motion.button>

              <motion.button
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeBuyPopup}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "4px",
                }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {showBuyPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          onClick={closeBuyPopup}
        ></div>
      )}

      <AnimatePresence>
        {showSellPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 600,
              damping: 20,
              duration: 0.1,
            }}
            style={{
              position: "fixed",
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgb(12, 20, 70)",
              color: "white",
              padding: "20px",
              borderRadius: "8px",
              backdropFilter: "blur(10px)",
              zIndex: 1000,
              fontFamily: "'Courier New', Courier, monospace",
            }}
          >
            <h2>Confirm Sell</h2>
            <p>Stock: {stock.name}</p>
            <p>Price: {stock.value}</p>
            <p>Holdings: {userHoldings}</p>
            <p>
              Quantity to Sell:
              <input
                type="number"
                value={quantity}
                min="1"
                max={userHoldings}
                onChange={(e) =>
                  setQuantity(
                    Math.min(userHoldings, Math.max(1, Number(e.target.value)))
                  )
                }
                style={{
                  backgroundColor: "rgb(50, 50, 50)",
                  color: "white",
                  border: "none",
                  padding: "8px",
                  borderRadius: "4px",
                  marginLeft: "8px",
                  width: "60px",
                }}
              />
            </p>
            <p>Total: ${stockPrice.toFixed(2)}</p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "10px",
              }}
            >
              <motion.button
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.9 }}
                onClick={confirmSell}
                style={{
                  backgroundColor: "green",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "4px",
                }}
              >
                Confirm
              </motion.button>
              <motion.button
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeSellPopup}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "4px",
                }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {showSellPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          onClick={closeSellPopup}
        ></div>
      )}

      {showAnimation && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1001,
          }}
        >
          <Lottie
            animationData={loadingAnimation}
            style={{ width: 200, height: 200 }}
          />
        </div>
      )}

      {successAnimation && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1002,
          }}
        >
          <Lottie animationData={success} style={{ width: 200, height: 200 }} />
        </div>
      )}
    </div>
  );
};

export default CustomBox;