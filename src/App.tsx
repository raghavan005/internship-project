import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login/Login";
import SignupPage from "./components/Login/Signup";
import Dashboard from "./components/dashboard/dashboard"; // Ensure correct casing

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Default to login */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />{" "}
        {/* Protected Route */}
      </Routes>
    </Router>
  );
}

export default App;
