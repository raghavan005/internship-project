import React from "react";
import { motion } from "framer-motion";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "./firebase"; // Ensure correct path
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleSignInImage from "../../assets/images/icons8-google-240.png"; // Correct path
import GithubSignInImage from "../../assets/images/icons8-github-512.png"; // Correct path

const SignInWithSocialMedia: React.FC = () => {
  const navigate = useNavigate();

  // Google login function
  async function googleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const userRef = doc(db, "Users", user.uid);
        // Fetch user data to check if user already exists
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          // If user doesn't exist, create a new user with demo money
          await setDoc(userRef, {
            email: user.email || "",
            firstName: user.displayName || "Unknown",
            photo: user.photoURL || "",
            lastName: "",
            demoMoney: 1000, // Assign demo money to the user
          });
        }

        toast.success("User logged in successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Login failed.");
      console.error("Google Login Error:", error);
    }
  }

  // GitHub login function
  async function githubLogin() {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const userRef = doc(db, "Users", user.uid);
        // Fetch user data to check if user already exists
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          // If user doesn't exist, create a new user with demo money
          await setDoc(userRef, {
            email: user.email || "",
            firstName: user.displayName || "Unknown",
            photo: user.photoURL || "",
            lastName: "",
            demoMoney: 1000, // Assign demo money to the user
          });
        }

        toast.success("User logged in successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Login failed.");
      console.error("GitHub Login Error:", error);
    }
  }

  return (
    <motion.div>
      <div className="text-center">
        {/* Heading or additional text */}
        <p
          style={{
            fontFamily: "'Roboto', sans-serif", // Change to Roboto
            fontSize: "22px",
            fontWeight: "500", // Slightly lighter weight for better readability
            marginBottom: "20px",
            color: "rgb(230, 230, 230)",
            textAlign: "center",
          }}
        >
          Login to continue
        </p>

        {/* Flex container to display both buttons inline */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          {/* Google Sign-in Button */}
          <div
            onClick={googleLogin}
            style={{ cursor: "pointer", width: "20%" }}
          >
            <img
              src={GoogleSignInImage}
              width="100%"
              alt="Google Login"
              style={{
                borderRadius: "5px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            />
          </div>

          {/* GitHub Sign-in Button */}
          <div
            onClick={githubLogin}
            style={{ cursor: "pointer", width: "20%" }}
          >
            <img
              src={GithubSignInImage}
              width="100%"
              alt="GitHub Login"
              style={{
                borderRadius: "5px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SignInWithSocialMedia;
