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
        className="d-flex align-items-center w-100 rounded-pill overflow-hidden"
        style={{
          border: "1px solid #ccc",
          backgroundColor: "#333",
          padding: "5px",
          width: "100%", // Ensure it takes full width
        }}
      >
        <input
          type="text"
          className="form-control border-0 bg-transparent text-white"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleInputChange}
          style={{ boxShadow: "none", width: "100%" }}
        />
        <motion.button
          className="btn btn-light rounded-circle ms-2 p-2"
          onClick={fetchStockPrice}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={loading}
        >
          {loading ? "..." : <Search size={20} />}
        </motion.button>
      </div>

      {/* Stock Result Popup */}
      {stockData && (
        <motion.div
          className="card mt-3 p-3 shadow position-absolute"
          style={{
            top: "60px",
            width: "300px",
            zIndex: 1000,
            backgroundColor: "#1a1b26",
            borderRadius: "8px",
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
