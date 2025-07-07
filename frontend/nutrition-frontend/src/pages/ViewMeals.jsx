import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewMeals.css";

function ViewMeals() {
  const [meals, setMeals] = useState([]);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const fetchMeals = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/meals/my-meals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await res.text();
      try {
        const data = JSON.parse(text);
        setMeals(data);
      } catch {
        console.error("Invalid JSON or HTML error received:", text);
        alert("Failed to parse meals data");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Error fetching meals");
    }
  };

  const deleteMeal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meal?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/meals/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errRes = await res.json();
        throw new Error(errRes.message || "Delete failed");
      }

      setMeals(meals.filter((meal) => meal._id !== id));
    } catch (err) {
      alert(err.message || "Error deleting meal");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-meal/${id}`);
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <div className="meals-container">
      <h2>Your Meals</h2>
      {meals.length === 0 ? (
        <p>No meals found. Go add some!</p>
      ) : (
        <div className="meal-grid">
          {meals.map((meal) => (
            <div key={meal._id} className="meal-card">
              <h3>{meal.name}</h3>
              <p><strong>Calories:</strong> {meal.calories} kcal</p>
              <p>Protein: {meal.protein}g | Carbs: {meal.carbs}g | Fat: {meal.fat}g</p>
              <div className="meal-actions">
                <button onClick={() => deleteMeal(meal._id)}>Delete</button>
                <button className="edit-btn" onClick={() => handleEdit(meal._id)}>Edit</button>
              </div>
              <span className="meal-date">
                {new Date(meal.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewMeals;
