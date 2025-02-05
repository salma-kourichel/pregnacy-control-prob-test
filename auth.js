const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = "your-secret-key";

// Sign up
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(400).send("Error creating user");
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).send("User not found");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).send("Invalid credentials");

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(400).send("Error logging in");
  }
});

module.exports = router;
