import React, { useEffect, useState } from "react";
import { db } from "../Login/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../dashboard/AuthContext";

interface HoldingsData {
  invested: number;
  current: number;
  todayPL: number;
  todayPLPercent: number;
  totalPL: number;
  totalPLPercent: number;
}

const Box = () => {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState<HoldingsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHoldings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const holdingsRef = collection(db, "holdings");
        const q = query(holdingsRef, where("userId", "==", user.uid));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const data = snapshot.docs.map((doc) =>
            doc.data()
          )[0] as HoldingsData;
          setHoldings(data);
        } else {
          setHoldings(null);
        }
      } catch (error) {
        console.error("Error fetching holdings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHoldings();
  }, [user]);

  return (
    <div
      className="d-flex flex-column align-items-center position-absolute"
      style={{
        backgroundColor: "rgb(19, 23, 34)",
        width: "800px",
        height: "392px",
        right: "20px",
        top: "39%",
        position: "absolute", // ✅ Changed from 'fixed' to 'absolute'
        borderRadius: "8px",
        border: "none",
        transform: "translateY(-60%)",
        padding: "20px",
        boxSizing: "border-box",
        zIndex: 1000,
      }}
    >
      <div
        className="w-100"
        style={{
          backgroundColor: "black",
          borderRadius: "8px",
          padding: "20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "calc(100% - 15px)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h5>Equity</h5>
          <a href="#" className="text-primary text-decoration-none">
            Details
          </a>
        </div>
        {loading ? (
          <p className="text-white text-center">Loading...</p>
        ) : holdings ? (
          <div className="d-flex justify-content-between">
            <div>
              <small>Invested</small>
              <h6 className="fw-bold">{holdings.invested.toFixed(2)}</h6>
            </div>
            <div>
              <small>Current</small>
              <h6 className="fw-bold">{holdings.current.toFixed(2)}</h6>
            </div>
            <div className="text-right">
              <small>Today's P&L</small>
              <h6
                className={
                  holdings.todayPL >= 0 ? "text-success" : "text-danger"
                }
              >
                {holdings.todayPL.toFixed(2)} (
                {holdings.todayPLPercent.toFixed(2)}%)
              </h6>
              <small>Total P&L</small>
              <h6
                className={
                  holdings.totalPL >= 0 ? "text-success" : "text-danger"
                }
              >
                {holdings.totalPL.toFixed(2)} (
                {holdings.totalPLPercent.toFixed(2)}%)
              </h6>
            </div>
          </div>
        ) : (
          <p className="text-white text-center">No holdings found</p>
        )}
      </div>
    </div>
  );
};

export default Box;
