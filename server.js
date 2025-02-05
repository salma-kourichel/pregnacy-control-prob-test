const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const { spawn } = require('child_process');
const User = require('./models/User');
const Patient = require('./models/Patient');

const app = express();
const PORT = 80; // Running on Port 80

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, 'frontend')));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/hackathon_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
// Root route to serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Signup
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', {
      expiresIn: '1h',
    });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Get Patients
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching patients' });
  }
});

// Serve static pages
app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dashboard.html'));
});

app.get('/add-patient.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'add-patient.html'));
});

app.get('/patient.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'patient.html'));
});

// Get a single patient
app.get('/api/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching patient' });
  }
});

// Add a new patient
app.post('/api/patients', async (req, res) => {
  const {
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
  } = req.body;

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
    });
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(500).json({ message: 'Error adding patient' });
  }
});

// Update a patient
app.put('/api/patients/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedPatient) return res.status(404).json({ message: 'Patient not found' });
    res.json(updatedPatient);
  } catch (err) {
    res.status(500).json({ message: 'Error updating patient' });
  }
});

// Delete a patient
app.delete('/api/patients/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPatient = await Patient.findByIdAndDelete(id);
    if (!deletedPatient) return res.status(404).json({ message: 'Patient not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Error deleting patient' });
  }
});

// Predict risk
app.post("/api/predict", async (req, res) => {
  const { age, systolicBP, diastolicBP, bloodSugar, heartRate, bodyTemp } = req.body;

  // Map field names to match model expectations
  const inputData = {
    Age: age, 
    SystolicBP: systolicBP, 
    DiastolicBP: diastolicBP, 
    BS: bloodSugar,  
    HeartRate: heartRate,
    BodyTemp: bodyTemp
  };

  console.log("Sending data to Python:", inputData);

  try {
    const pythonProcess = spawn("python3", ["prdictionML.py", JSON.stringify(inputData)]);

    pythonProcess.stdout.on("data", (data) => {
      const result = JSON.parse(data.toString());
      console.log("Final prediction result:", result);
      res.status(200).json(result);
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python script error:", data.toString());
      res.status(500).json({ message: "Prediction failed", error: data.toString() });
    });
  } catch (err) {
    res.status(500).json({ message: "Error during prediction" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
