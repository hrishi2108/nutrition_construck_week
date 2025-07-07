import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "nutritionist") {
        alert("Access denied: Nutritionists only");
        navigate("/login");
        return;
      }
    } catch {
      navigate("/login");
      return;
    }

    axios
      .get(`${API_BASE_URL}/users/all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="page">
      <h2>All Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user._id}>
              <span>{user.name} ({user.email})</span>
              <Link to={`/nutritionist/users/${user._id}/meals`}>View Meals</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
