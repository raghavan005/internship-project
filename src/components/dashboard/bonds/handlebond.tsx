import { collection, addDoc, getFirestore } from "firebase/firestore";
import app from "../../Login/firebase"; // Corrected import
import { auth } from "../../Login/firebase"; // Import auth

interface BondData {
  id: string;
  interest: string;
  name: string;
  price: string;
}

interface PurchaseData {
  bondId: number;
  bondName: string;
  investment: number;
  profit: number;
  totalReturn: number;
  userId: string;
  purchaseDate: Date;
}

export const handleBondPurchase = async (
  bondData: BondData,
  purchaseData: Omit<PurchaseData, "bondId" | "bondName" | "purchaseDate">,
  bondId: number,
  bondName: string
) => {
  const db = getFirestore(app);
  const purchaseCollection = collection(db, "purchasedBonds");

  try {
    const currentUser = auth.currentUser; // Get the current user
    if (!currentUser) {
      throw new Error("User not logged in."); // Handle case where user is not logged in
    }

    await addDoc(purchaseCollection, {
      bondId: bondId,
      bondName: bondName,
      investment: purchaseData.investment,
      profit: purchaseData.profit,
      totalReturn: purchaseData.totalReturn,
      userId: currentUser.uid, // Use the current user's uid
      purchaseDate: new Date(),
    });

    console.log("Bond purchase recorded successfully.");
  } catch (error) {
    console.error("Error recording bond purchase:", error);
    throw error;
  }
};
