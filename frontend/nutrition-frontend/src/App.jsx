import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AddMeal from "./pages/AddMeal";
import ViewMeals from "./pages/ViewMeals";
import Summary from "./pages/Summary";
import EditMeal from "./pages/EditMeal";
import UserList from "./pages/UserList";
import UserMeals from "./pages/UserMeals";
import NutritionistUsers from "./pages/NutritionistUsers";
import { jwtDecode } from "jwt-decode";
import "./App.css";

function App() {
  const token = localStorage.getItem("token");
  const location = useLocation();

  let role = null;
  try {
    if (token) {
      const decoded = jwtDecode(token);
      role = decoded.role;
    }
  } catch (err) {
    console.error("Invalid token");
  }

  const requireAuth = (element, allowedRoles = []) => {
    if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
    if (allowedRoles.length && !allowedRoles.includes(role)) return <Navigate to="/login" replace />;
    return element;
  };

  return (
    <>
      <Navbar />
      <div className="main-container">
        <Routes>
          <Route path="/" element={<h2>Welcome to NutriTrack</h2>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* 👤 User Routes */}
          <Route path="/add-meal" element={requireAuth(<AddMeal />, ["user"])} />
          <Route path="/meals" element={requireAuth(<ViewMeals />, ["user"])} />
          <Route path="/summary" element={requireAuth(<Summary />, ["user"])} />
          <Route path="/edit-meal/:id" element={requireAuth(<EditMeal />, ["user"])} />

          {/* 👨‍⚕️ Nutritionist Routes */}
          <Route path="/nutritionist/users" element={requireAuth(<UserList />, ["nutritionist"])} />
          <Route path="/nutritionist/users/:id/meals" element={requireAuth(<UserMeals />, ["nutritionist"])} />
          <Route path="/nutritionist/users" element={<NutritionistUsers />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
