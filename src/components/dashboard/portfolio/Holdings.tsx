import React, { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../AuthContext"; // Adjust path
import { db } from "../../Login/firebase"; // Firestore instance

interface StockHolding {
  symbol: string;
  quantity: number;
  price: number;
}

const useStockHoldings = () => {
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

  // Transform holdings and prices into an array of StockHolding objects
  const stockHoldings: StockHolding[] = Object.keys(holdings).map((symbol) => ({
    symbol,
    quantity: holdings[symbol],
    price: stockPrices[symbol] || 0,
  }));

  return { stockHoldings, loading, error };
};

export default useStockHoldings;
