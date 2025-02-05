const express = require("express");
const jwt = require("jsonwebtoken");
const { spawn } = require("child_process");
const Patient = require("../models/Patient");

const router = express.Router();
const JWT_SECRET = "your-secret-key";

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Get all patients for the authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const patients = await Patient.find({ createdBy: req.user.id });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients" });
  }
});

// Add a patient
router.post("/", auth, async (req, res) => {
  const { name, age, gender, systolicBP, diastolicBP, bloodSugar, heartRate, bodyTemp, medicalHistory, monthsPregnant } = req.body;

  try {
    const newPatient = new Patient({
      name,
      age,
      gender,
      systolicBP,
      diastolicBP,
      bloodSugar,
      heartRate,
      bodyTemp,
      medicalHistory,
      monthsPregnant,
      createdBy: req.user.id, // Associate patient with logged-in user
    });

    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(400).json({ message: "Error adding patient" });
  }
});

// Update a patient
router.put("/:id", auth, async (req, res) => {
  try {
    await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Patient updated successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error updating patient" });
  }
});

// Delete a patient
router.delete("/:id", auth, async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting patient" });
  }
});

// Predict risk using Python model
router.post("/predict", auth, async (req, res) => {
  const patientData = req.body;

  const pythonProcess = spawn("python3", ["predictionML.py", JSON.stringify(patientData)]);

  let output = "";

  pythonProcess.stdout.on("result", (result) => {
    output += result.toString();
  });

  pythonProcess.stderr.on("result", (result) => {
    console.error(`Python Error: ${result.toString()}`);
  });

  pythonProcess.on("close", (code) => {
    try {
      const result = JSON.parse(output);
      if (result.error) {
        console.error("Prediction error:", result.error);
        return res.status(500).json({ message: "Prediction failed" });
      }
      res.json(result);
    } catch (error) {
      console.error("Invalid JSON from Python script:", output);
      res.status(500).json({ message: "Invalid response from prediction model" });
    }
  });
});

module.exports = router;
