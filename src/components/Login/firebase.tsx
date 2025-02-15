import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCb7Ya8olAmJMPJt_fw4bR71KjEmUNaHjs",
  authDomain: "providence-trade-7d46b.firebaseapp.com",
  projectId: "providence-trade-7d46b",
  storageBucket: "providence-trade-7d46b.appspot.com", // ✅ Ensure this is correct
  messagingSenderId: "465579269493",
  appId: "1:465579269493:web:1d082b84c93a52f133073c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ Correct Firestore instance export
export default app;
