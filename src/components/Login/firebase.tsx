import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCb7Ya8olAmJMPJt_fw4bR71KjEmUNaHjs",
  authDomain: "providence-trade-7d46b.firebaseapp.com",
  projectId: "providence-trade-7d46b",
  storageBucket: "providence-trade-7d46b.appspot.com",
  messagingSenderId: "465579269493",
  appId: "1:465579269493:web:1d082b84c93a52f133073c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth and Firestore instances
const auth = getAuth(app);
const githubProvider = new GithubAuthProvider();
const db = getFirestore(app);

export { auth, githubProvider, db, onAuthStateChanged, doc, getDoc };
export default app;
