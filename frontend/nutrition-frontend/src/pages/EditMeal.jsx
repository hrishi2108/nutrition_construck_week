import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import "./Form.css";

function EditMeal() {
  const [meal, setMeal] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const res = await API.get(`/meals/${id}`);
        setMeal(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMeal();
  }, [id]);

  const handleChange = (e) => {
    setMeal({ ...meal, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/meals/${id}`, meal);
      alert("Meal updated successfully!");
      navigate("/meals");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Edit Meal</h2>

      <input
        type="text"
        name="name"
        placeholder="Meal Name"
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
      <button type="submit">Update Meal</button>
    </form>
  );
}

export default EditMeal;
