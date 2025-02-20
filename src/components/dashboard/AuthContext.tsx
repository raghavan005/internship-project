import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth, db } from "../Login/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore"; // Import setDoc

// Define Type for AuthContext
interface AuthContextType {
  user: any | null;
  userData: any | null;
  updateWallet: (amount: number) => Promise<void>;
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
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(true); // Set loading to true while fetching data

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);

        try {
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserData(userSnap.data());
          } else {
            // Create user document if it doesn't exist
            await setDoc(userRef, { walletAmount: 0 }); // Initialize wallet amount
            setUserData({ walletAmount: 0 });
          }
        } catch (error) {
          console.error("Error fetching/creating user data:", error);
          // Handle error, e.g., display an error message
        }
      } else {
        setUserData(null);
      }
      setLoading(false); // Set loading to false after data is fetched or error occurs
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
        const newBalance = Math.max(0, currentBalance + amount); // Prevent negative balance

        await updateDoc(userRef, { walletAmount: newBalance });
        setUserData((prev: any) => ({ ...prev, walletAmount: newBalance }));
      }
    } catch (error) {
      console.error("Error updating wallet:", error);
      // Handle error, e.g., display an error message to the user
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  return (
    <AuthContext.Provider value={{ user, userData, updateWallet }}>
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
