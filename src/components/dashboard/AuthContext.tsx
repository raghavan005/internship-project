import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth, db } from "../Login/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  arrayUnion,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

// Stock Transaction Interface
interface PurchaseHistoryItem {
  stock: string;
  type: "buy" | "sell";
  quantity: number;
  price: string;
  brokerageFee: string;
  totalAmount: string;
  date: string;
  investmentType: "stock"; // Explicitly defining investment type
}

// Mutual Fund Investment Interface
interface MutualFundInvestment {
  id?: string;
  fundName: string;
  amount: string;
  duration: number;
  date: string;
  investmentType: "mutualFund"; // Explicitly defining investment type
}

// Auth Context Type
interface AuthContextType {
  user: any | null;
  userData: {
    walletAmount: number;
    purchaseHistory: PurchaseHistoryItem[];
  } | null;
  purchaseHistory: PurchaseHistoryItem[];
  mutualFundInvestments: MutualFundInvestment[];
  updateWallet: (amount: number) => Promise<void>;
  recordTransaction: (
    stock: string,
    type: "buy" | "sell",
    quantity: number,
    price: number,
    brokerageFee: number
  ) => Promise<void>;
  recordMutualFundInvestment: (
    fundName: string,
    amount: number,
    duration: number
  ) => Promise<void>;
  getUserMutualFunds: () => Promise<void>;
  deleteMutualFund: (fundId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userData, setUserData] = useState<{
    walletAmount: number;
    purchaseHistory: PurchaseHistoryItem[];
  } | null>(null);
  const [mutualFundInvestments, setMutualFundInvestments] = useState<
    MutualFundInvestment[]
  >([]);
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
            // Ensure only stock transactions are stored
            const filteredStocks = (data.purchaseHistory || []).filter(
              (item: any) => item.investmentType === "stock"
            );

            setUserData({
              walletAmount: data.walletAmount ?? 0,
              purchaseHistory: filteredStocks,
            });
          } else {
            await setDoc(userRef, { walletAmount: 0, purchaseHistory: [] });
            setUserData({ walletAmount: 0, purchaseHistory: [] });
          }

          // Fetch Mutual Funds Separately
          await getUserMutualFunds();
        } catch (error) {
          console.error("Error fetching/creating user data:", error);
        }
      } else {
        setUserData(null);
        setMutualFundInvestments([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to update wallet amount
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

  // Function to record a stock transaction
  const recordTransaction = async (
    stock: string,
    type: "buy" | "sell",
    quantity: number,
    price: number,
    brokerageFee: number
  ) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const totalAmount = price + brokerageFee; // Calculate total amount

    const transaction: PurchaseHistoryItem = {
      stock,
      type,
      quantity,
      price: price.toFixed(2),
      brokerageFee: brokerageFee.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      date: new Date().toISOString(),
      investmentType: "stock", // Explicitly setting type to stock
    };

    try {
      await updateDoc(userRef, {
        purchaseHistory: arrayUnion(transaction),
      });

      setUserData((prev) =>
        prev
          ? { ...prev, purchaseHistory: [...prev.purchaseHistory, transaction] }
          : null
      );

      // Deduct from wallet if it's a "buy" transaction
      if (type === "buy") {
        await updateWallet(-totalAmount);
      }
    } catch (error) {
      console.error("Error recording transaction:", error);
    }
  };

  // Function to record a mutual fund investment
  const recordMutualFundInvestment = async (
    fundName: string,
    amount: number,
    duration: number
  ) => {
    if (!user || !userData) return;

    const mutualFundsRef = collection(db, "mutualFunds");

    const investment: MutualFundInvestment = {
      fundName,
      amount: amount.toFixed(2),
      duration,
      date: new Date().toISOString(),
      investmentType: "mutualFund",
    };

    try {
      await addDoc(mutualFundsRef, {
        userId: user.uid,
        ...investment,
      });

      await updateWallet(-amount);
      await getUserMutualFunds(); // Refetch updated investments
    } catch (error) {
      console.error("Error recording mutual fund investment:", error);
    }
  };

  // Function to fetch all mutual fund investments
  const getUserMutualFunds = async () => {
    if (!user) return;

    const mutualFundsRef = collection(db, "mutualFunds");
    const q = query(mutualFundsRef, where("userId", "==", user.uid));

    try {
      const querySnapshot = await getDocs(q);
      const investments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MutualFundInvestment[];

      setMutualFundInvestments(investments);
    } catch (error) {
      console.error("Error fetching mutual funds:", error);
    }
  };

  // Function to delete a mutual fund investment
  const deleteMutualFund = async (fundId: string) => {
    if (!user) return;

    const mutualFundRef = doc(db, "mutualFunds", fundId);

    try {
      await deleteDoc(mutualFundRef);
      setMutualFundInvestments((prev) =>
        prev.filter((fund) => fund.id !== fundId)
      );
    } catch (error) {
      console.error("Error deleting mutual fund:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        purchaseHistory: userData?.purchaseHistory || [],
        mutualFundInvestments,
        updateWallet,
        recordTransaction,
        recordMutualFundInvestment,
        getUserMutualFunds,
        deleteMutualFund,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
