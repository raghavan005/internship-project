import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login/Login";
import SignupPage from "./components/Login/Signup";
import Dashboard from "./components/dashboard/dashboard"; // Import Dashboard

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Add this */}
      </Routes>
    </Router>
  );
}

export default App;
