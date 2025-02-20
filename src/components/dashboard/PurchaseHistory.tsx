import React, { useEffect, useState } from "react";
import { useAuth } from "../dashboard/AuthContext";
import { db } from "../Login/firebase";
import { doc, getDoc } from "firebase/firestore";

// Define the type for purchase history entries
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

  useEffect(() => {
    if (!user) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const fetchPurchaseHistory = async () => {
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      console.log("Fetched Firestore Data:", data); // Debugging

      if (Array.isArray(data.purchases)) {
        setPurchaseHistory(data.purchases);
      } else {
        console.warn("Firestore 'purchases' is not an array:", data.purchases);
        setPurchaseHistory([]); // Prevent errors
      }
    } else {
      setError("No purchase history found.");
    }
  } catch (err) {
    console.error("Error fetching purchase history:", err);
    setError("Error loading purchase history.");
  } finally {
    setLoading(false);
  }
};

    fetchPurchaseHistory();
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Styles
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
