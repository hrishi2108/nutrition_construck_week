const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  givenBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  role: {
    type: String,
    enum: ["nutritionist", "admin"],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const mealSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    required: true
  },
  carbs: {
    type: Number,
    required: true
  },
  fat: {
    type: Number,
    required: true
  },
  feedback: feedbackSchema,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Meal", mealSchema);