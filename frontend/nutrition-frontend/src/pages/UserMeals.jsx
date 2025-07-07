import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./UserMeals.css";

const UserMeals = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [loading, setLoading] = useState(true);

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
        alert("Access denied");
        navigate("/login");
        return;
      }
    } catch {
      navigate("/login");
      return;
    }

    axios
      .get(`${API_BASE_URL}/meals/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMeals(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  const handleFeedback = async (mealId) => {
    const feedback = feedbacks[mealId];
    if (!feedback || feedback.trim() === "") {
      alert("Please write some feedback");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/meals/feedback/${mealId}`,
        { feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Feedback submitted");
      setFeedbacks({ ...feedbacks, [mealId]: "" });
    } catch {
      alert("Error submitting feedback");
    }
  };

  if (loading) return <p>Loading meals...</p>;

  return (
    <div className="page">
      <h2>User Meals</h2>
      {meals.length === 0 ? (
        <p>No meals found.</p>
      ) : (
        meals.map((meal) => (
          <div key={meal._id} className="meal-card">
            <h4>{meal.name}</h4>
            <p>Calories: {meal.calories}</p>
            <p>Protein: {meal.protein}</p>
            <p>Carbs: {meal.carbs}</p>
            <p>Fat: {meal.fat}</p>
            <p>
              Feedback:{" "}
              <strong>{meal.feedback ? meal.feedback : "None yet"}</strong>
            </p>
            <textarea
              placeholder="Write feedback"
              value={feedbacks[meal._id] || ""}
              onChange={(e) =>
                setFeedbacks({ ...feedbacks, [meal._id]: e.target.value })
              }
            />
            <button onClick={() => handleFeedback(meal._id)}>Submit Feedback</button>
          </div>
        ))
      )}
    </div>
  );
};

export default UserMeals;
