import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Form.css";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", form);
      alert("Signup successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Create Your NutriTrack Account</h2>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
      />

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

      <select name="role" value={form.role} onChange={handleChange} required>
        <option value="user">User</option>
        <option value="nutritionist">Nutritionist</option>
      </select>

      <button type="submit">Sign Up</button>
    </form>
  );
}

export default Signup;
