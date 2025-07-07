const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const { requireAuth } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");

// Get all users (for nutritionists - only basic info)
router.get("/all", requireAuth, requireRole("nutritionist"), async (req, res) => {
  try {
    const users = await User.find(
      { role: { $regex: /^user$/i } }, 
      "name email _id role"
    ).sort({ name: 1 });

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users with full details (admin only)
router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("Error fetching all users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single user by ID (admin/nutritionist)
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Nutritionists can only view user profiles, not other roles
    if (req.user.role === 'nutritionist' && user.role !== 'user') {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user (admin only)
router.put("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error updating user:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user (admin only)
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;