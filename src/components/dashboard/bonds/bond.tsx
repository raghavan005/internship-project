import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext";
import { handleBondPurchase } from "./handlebond";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import app from "../../Login/firebase"; // Adjust the path
import Lottie from "lottie-react"; // Import Lottie
import loadingAnimation from "../../../assets/animation/Animation - loading.json"; // Import your loading animation
import successAnimation from "../../../assets/animation/Animation -success.json"; // Import your success animation


interface Bond {
  id: number;
  name: string;
  interest: string;
  duration: string;
  price: string;
}

interface Purchase {
  id: string; // Change id to string, since firebase document id's are strings.
  bondName: string;
  investment: number;
  profit: number;
  totalReturn: number;
  purchaseDate: Date;
}

const BondSellingPage: React.FC = () => {
 const [selectedBond, setSelectedBond] = useState<Bond | null>(null);
 const [showModal, setShowModal] = useState<boolean>(false);
 const [investment, setInvestment] = useState<string>("");
 const [profit, setProfit] = useState<number | null>(null);
 const [totalReturn, setTotalReturn] = useState<number | null>(null);
 const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
 const { getWalletAmount, recordBondPurchase } = useAuth();
 const [userWallet, setUserWallet] = useState<number | null>(null);
 const investmentInputRef = useRef<HTMLInputElement>(null);
 const userId = "your_user_id";
 const [isLoading, setIsLoading] = useState(false);
 const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setUserWallet(getWalletAmount());
    fetchPurchaseHistory(); // Fetch purchase history on component mount
  }, [getWalletAmount]);

  useEffect(() => {
    if (showModal && investmentInputRef.current) {
      investmentInputRef.current.focus();
    }
  }, [showModal]);

  const bonds: Bond[] = [
    {
      id: 1,
      name: "Government Bond A",
      interest: "6.5%",
      duration: "10 Years",
      price: "$1,000",
    },
    {
      id: 2,
      name: "Corporate Bond B",
      interest: "8.2%",
      duration: "5 Years",
      price: "$5,000",
    },
    {
      id: 3,
      name: "Municipal Bond C",
      interest: "7.0%",
      duration: "7 Years",
      price: "$2,500",
    },
  ];

  const handleBuy = (bond: Bond): void => {
    setSelectedBond(bond);
    setShowModal(true);
    setProfit(null);
    setTotalReturn(null);
    setInvestment("");
  };

  const calculateReturn = () => {
    if (selectedBond) {
      const parsedInvestment = parseFloat(investment);
      if (isNaN(parsedInvestment)) return;
      const interestRate = parseFloat(selectedBond.interest.replace("%", ""));
      const calculatedProfit = (parsedInvestment * interestRate) / 100;
      setProfit(calculatedProfit);
      setTotalReturn(parsedInvestment + calculatedProfit);
    }
  };

  const confirmPurchase = async () => {
    const parsedInvestment = parseFloat(investment);
    if (isNaN(parsedInvestment)) return;

    if (
      selectedBond &&
      parsedInvestment > 0 &&
      profit !== null &&
      totalReturn !== null &&
      userWallet !== null &&
      userWallet >= parsedInvestment
    ) {
      setIsLoading(true); // Start loading animation
      setIsSuccess(false); // Reset success state

      try {
        if (selectedBond) {
          await handleBondPurchase(
            {
              id: selectedBond.id.toString(),
              interest: selectedBond.interest,
              name: selectedBond.name,
              price: selectedBond.price,
            },
            {
              investment: parsedInvestment,
              profit,
              totalReturn,
              userId: userId,
            },
            selectedBond.id,
            selectedBond.name
          );
          await recordBondPurchase(parsedInvestment);
          setUserWallet(getWalletAmount());
          fetchPurchaseHistory(); // Refetch purchase history after purchase
          setIsLoading(false); // Stop loading animation
          setIsSuccess(true); // Start success animation
        }
      } catch (error) {
        console.error("Error during purchase:", error);
        alert("Purchase failed. Please try again.");
        setIsLoading(false); // Stop loading animation on error
      }

      setTimeout(() => {
        setShowModal(false);
        setIsSuccess(false); // Reset success state
      }, 2000); // Hide modal and reset success after 2 seconds
    } else if (userWallet !== null && userWallet < parsedInvestment) {
      alert("Insufficient funds in your wallet.");
    }
  };

  const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setInvestment(value);
    }
  };

  const fetchPurchaseHistory = async () => {
    const db = getFirestore(app);
    const purchaseCollection = collection(db, "purchasedBonds");
    const q = query(purchaseCollection, where("userId", "==", userId)); // Filter by user ID

    try {
      const querySnapshot = await getDocs(q);
      const purchases: Purchase[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        purchases.push({
          id: doc.id,
          bondName: data.bondName,
          investment: data.investment,
          profit: data.profit,
          totalReturn: data.totalReturn,
          purchaseDate: data.purchaseDate.toDate(), // Convert Firestore Timestamp to Date
        });
      });
      purchases.sort(
        (a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime()
      ); //sort from newest to oldest.
      setPurchaseHistory(purchases);
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    }
  };

  return (
    <div
      className="container mt-5 text-white"
      style={{
        backgroundColor: "#121212",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <motion.div
        className="jumbotron text-center p-5 rounded"
        style={{ backgroundColor: "#1f1f1f" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Invest in Secure Bonds</h1>
        <p>Grow your wealth with our top-rated bonds</p>
        {userWallet !== null && <p>Wallet: ${userWallet.toFixed(2)}</p>}
      </motion.div>

      <div className="row mt-4">
        {bonds.map((bond) => (
          <motion.div
            key={bond.id}
            className="col-md-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: bond.id * 0.1 }}
          >
            <div
              className="card mb-4 shadow-sm"
              style={{ backgroundColor: "#2a2a2a", color: "white" }}
            >
              <div className="card-body">
                <h5 className="card-title">{bond.name}</h5>
                <p className="card-text">Interest Rate: {bond.interest}</p>
                <p className="card-text">Duration: {bond.duration}</p>
                <p className="card-text">Price: {bond.price}</p>
                <button
                  className="btn btn-success"
                  onClick={() => handleBuy(bond)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showModal && selectedBond && (
        <motion.div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="modal-dialog"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="modal-content"
              style={{ backgroundColor: "#333", color: "white" }}
            >
              <div className="modal-header">
                <h5 className="modal-title">Invest in {selectedBond.name}</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Enter Investment Amount:</p>
                <input
                  type="text"
                  className="form-control"
                  value={investment}
                  onChange={handleInvestmentChange}
                  ref={investmentInputRef}
                />
                <button className="btn btn-info mt-2" onClick={calculateReturn}>
                  Calculate Return
                </button>
                {profit !== null && totalReturn !== null && (
                  <div
                    className="mt-2 p-2 rounded"
                    style={{ backgroundColor: "#444", padding: "10px" }}
                  >
                    <p>Investment: ${parseFloat(investment).toFixed(2)}</p>
                    <p>Estimated Profit: ${profit.toFixed(2)}</p>
                    <p>
                      <strong>Total Return: ${totalReturn.toFixed(2)}</strong>
                    </p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={confirmPurchase}
                  disabled={isLoading || isSuccess}
                >
                  Confirm Purchase
                </button>
              </div>
            </div>
            {isLoading && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1051, // Ensure it's above the modal
                }}
              >
                <Lottie
                  animationData={loadingAnimation}
                  style={{ width: 200, height: 200 }}
                />
              </div>
            )}
            {isSuccess && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1051, // Ensure it's above the modal
                }}
              >
                <Lottie
                  animationData={successAnimation}
                  style={{ width: 200, height: 200 }}
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {purchaseHistory.length > 0 && (
        <div className="mt-5">
          <h2>Purchase History</h2>
          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Bond Name</th>
                <th>Investment</th>
                <th>Profit</th>
                <th>Total Return</th>
                <th>Purchase Date</th>
              </tr>
            </thead>
            <tbody>
              {purchaseHistory.map((purchase, index) => (
                <tr key={purchase.id}>
                  <td>{index + 1}</td>
                  <td>{purchase.bondName}</td>
                  <td>${purchase.investment.toFixed(2)}</td>
                  <td>${purchase.profit.toFixed(2)}</td>
                  <td>${purchase.totalReturn.toFixed(2)}</td>
                  <td>
                    {purchase.purchaseDate.toLocaleDateString()}{" "}
                    {purchase.purchaseDate.toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BondSellingPage;
