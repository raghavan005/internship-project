import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login/Login";
import Dashboard from "./components/dashboard/dashboard";
import Welcome from "./components/WelcomePage/Welcome"; // Import Welcome

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} /> {/* Show Welcome Page first */}
        <Route path="/login" element={<LoginPage />} /> {/* Login Page */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard */}
      </Routes>
    </Router>
  );
}

export default App;
