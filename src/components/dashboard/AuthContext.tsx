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
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";


interface PurchaseHistoryItem {
  stock: string;
  type: "buy" | "sell";
  quantity: number;
  price: string;
  date: string;
}


interface MutualFundInvestment {
  id?: string;
  fundName: string;
  amount: string;
  duration: number;
  date: string;
  investmentType: "mutualFund";
}


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
  // Add these lines for bond integration
  getWalletAmount: () => number | null;
  recordBondPurchase: (investment: number) => Promise<void>;
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

            const purchases =
              data.purchaseHistory &&
              data.purchaseHistory[0] &&
              data.purchaseHistory[0].purchases
                ? data.purchaseHistory[0].purchases
                : [];

            setUserData({
              walletAmount: data.walletAmount ?? 0,
              purchaseHistory: purchases,
            });

            await getUserMutualFunds();
          } else {
            await setDoc(userRef, { walletAmount: 0, purchaseHistory: [] });
            setUserData({ walletAmount: 0, purchaseHistory: [] });
            setMutualFundInvestments([]);
          }
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

  const recordTransaction = async (
    stock: string,
    type: "buy" | "sell",
    quantity: number,
    price: number,
    brokerageFee: number
  ) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const totalAmount = price + brokerageFee;

    const transaction: PurchaseHistoryItem = {
      stock,
      type,
      quantity,
      price: price.toFixed(2),
      date: new Date().toISOString(),
    };

    try {
      await updateDoc(userRef, {
        purchaseHistory: [{ purchases: arrayUnion(transaction) }],
      });

      setUserData((prev) =>
        prev
          ? {
              ...prev,
              purchaseHistory: [...(prev.purchaseHistory || []), transaction],
            }
          : null
      );

      if (type === "buy") {
        await updateWallet(-totalAmount);
      }
    } catch (error) {
      console.error("Error recording transaction:", error);
    }
  };

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
      await getUserMutualFunds();
    } catch (error) {
      console.error("Error recording mutual fund investment:", error);
    }
  };

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

  const getWalletAmount = () => {
    return userData?.walletAmount || null;
  };

  const recordBondPurchase = async (investment: number) => {
    if (!user) return;
    await updateWallet(-investment);
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
        
        getWalletAmount,
        recordBondPurchase,
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
