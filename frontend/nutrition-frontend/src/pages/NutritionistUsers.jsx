import { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "./NutritionistUsers.css";

const NutritionistUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/meals/with-meals");
        setUsers(res.data);
      } catch (err) {
        console.error("Access denied or fetch error:", err);
        alert("Access denied. Only for nutritionists.");
        navigate("/login");
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="page">
      <h2>Users with Meals</h2>
      {users.length === 0 ? (
        <p>No users with meals found.</p>
      ) : (
        users.map((user) => (
          <div key={user._id} className="user-section">
            <h3>{user.name} ({user.email})</h3>
            {user.meals.length === 0 ? (
              <p>No meals logged.</p>
            ) : (
              user.meals.map((meal) => (
                <div key={meal._id} className="meal-card">
                  <h4>{meal.name}</h4>
                  <p>Calories: {meal.calories}</p>
                  <p>Protein: {meal.protein}g | Carbs: {meal.carbs}g | Fat: {meal.fat}g</p>
                  <p>
                    Feedback:{" "}
                    <strong>{meal.feedback?.text || "No feedback yet"}</strong>
                  </p>
                  <FeedbackBox mealId={meal._id} />
                </div>
              ))
            )}
          </div>
        ))
      )}
    </div>
  );
};

const FeedbackBox = ({ mealId }) => {
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFeedback = async () => {
    if (!feedback.trim()) return alert("Feedback cannot be empty.");
    setSubmitting(true);
    try {
      await API.post(`/meals/feedback/${mealId}`, { feedback });
      alert("Feedback added.");
      window.location.reload();
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Could not add feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-box">
      <textarea
        placeholder="Write feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={3}
      />
      <button onClick={handleFeedback} disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Feedback"}
      </button>
    </div>
  );
};

export default NutritionistUsers;
