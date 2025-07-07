import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../services/api";
import "./Form.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      const token = res.data.token;

      // 🧠 Decode role from tokenc
      const decoded = jwtDecode(token);
      const role = decoded.role;

      localStorage.setItem("token", token);
      alert("Login successful!");

      // 🔁 Redirect based on role
      if (role === "nutritionist") {
        navigate("/nutritionist/users");
      } else {
        navigate("/add-meal");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Login to NutriTrack</h2>
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={form.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />

      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
