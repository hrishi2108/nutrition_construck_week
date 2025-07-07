import { useState } from "react";
import API from "../services/api";
import "./Form.css";

function AddMeal() {
  const [meal, setMeal] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const handleChange = (e) => {
    setMeal({ ...meal, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/meals", meal);
      alert("Meal added successfully!");
      setMeal({ name: "", calories: "", protein: "", carbs: "", fat: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add meal");
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Log a Meal</h2>

      <input
        type="text"
        name="name"
        placeholder="Meal Name (e.g. Paneer Rice)"
        value={meal.name}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="calories"
        placeholder="Calories"
        value={meal.calories}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="protein"
        placeholder="Protein (g)"
        value={meal.protein}
        onChange={handleChange}
      />

      <input
        type="number"
        name="carbs"
        placeholder="Carbs (g)"
        value={meal.carbs}
        onChange={handleChange}
      />

      <input
        type="number"
        name="fat"
        placeholder="Fat (g)"
        value={meal.fat}
        onChange={handleChange}
      />

      <button type="submit">Add Meal</button>
    </form>
  );
}

export default AddMeal;
