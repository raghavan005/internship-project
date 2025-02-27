import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import app from "../../Login/firebase"; // Adjust path if needed
import { useState, useEffect } from "react";

interface BondHolding {
  bondId: number;
  bondName: string;
  investment: number;
  profit: number;
  totalReturn: number;
  userId: string;
  purchaseDate: Date;
}

interface BondHoldingData {
  bondHoldings: BondHolding[];
  loading: boolean;
  error: string | null;
}

export const useBondHoldings = (userId: string | null): BondHoldingData => {
  const [bondHoldings, setBondHoldings] = useState<BondHolding[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBondHoldings = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      const db = getFirestore(app);
      const purchaseCollection = collection(db, "purchasedBonds");
      const q = query(purchaseCollection, where("userId", "==", userId));

      try {
        const querySnapshot = await getDocs(q);
        const holdings: BondHolding[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          

          return {
            bondId: data.bondId ?? 0,
            bondName: data.bondName ?? "Unknown",
            investment: data.investment ?? 0,
            profit: data.profit ?? 0,
            totalReturn: data.totalReturn ?? 0,
            userId: data.userId ?? "",
            purchaseDate: data.purchaseDate?.toDate
              ? data.purchaseDate.toDate()
              : new Date(),
          };
        });

        setBondHoldings(holdings);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchBondHoldings();
  }, [userId]);

  return { bondHoldings, loading, error };
};
