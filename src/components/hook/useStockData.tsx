import { useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_FINHUB_API_KEY; 

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
        const symbols = ["AAPL", "GOOGL", "MSFT"]; 
        const responses = await Promise.all(
          symbols.map((symbol) =>
            fetch(
              `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
            )
          )
        );

        const data = await Promise.all(responses.map((res) => res.json()));

        console.log("API Response:", data); 

        const updatedStocks: Stock[] = symbols.map((symbol, index) => {
          const stockData = data[index];

          
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

        
        setStocks((prevStocks) => {
          const hasChanged =
            JSON.stringify(prevStocks) !== JSON.stringify(updatedStocks);
          return hasChanged ? updatedStocks : prevStocks;
        });
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStockData(); 
    const interval = setInterval(fetchStockData, 10000); 

    return () => clearInterval(interval); 
  }, []);

  return stocks;
};

export default useStockData;
