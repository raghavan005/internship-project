import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./firebase"; // Ensure correct path
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SignInwithGoogle() {
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
    <div className="text-center mt-3">
      <button
        className="btn btn-outline-dark d-flex align-items-center gap-2"
        onClick={googleLogin}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          alt="Google Logo"
          width="20"
        />
        Sign in with Google
      </button>
    </div>
  );
}

export default SignInwithGoogle;
