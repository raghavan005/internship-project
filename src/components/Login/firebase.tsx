import { initializeApp } from "firebase/app";
import {
  getAuth,
  GithubAuthProvider,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const githubProvider = new GithubAuthProvider();
const db = getFirestore(app);


setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Session persistence set to LOCAL"))
  .catch((error) => console.error("Error setting persistence:", error));

export { auth, githubProvider, db, onAuthStateChanged, doc, getDoc };
export default app;
