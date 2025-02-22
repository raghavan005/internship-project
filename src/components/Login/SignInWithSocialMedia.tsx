import React from "react";
import { hover, motion, spring } from "framer-motion";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged, // Import onAuthStateChanged
} from "firebase/auth";
import { auth, db } from "./firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleSignInImage from "../../assets/images/icons8-google-240.png";
import GithubSignInImage from "../../assets/images/icons8-github-512.png";


const buttonhover = {
  hover: {
    scale: 1.1,
  },
  visible: {
    type: "spring",
    stiffness: 300,
  },
  tap: {
    tap: 0.9
  },
};

const containervariants ={
  hidden:{
    x:'100vw'
  },
  visible:{
    x:0
  },
  do:{
    type:'spring',
    duration:0.5
  }
}


const childern ={
  visible:{
    x:1
  },
  hidden:{
    x:0
  },
  transition:{
    delay:1,
    duration:2
  }
}

const SignInWithSocialMedia: React.FC = () => {
  const navigate = useNavigate();

  async function handleSocialLogin(
    provider: GoogleAuthProvider | GithubAuthProvider,
    providerName: string
  ) {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const userRef = doc(db, "Users", user.uid);

        // Use onAuthStateChanged to get the user data after the authentication is complete
        onAuthStateChanged(auth, async (authUser) => {
          // Very Important
          if (authUser) {
            // Check if user is still authenticated after onAuthStateChanged
            try {
              const userDoc = await getDoc(userRef);
              if (!userDoc.exists()) {
                await setDoc(userRef, {
                  email: authUser.email || "", // Use authUser for email
                  firstName: authUser.displayName || "Unknown", // Use authUser for display name
                  photo: authUser.photoURL || "", // Use authUser for photo URL
                  lastName: "",
                  demoMoney: 1000,
                });
              }

              toast.success(
                `User logged in successfully with ${providerName}!`
              );
              navigate("/dashboard");
            } catch (error) {
              toast.error("Error creating user document.");
              console.error(
                `Error creating/fetching user document (${providerName}):`,
                error
              );
            }
          }
        });
      }
    } catch (error) {
      toast.error(`Login failed with ${providerName}.`);
      console.error(`${providerName} Login Error:`, error);
    }
  }

  const googleLogin = () =>
    handleSocialLogin(new GoogleAuthProvider(), "Google");
  const githubLogin = () =>
    handleSocialLogin(new GithubAuthProvider(), "GitHub");

  return (
    <motion.div>
      <motion.div
      variants={containervariants}
        className="text-center"
        initial="hidden"
        animate="visible"
        transition={spring}
      >
        <motion.p
        variants={childern}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: "25px",
            fontWeight: "800",
            marginBottom: "20px",
            color: "rgba(255, 255, 255, 0.71)",
            textAlign: "center",
          }}
        >
          Login to continue
        </motion.p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <motion.div
            variants={buttonhover}
            whileHover="hover"
            whileTap="tap"
            animate="visible"
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
          </motion.div>
          <motion.div
          variants={buttonhover}
            whileHover="hover"
            whileTap="tap"
            animate="visible"
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
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SignInWithSocialMedia;
