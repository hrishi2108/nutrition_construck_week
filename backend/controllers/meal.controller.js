const mongoose = require("mongoose");
const Meal = require("../models/meal.model");

exports.addMeal = async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat } = req.body;

    const meal = await Meal.create({
      userId: req.user.userId,
      name,
      calories,
      protein,
      carbs,
      fat,
    });

    res.status(201).json(meal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMeal = async (req, res) => {
  try {
    const mealId = req.params.id;
    const meal = await Meal.findOneAndUpdate(
      { _id: mealId, userId: req.user.userId },
      req.body,
      { new: true }
    );

    if (!meal) return res.status(404).json({ message: "Meal not found" });

    res.json(meal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMeal = async (req, res) => {
  try {
    const mealId = req.params.id;
    const deleted = await Meal.findOneAndDelete({
      _id: mealId,
      userId: req.user.userId,
    });

    if (!deleted) return res.status(404).json({ message: "Meal not found" });

    res.json({ message: "Meal deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const summary = await Meal.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalCalories: { $sum: "$calories" },
          protein: { $sum: "$protein" },
          carbs: { $sum: "$carbs" },
          fat: { $sum: "$fat" },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          totalCalories: 1,
          protein: 1,
          carbs: 1,
          fat: 1,
        },
      },
      { $sort: { date: -1 } },
    ]);

    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('feedback.givenBy', 'name');
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user meals", error: err.message });
  }
};

exports.addFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;

    const meal = await Meal.findById(req.params.id);
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    meal.feedback = {
      text: feedback,
      givenBy: req.user.userId,
      role: req.user.role,
    };

    await meal.save();

    const updatedMeal = await Meal.findById(meal._id)
      .populate('userId', 'name email')
      .populate('feedback.givenBy', 'name');

    res.json({ 
      message: "Feedback added successfully",
      meal: updatedMeal 
    });
  } catch (err) {
    console.error("Error adding feedback:", err);
    res.status(500).json({ 
      message: "Error adding feedback",
      error: err.message 
    });
  }
};

exports.getUsersWithMeals = async (req, res) => {
  try {
    // Verify nutritionist role
    if (req.user.role !== 'nutritionist') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Nutritionists only'
      });
    }

    // Get all users with role 'user' and populate their meals
    const users = await User.find({ role: 'user' })
      .select('-password')
      .lean();

    // Get meals for each user
    const usersWithMeals = await Promise.all(
      users.map(async (user) => {
        const meals = await Meal.find({ userId: user._id })
          .sort({ createdAt: -1 })
          .lean();
        return {
          ...user,
          meals,
          mealCount: meals.length
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithMeals.length,
      data: usersWithMeals
    });

  } catch (err) {
    console.error('Error in getUsersWithMeals:', err);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users with meals',
      error: err.message
    });
  }
};

exports.getUserMeals = async (req, res) => {
  try {
    // Verify nutritionist or admin role
    if (!['nutritionist', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Unauthorized role'
      });
    }

    const userId = req.params.id;
    const meals = await Meal.find({ userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .lean();

    res.status(200).json({
      success: true,
      count: meals.length,
      data: meals
    });

  } catch (err) {
    console.error('Error in getUserMeals:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching user meals',
      error: err.message
    });
  }
};