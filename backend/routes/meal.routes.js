const express = require("express");
const router = express.Router();
const {
  addMeal,
  getMeals,
  updateMeal,
  deleteMeal,
  getSummary,
  getUserMeals,
  addFeedback,
  getUsersWithMeals
} = require("../controllers/meal.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");

// User-specific routes
router.post("/", verifyToken, requireRole("user"), addMeal);
router.get("/my-meals", verifyToken, requireRole("user"), getMeals);
router.put("/:id", verifyToken, requireRole("user"), updateMeal);
router.delete("/:id", verifyToken, requireRole("user"), deleteMeal);
router.get("/summary", verifyToken, requireRole("user"), getSummary);

// Nutritionist routes
router.get("/users/with-meals", verifyToken, requireRole("nutritionist"), getUsersWithMeals);
router.get("/user/:id/meals", verifyToken, requireRole(["nutritionist", "admin"]), getUserMeals);
router.post("/:id/feedback", verifyToken, requireRole(["nutritionist", "admin"]), addFeedback);

module.exports = router;