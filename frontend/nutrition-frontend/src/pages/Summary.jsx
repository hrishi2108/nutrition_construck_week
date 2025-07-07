import { useEffect, useState } from "react";
import API from "../services/api";
import "./Summary.css";

function Summary() {
  const [summary, setSummary] = useState([]);

  const fetchSummary = async () => {
    try {
      const res = await API.get("/meals/summary");
      setSummary(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load summary");
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="summary-container">
      <h2>Nutrition Summary</h2>
      {summary.length === 0 ? (
        <p>No meals logged yet.</p>
      ) : (
        <table className="summary-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Calories</th>
              <th>Protein</th>
              <th>Carbs</th>
              <th>Fat</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((item, i) => (
              <tr key={i}>
                <td>{item.date}</td>
                <td>{item.totalCalories} kcal</td>
                <td>{item.protein} g</td>
                <td>{item.carbs} g</td>
                <td>{item.fat} g</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Summary;
