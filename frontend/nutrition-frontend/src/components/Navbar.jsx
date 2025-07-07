import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useMemo } from "react";
import "./Navbar.css";

function Navbar() {
  const token = localStorage.getItem("token");

  const { role } = useMemo(() => {
    if (!token) return {};
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded JWT →", decoded); // Debug: remove later
      return { role: decoded.role };
    } catch (err) {
      console.error("Token decoding failed", err);
      return {};
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo-text">N</span>
        <span className="brand-name">NutriTrack</span>
      </div>

      <div className="navbar-right">
        {/* Links for public users */}
        {!token && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}

        {/* Links for regular user */}
        {token && role === "user" && (
          <>
            <Link to="/add-meal">Add Meal</Link>
            <Link to="/meals">View Meals</Link>
            <Link to="/summary">Summary</Link>
          </>
        )}

        {/* Links for nutritionist */}
        {token && role === "nutritionist" && (
  <Link to="/nutritionist/users">Nutritionist Panel</Link>
)}

        {/* Logout button */}
        {token && (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
