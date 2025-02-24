import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, XCircle } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

interface SearchBoxProps {
  apiKey: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ apiKey }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stockData, setStockData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStockPrice = async () => {
    if (!searchQuery) return;
    setError(null);
    setStockData(null);
    setLoading(true);

    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${searchQuery}&apikey=${apiKey}`
      );

      const stockInfo = response.data["Global Quote"];
      if (stockInfo && stockInfo["05. price"]) {
        setStockData({
          symbol: stockInfo["01. symbol"],
          price: stockInfo["05. price"],
          change: stockInfo["09. change"],
          changePercent: stockInfo["10. change percent"],
        });
      } else {
        setError("Stock not found. Please enter a valid symbol.");
      }
    } catch (err) {
      console.error("Error fetching stock data:", err);
      setError("Failed to fetch stock data. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toUpperCase());
    if (!e.target.value) {
      setStockData(null);
      setError(null);
    }
  };

  const clearResult = () => {
    setStockData(null);
    setError(null);
  };

  return (
    <div className="position-relative d-flex flex-column align-items-center p-3">
      {/* Search Box */}
      <div
        className="d-flex align-items-center w-100"
        style={{
          border: "2px solid #4A4A4A",
          backgroundColor: "rgba(255, 255, 255, 0.79)",
          padding: "10px",
          minWidth: "300px",
          maxWidth: "500px",
          width: "100%",
          height: "50px",
          display: "flex",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <input
          type="text"
          className="form-control border-0 bg-transparent text-white"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleInputChange}
          ref={(input) => {
            if (input) {
              input.style.color = "white"; // Ensures text is white
              input.style.setProperty("--placeholder-color", "white"); // For custom CSS variables
            }
          }}
          style={{
            flex: 1,
            border: "none",
            fontSize: "16px",
            outline: "none",
            padding: "5px",
          }}
        />
        <motion.button
          className="btn btn-dark ms-2"
          onClick={fetchStockPrice}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          style={{
            height: "40px",
            width: "40px",
            backgroundColor: "#555",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? "..." : <Search size={20} color="white" />}
        </motion.button>
      </div>

      {/* Stock Result Popup */}
      {stockData && (
        <motion.div
          className="card mt-3 p-3 shadow position-absolute"
          style={{
            top: "60px",
            width: "320px",
            zIndex: 1000,
            backgroundColor: "#1a1b26",
            borderRadius: "4px",
            color: "white",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            className="btn btn-sm position-absolute top-0 end-0 m-1"
            onClick={clearResult}
            style={{ border: "none", background: "transparent" }}
          >
            <XCircle size={18} className="text-danger" />
          </button>
          <h5 className="text-primary text-center">{stockData.symbol}</h5>
          <p className="mb-1">
            <strong>Price:</strong> ${stockData.price}
          </p>
          <p
            className={
              parseFloat(stockData.change) >= 0 ? "text-success" : "text-danger"
            }
          >
            <strong>Change:</strong> {stockData.change} (
            {stockData.changePercent})
          </p>
        </motion.div>
      )}

      {error && <p className="text-danger mt-2">{error}</p>}
    </div>
  );
};

export default SearchBox;
