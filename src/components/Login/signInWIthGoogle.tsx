import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./firebase"; // Ensure correct path
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleSignInImage from "../../assets/images/google_logo.png"; // Correct path

const SignInwithGoogle: React.FC = () => {
  const navigate = useNavigate();

  async function googleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const userRef = doc(db, "Users", user.uid);

        await setDoc(userRef, {
          email: user.email || "",
          firstName: user.displayName || "Unknown",
          photo: user.photoURL || "",
          lastName: "",
        });

        toast.success("User logged in successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Login failed.");
      console.error("Google Login Error:", error);
    }
  }

  return (
    <div className="text-center">
      {/* Additional text between heading and Google Sign-in button */}
      <p
        style={{
          fontFamily: "'Playfair Display', serif", // Stylish font
          fontSize: "22px",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#000", // Dark black color
          textAlign: "center", // Center text
        }}
      >
        Continue with your Google account
      </p>

      {/* Google Sign-in Button */}
      <div onClick={googleLogin} style={{ cursor: "pointer" }}>
        <img
          src={GoogleSignInImage}
          width="60%"
          alt="Google Login"
          style={{
            borderRadius: "5px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        />
      </div>
    </div>
  );
};

export default SignInwithGoogle;
