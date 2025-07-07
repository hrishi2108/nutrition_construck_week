const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["user", "nutritionist", "admin"], default: "user" },
  preferences: {
    dietaryRestrictions: [String],
    healthGoals: String
  }
});

module.exports = mongoose.model("User", userSchema);
