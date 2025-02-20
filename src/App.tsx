import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/dashboard/AuthContext"; // Import AuthProvider
import LoginPage from "./components/Login/Login";
import Dashboard from "./components/dashboard/dashboard";
import Welcome from "./components/WelcomePage/Welcome";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
