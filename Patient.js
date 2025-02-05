const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, default: null },
  gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
  systolicBP: { type: Number, default: null },
  diastolicBP: { type: Number, default: null },
  bloodSugar: { type: Number, default: null },
  heartRate: { type: Number, default: null },
  bodyTemp: { type: Number, default: null },
  medicalHistory: { type: String, default: '' },
  monthsPregnant: { type: Number, default: null }, // New field to track pregnancy progress
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Patient', patientSchema);
