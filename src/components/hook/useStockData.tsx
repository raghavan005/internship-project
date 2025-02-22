import { useState, useEffect } from "react";

const API_KEY = "cuqpds1r01qhaag2qr4gcuqpds1r01qhaag2qr50"; // Replace with your Finnhub API key

interface Stock {
  name: string;
  value: string;
  change: string;
  positive: boolean;
}

const useStockData = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const symbols = ["AAPL", "GOOGL", "MSFT"]; // Add more stock symbols as needed
        const responses = await Promise.all(
          symbols.map((symbol) =>
            fetch(
              `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
            )
          )
        );

        const data = await Promise.all(responses.map((res) => res.json()));

        console.log("API Response:", data); // Debugging: Check API response in console

        const updatedStocks: Stock[] = symbols.map((symbol, index) => {
          const stockData = data[index];

          // Check if stockData is valid before using toFixed()
          if (
            !stockData ||
            stockData.c === undefined ||
            stockData.d === undefined
          ) {
            console.warn(`No valid data for ${symbol}`, stockData);
            return {
              name: symbol,
              value: "N/A",
              change: "N/A",
              positive: false,
            };
          }

          return {
            name: symbol,
            value: `$${stockData.c.toFixed(2)}`,
            change: `${stockData.d.toFixed(2)} (${stockData.dp.toFixed(2)}%)`,
            positive: stockData.d >= 0,
          };
        });

        // Only update state if prices have changed
        setStocks((prevStocks) => {
          const hasChanged =
            JSON.stringify(prevStocks) !== JSON.stringify(updatedStocks);
          return hasChanged ? updatedStocks : prevStocks;
        });
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStockData(); // Fetch initially
    const interval = setInterval(fetchStockData, 10000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return stocks;
};

export default useStockData;
