import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";// Adjust path
import { signInWithPopup } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "danger";
    message: string;
  } | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setAlert({
        type: "success",
        message: "Google Sign-In Successful! Redirecting...",
      });

      setTimeout(() => navigate("/dashboard"), 1500); // Redirect to dashboard after login
    } catch (error: any) {
      setAlert({ type: "danger", message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            {alert && (
              <div
                className={`alert alert-${alert.type} alert-dismissible fade show mb-4`}
                role="alert"
              >
                {alert.message}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setAlert(null)}
                  aria-label="Close"
                ></button>
              </div>
            )}

            <div className="card shadow-sm">
              <div className="card-body p-4 text-center">
                <h2 className="card-title">Sign Up</h2>
                <p className="text-muted">Sign up using Google</p>

                {/* Google Sign-In Button */}
                <button
                  onClick={handleGoogleSignIn}
                  className="btn btn-danger w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-google me-2"></i> Sign in with Google
                    </>
                  )}
                </button>

                {/* Login Redirect */}
                <div className="mt-3">
                  <p>
                    Already have an account? <Link to="/login">Log in</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
