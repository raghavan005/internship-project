import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth, db } from "../Login/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc, arrayUnion } from "firebase/firestore";
import "react-loading-skeleton/dist/skeleton.css";
import Placeholder from "react-bootstrap/Placeholder";

// Define the structure of a purchase history item
interface PurchaseHistoryItem {
  stock: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
  brokerageFee: number;
  totalAmount: number;
  date: string;
}

// Define Type for AuthContext
interface AuthContextType {
  user: any | null;
  userData: {
    walletAmount: number;
    purchaseHistory: PurchaseHistoryItem[];
  } | null;
  purchaseHistory: PurchaseHistoryItem[];
  updateWallet: (amount: number) => Promise<void>;
  recordTransaction: (
    stock: string,
    type: "buy" | "sell",
    quantity: number,
    price: number,
    brokerageFee: number
  ) => Promise<void>;
}

// Create the Auth Context
const AuthContext = createContext<AuthContextType | null>(null);

// Define Props Type
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userData, setUserData] = useState<{
    walletAmount: number;
    purchaseHistory: PurchaseHistoryItem[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(true);

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);

        try {
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserData({
              walletAmount: data.walletAmount ?? 0,
              purchaseHistory: Array.isArray(data.purchaseHistory)
                ? data.purchaseHistory
                : [],
            });
          } else {
            // Create user document if it doesn't exist
            await setDoc(userRef, { walletAmount: 0, purchaseHistory: [] });
            setUserData({ walletAmount: 0, purchaseHistory: [] });
          }
        } catch (error) {
          console.error("Error fetching/creating user data:", error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Update Wallet Function
  const updateWallet = async (amount: number) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);

    try {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const currentBalance = userSnap.data().walletAmount || 0;
        const newBalance = Math.max(0, currentBalance + amount);

        await updateDoc(userRef, { walletAmount: newBalance });
        setUserData((prev) =>
          prev ? { ...prev, walletAmount: newBalance } : null
        );
      }
    } catch (error) {
      console.error("Error updating wallet:", error);
    }
  };

  // ✅ Record Transaction Function (Stores Purchase History)
  const recordTransaction = async (
    stock: string,
    type: "buy" | "sell",
    quantity: number,
    price: number,
    brokerageFee: number
  ) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    const transaction: PurchaseHistoryItem = {
      stock,
      type,
      quantity,
      price: parseFloat(price.toFixed(2)), // Ensuring proper decimal format
      brokerageFee: parseFloat(brokerageFee.toFixed(2)),
      totalAmount: parseFloat((price + brokerageFee).toFixed(2)),
      date: new Date().toISOString(),
    };

    console.log("Recording transaction:", transaction);

    try {
      await updateDoc(userRef, {
        purchaseHistory: arrayUnion(transaction),
      });

      // Update local state
      setUserData((prev) =>
        prev
          ? { ...prev, purchaseHistory: [...prev.purchaseHistory, transaction] }
          : null
      );
      console.log("Transaction recorded successfully!");
    } catch (error) {
      console.error("Error recording transaction:", error);
    }
  };

  if (loading) {
    <div className="p-4">
      <Placeholder as="p" animation="glow">
        <Placeholder xs={6} />
      </Placeholder>
      <Placeholder as="p" animation="wave">
        <Placeholder xs={12} />
        <Placeholder xs={8} />
      </Placeholder>
    </div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        purchaseHistory: userData?.purchaseHistory || [],
        updateWallet,
        recordTransaction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for Authentication
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
