document.addEventListener('DOMContentLoaded', () => {
  const patientList = document.getElementById('patientList');
  const addPatientBtn = document.getElementById('addPatientBtn');

  // Fetch patients from the backend
  const fetchPatients = async () => {
    const response = await fetch('/api/patients');
    const patients = await response.json();

    // Render the list of patients as clickable links
    patientList.innerHTML = patients.map(patient => `
      <div>
        <a href="patient.html?id=${patient._id}">${patient.name}</a>
      </div>
    `).join('');
  };

  // Redirect to the Add Patient page
  addPatientBtn.addEventListener('click', () => {
    window.location.href = 'add-patient.html';
  });

  fetchPatients();
});
