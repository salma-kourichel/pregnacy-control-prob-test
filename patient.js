// Full JavaScript Code for Patient Details Page
document.addEventListener('DOMContentLoaded', async () => {
  const patientDetails = document.getElementById('patientDetails');
  const predictionResults = document.getElementById('predictionResults');
  const editPatientBtn = document.getElementById('editPatientBtn');
  const deletePatientBtn = document.getElementById('deletePatientBtn');
  const runPredictionBtn = document.getElementById('runPredictionBtn');

  const urlParams = new URLSearchParams(window.location.search);
  const patientId = urlParams.get('id'); // Get the patient ID from the query string

  if (!patientDetails || !editPatientBtn || !deletePatientBtn || !runPredictionBtn) {
    console.error('One or more elements are missing from the HTML.');
    return;
  }

  let patient = null; // Declare a global variable for patient data

  // Fetch patient details from the backend
  const fetchPatient = async () => {
    try {
      const response = await fetch(`/api/patients/${patientId}`);
      if (!response.ok) throw new Error('Failed to fetch patient data.');
      patient = await response.json();

      // Render patient details
      patientDetails.innerHTML = `
        <p><strong>Name:</strong> ${patient.name}</p>
        <p><strong>Age:</strong> ${patient.age}</p>
        <p><strong>Gender:</strong> ${patient.gender}</p>
        <p><strong>Systolic BP:</strong> ${patient.systolicBP} mmHg</p>
        <p><strong>Diastolic BP:</strong> ${patient.diastolicBP} mmHg</p>
        <p><strong>Blood Sugar:</strong> ${patient.bloodSugar} mmol/L</p>
        <p><strong>Heart Rate:</strong> ${patient.heartRate} bpm</p>
        <p><strong>Body Temperature:</strong> ${patient.bodyTemp} °F</p>
        <p><strong>Medical History:</strong> ${patient.medicalHistory}</p>
      `;
    } catch (error) {
      console.error('Error fetching patient:', error);
      alert('Failed to load patient data.');
    }
  };

  runPredictionBtn.addEventListener("click", async () => {
    console.log("Prediction button clicked"); // Debugging log
  
    if (!patient) {
      alert("Patient data is missing!");
      return;
    }
  
    try {
      const response = await fetch(`/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: patient.age,
          systolicBP: patient.systolicBP,
          diastolicBP: patient.diastolicBP,
          bloodSugar: patient.bloodSugar,
          heartRate: patient.heartRate,
          bodyTemp: patient.bodyTemp,
        }),
      });
  
      console.log("Prediction API Response Status:", response.status); // Debugging log
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Prediction error:", errorData);
        document.getElementById("riskLevelDisplay").innerHTML = `<strong>Risk Level:</strong> Prediction failed.`;
        return;
      }
  
      const data = await response.json();
      console.log("Prediction Result:", data); // Debugging log
  
      if (data.riskLevel) {
        document.getElementById("riskLevelDisplay").innerHTML = `<strong>Risk Level:</strong> ${data.riskLevel}`;
      } else {
        document.getElementById("riskLevelDisplay").innerHTML = `<strong>Risk Level:</strong> Prediction failed.`;
      }
    } catch (error) {
      console.error("Prediction request error:", error);
      document.getElementById("riskLevelDisplay").innerHTML = `<strong>Risk Level:</strong> Prediction error.`;
    }
  });
  

  // Edit Patient Details
  editPatientBtn.addEventListener('click', () => {
    if (!patient) {
      alert('No patient data available to edit.');
      return;
    }

    // Hide buttons during edit
    editPatientBtn.style.display = 'none';
    deletePatientBtn.style.display = 'none';
    runPredictionBtn.style.display = 'none';

    // Render editable form
    patientDetails.innerHTML = `
      <form id="editPatientForm">
        <label>
          Name:
          <input type="text" name="name" value="${patient.name || ''}" required />
        </label><br />
        <label>
          Age:
          <input type="number" name="age" value="${patient.age || ''}" required />
        </label><br />
        <label>
          Gender:
          <select name="gender" required>
            <option value="Male" ${patient.gender === 'Male' ? 'selected' : ''}>Male</option>
            <option value="Female" ${patient.gender === 'Female' ? 'selected' : ''}>Female</option>
            <option value="Other" ${patient.gender === 'Other' ? 'selected' : ''}>Other</option>
          </select>
        </label><br />
        <label>
          Systolic BP (mmHg):
          <input type="number" name="systolicBP" value="${patient.systolicBP || ''}" step="0.1" required />
        </label><br />
        <label>
          Diastolic BP (mmHg):
          <input type="number" name="diastolicBP" value="${patient.diastolicBP || ''}" step="0.1" required />
        </label><br />
        <label>
          Blood Sugar (mmol/L):
          <input type="number" name="bloodSugar" value="${patient.bloodSugar || ''}" step="0.1" required />
        </label><br />
        <label>
          Heart Rate (bpm):
          <input type="number" name="heartRate" value="${patient.heartRate || ''}" required />
        </label><br />
        <label>
          Body Temperature (°C):
          <input type="number" name="bodyTemp" value="${patient.bodyTemp || ''}" step="0.1" required />
        </label><br />
        <label>
          Medical History:
          <textarea name="medicalHistory">${patient.medicalHistory || ''}</textarea>
        </label><br />
        <button type="submit">Save</button>
        <button type="button" id="cancelEditBtn">Cancel</button>
      </form>
    `;

    const editPatientForm = document.getElementById('editPatientForm');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    // Handle form submission
    editPatientForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(editPatientForm);
      const updates = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(`/api/patients/${patientId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('Error updating patient:', error.message);
          return alert('Failed to update patient. Check the console for details.');
        }

        alert('Patient updated successfully!');
        fetchPatient(); // Refresh patient details
      } catch (error) {
        console.error('Error during update:', error);
        alert('An error occurred. Check the console for details.');
      }
    });

    // Handle cancel button
    cancelEditBtn.addEventListener('click', () => {
      fetchPatient(); // Reload patient details
    });
  });

  // Delete Patient
  deletePatientBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete this patient?')) {
      try {
        const response = await fetch(`/api/patients/${patientId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete patient.');
        alert('Patient deleted successfully!');
        window.location.href = 'dashboard.html';
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert('An error occurred. Check the console for details.');
      }
    }
  });

  fetchPatient();
});
