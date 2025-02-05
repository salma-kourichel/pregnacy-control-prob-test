document.addEventListener('DOMContentLoaded', () => {
  const addPatientForm = document.getElementById('addPatientForm');
  const pregnantField = document.getElementById('pregnant');
  const pregnancyFields = document.getElementById('pregnancyFields');
  const monthsPregnant = document.getElementById('monthsPregnant');
  const deliveryDate = document.getElementById('deliveryDate');

  pregnantField.addEventListener('change', () => {
    if (pregnantField.value === 'Yes') {
      pregnancyFields.style.display = 'block';
    } else {
      pregnancyFields.style.display = 'none';
      monthsPregnant.value = '';
      deliveryDate.value = '';
    }
  });

  monthsPregnant.addEventListener('input', () => {
    const months = parseInt(monthsPregnant.value, 10);
    if (!isNaN(months) && months > 0 && months <= 9) {
      const today = new Date();
      const dueDate = new Date(today.setMonth(today.getMonth() + (9 - months)));
      deliveryDate.value = dueDate.toISOString().split('T')[0];
    } else {
      deliveryDate.value = '';
    }
  });

  addPatientForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(addPatientForm);
    const patientData = Object.fromEntries(formData.entries());

    // Convert specific fields to the correct types
    patientData.systolicBP = parseFloat(patientData.systolicBP) || null;
    patientData.diastolicBP = parseFloat(patientData.diastolicBP) || null;
    patientData.bloodSugar = parseFloat(patientData.bloodSugar) || null;
    patientData.heartRate = parseInt(patientData.heartRate, 10) || null;
    patientData.bodyTemp = parseFloat(patientData.bodyTemp) || null;

    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        console.error('Error adding patient:', response.statusText);
        alert('Failed to add patient.');
        return;
      }

      alert('Patient added successfully!');
      addPatientForm.reset();
      pregnancyFields.style.display = 'none';
    } catch (error) {
      console.error('Error during submission:', error);
      alert('An error occurred.');
    }
  });
});
