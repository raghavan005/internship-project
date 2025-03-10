import React, { useEffect, useState } from "react";
import { useAuth } from "../dashboard/AuthContext";
import { db } from "../Login/firebase";
import { doc, onSnapshot } from "firebase/firestore";

interface PurchaseEntry {
  stock: string;
  type: "buy" | "sell";
  quantity: number;
  price: string;
  date: string;
}

const PurchaseHistory: React.FC = () => {
  const { user } = useAuth();
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [holdings, setHoldings] = useState<{ [stock: string]: number }>({}); 

  useEffect(() => {
    if (!user) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const userRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(
      userRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();

          if (Array.isArray(data.purchases)) {
            const filteredPurchases = data.purchases.filter(
              (entry) =>
                entry.stock !== "" &&
                entry.type !== "" &&
                entry.quantity !== "" &&
                entry.price !== "" &&
                entry.date !== ""
            );
            setPurchaseHistory(filteredPurchases);

            // Calculate holdings
            const newHoldings: { [stock: string]: number } = {};
            filteredPurchases.forEach((entry) => {
              const stock = entry.stock;
              if (!newHoldings[stock]) {
                newHoldings[stock] = 0;
              }
              if (entry.type === "buy") {
                newHoldings[stock] += entry.quantity;
              } else if (entry.type === "sell") {
                newHoldings[stock] -= entry.quantity;
              }
            });
            setHoldings(newHoldings);
          } else {
            setPurchaseHistory([]);
            setHoldings({});
          }
        } else {
          setError("No purchase history found.");
          setHoldings({});
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching purchase history:", err);
        setError("Error loading purchase history.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Purchase History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : purchaseHistory.length === 0 ? (
        <p>No purchase history available.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeaderStyle}>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Quantity</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Holdings</th>
            </tr>
          </thead>
          <tbody>
            {purchaseHistory.map((entry, index) => (
              <tr
                key={index}
                style={index % 2 === 0 ? rowStyle : alternateRowStyle}
              >
                <td style={tdStyle}>{entry.stock}</td>
                <td
                  style={{
                    ...tdStyle,
                    color: entry.type === "buy" ? "green" : "red",
                  }}
                >
                  {entry.type.toUpperCase()}
                </td>
                <td style={tdStyle}>{entry.quantity}</td>
                <td style={tdStyle}>${entry.price}</td>
                <td style={tdStyle}>{new Date(entry.date).toLocaleString()}</td>
                <td style={tdStyle}>{holdings[entry.stock] || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};


const containerStyle: React.CSSProperties = {
  padding: "20px",
  color: "white",
  textAlign: "center",
};

const headingStyle: React.CSSProperties = {
  marginBottom: "15px",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "rgb(30, 30, 30)",
};

const tableHeaderStyle: React.CSSProperties = {
  backgroundColor: "rgb(50, 50, 50)",
  color: "white",
};

const thStyle: React.CSSProperties = {
  padding: "10px",
  borderBottom: "2px solid #ddd",
};

const tdStyle: React.CSSProperties = {
  padding: "10px",
  textAlign: "center",
};

const rowStyle: React.CSSProperties = {
  backgroundColor: "rgb(20, 20, 20)",
};

const alternateRowStyle: React.CSSProperties = {
  backgroundColor: "rgb(15, 15, 15)",
};

export default PurchaseHistory;
