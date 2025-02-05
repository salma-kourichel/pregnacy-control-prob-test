export const renderDashboard = (app, patients) => {
  app.innerHTML = `
    <h1>Dashboard</h1>
    <button id="addPatient">Add Patient</button>
    <div id="patients">
      ${patients.map((patient, index) => `
        <div>
          <span>${patient.name}</span>
          <button class="view" data-index="${index}">View</button>
          <button class="edit" data-index="${index}">Edit</button>
          <button class="remove" data-index="${index}">Remove</button>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('addPatient').addEventListener('click', () => {
    const app = document.getElementById('app'); // Assuming this is the main container for content
  
    // Render Add Patient Form
    app.innerHTML = `
      <h2>Add Patient</h2>
      <form id="addPatientForm">
        <label>
          First Name:
          <input type="text" id="firstName" required />
        </label>
        <label>
          Last Name:
          <input type="text" id="lastName" required />
        </label>
        <label>
          Email:
          <input type="email" id="email" />
        </label>
        <label>
          Phone Number:
          <input type="text" id="phoneNumber" />
        </label>
        <label>
          Age:
          <input type="number" id="age" required />
        </label>
        <label>
          Gender:
          <select id="gender">
            <option value="Female" selected>Female</option>
            <option value="Male">Male</option>
          </select>
        </label>
        <label>
          On Birth Control:
          <select id="onBirthControl">
            <option value="No" selected>No</option>
            <option value="Yes">Yes</option>
          </select>
        </label>
        <div id="birthControlTypeContainer" style="display: none;">
          <label>
            Type of Birth Control:
            <input type="text" id="birthControlType" />
          </label>
        </div>
        <label>
          Former Pregnancies:
          <input type="number" id="formerPregnancies" required />
        </label>
        <label>
          Lifestyle:
          <textarea id="lifestyle"></textarea>
        </label>
        <label>
          Additional Information:
          <textarea id="additionalInfo"></textarea>
        </label>
        <button type="submit">Add Patient</button>
        <button type="button" id="cancelAddPatient">Cancel</button>
      </form>
    `;
  
    // Show/Hide Birth Control Type based on selection
    document.getElementById('onBirthControl').addEventListener('change', (e) => {
      const birthControlTypeContainer = document.getElementById('birthControlTypeContainer');
      if (e.target.value === 'Yes') {
        birthControlTypeContainer.style.display = 'block';
      } else {
        birthControlTypeContainer.style.display = 'none';
        document.getElementById('birthControlType').value = ''; // Clear the input
      }
    });
  
    // Handle Add Patient Form Submission
    document.getElementById('addPatientForm').addEventListener('submit', (e) => {
      e.preventDefault();
  
      // Collect form data
      const patient = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value || null,
        phoneNumber: document.getElementById('phoneNumber').value || null,
        age: parseInt(document.getElementById('age').value, 10),
        gender: document.getElementById('gender').value,
        onBirthControl: document.getElementById('onBirthControl').value === 'Yes',
        birthControlType: document.getElementById('onBirthControl').value === 'Yes' ? document.getElementById('birthControlType').value : null,
        formerPregnancies: parseInt(document.getElementById('formerPregnancies').value, 10),
        lifestyle: document.getElementById('lifestyle').value,
        additionalInfo: document.getElementById('additionalInfo').value,
      };
  
      // Add the patient to the list (assuming `patients` is accessible)
      patients.push(patient);
  
      // Redirect to Dashboard and Refresh Patient List
      renderDashboard(app, patients);
    });
  
    // Handle Cancel Button
    document.getElementById('cancelAddPatient').addEventListener('click', () => {
      renderDashboard(app, patients); // Redirect back to the dashboard
    });
  });
  

  document.querySelectorAll('.view').forEach((button) =>
    button.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      alert(JSON.stringify(patients[index], null, 2));
    })
  );

  document.querySelectorAll('.edit').forEach((button) =>
    button.addEventListener('click', (e) => {
      const index = e.target.dataset.index; // Retrieve the index of the patient
      const patient = patients[index]; // Access the patient from the array
  
      // Render the edit patient form
      const app = document.getElementById('app'); // Assuming this is the main container for content
      app.innerHTML = `
        <h2>Edit Patient</h2>
        <form id="editPatientForm">
          <label>
            First Name:
            <input type="text" id="firstName" value="${patient.firstName}" required />
          </label>
          <label>
            Last Name:
            <input type="text" id="lastName" value="${patient.lastName}" required />
          </label>
          <label>
            Email:
            <input type="email" id="email" value="${patient.email || ''}" />
          </label>
          <label>
            Phone Number:
            <input type="text" id="phoneNumber" value="${patient.phoneNumber || ''}" />
          </label>
          <label>
            Age:
            <input type="number" id="age" value="${patient.age}" required />
          </label>
          <label>
            Gender:
            <select id="gender">
              <option value="Female" ${patient.gender === 'Female' ? 'selected' : ''}>Female</option>
              <option value="Male" ${patient.gender === 'Male' ? 'selected' : ''}>Male</option>
            </select>
          </label>
          <label>
            On Birth Control:
            <select id="onBirthControl">
              <option value="No" ${!patient.onBirthControl ? 'selected' : ''}>No</option>
              <option value="Yes" ${patient.onBirthControl ? 'selected' : ''}>Yes</option>
            </select>
          </label>
          <div id="birthControlTypeContainer" style="display: ${patient.onBirthControl ? 'block' : 'none'};">
            <label>
              Type of Birth Control:
              <input type="text" id="birthControlType" value="${patient.birthControlType || ''}" />
            </label>
          </div>
          <label>
            Former Pregnancies:
            <input type="number" id="formerPregnancies" value="${patient.formerPregnancies}" required />
          </label>
          <label>
            Lifestyle:
            <textarea id="lifestyle">${patient.lifestyle}</textarea>
          </label>
          <label>
            Additional Information:
            <textarea id="additionalInfo">${patient.additionalInfo}</textarea>
          </label>
          <button type="submit">Save Changes</button>
          <button type="button" id="cancelEditPatient">Cancel</button>
        </form>
      `;
  
      // Show/Hide Birth Control Type based on selection
      document.getElementById('onBirthControl').addEventListener('change', (e) => {
        const birthControlTypeContainer = document.getElementById('birthControlTypeContainer');
        if (e.target.value === 'Yes') {
          birthControlTypeContainer.style.display = 'block';
        } else {
          birthControlTypeContainer.style.display = 'none';
          document.getElementById('birthControlType').value = ''; // Clear the input
        }
      });
  
      // Handle Edit Patient Form Submission
      document.getElementById('editPatientForm').addEventListener('submit', (e) => {
        e.preventDefault();
  
        // Update patient details
        patients[index] = {
          firstName: document.getElementById('firstName').value,
          lastName: document.getElementById('lastName').value,
          email: document.getElementById('email').value || null,
          phoneNumber: document.getElementById('phoneNumber').value || null,
          age: parseInt(document.getElementById('age').value, 10),
          gender: document.getElementById('gender').value,
          onBirthControl: document.getElementById('onBirthControl').value === 'Yes',
          birthControlType: document.getElementById('onBirthControl').value === 'Yes' ? document.getElementById('birthControlType').value : null,
          formerPregnancies: parseInt(document.getElementById('formerPregnancies').value, 10),
          lifestyle: document.getElementById('lifestyle').value,
          additionalInfo: document.getElementById('additionalInfo').value,
        };
  
        // Redirect to Dashboard and Refresh Patient List
        renderDashboard(app, patients);
      });
  
      // Handle Cancel Button
      document.getElementById('cancelEditPatient').addEventListener('click', () => {
        renderDashboard(app, patients); // Redirect back to the dashboard
      });
    })
  );
  

  document.querySelectorAll('.remove').forEach((button) =>
    button.addEventListener('click', (e) => {
      // Get the patient index from the dataset
      const index = e.target.dataset.index;
  
      // Confirmation dialog to prevent accidental deletions
      const confirmed = confirm(
        `Are you sure you want to remove ${patients[index].firstName} ${patients[index].lastName}?`
      );
  
      if (confirmed) {
        // Remove the patient from the array
        patients.splice(index, 1);
  
        // Check if the array is empty after removal
        if (patients.length === 0) {
          app.innerHTML = `
            <h1>Dashboard</h1>
            <button id="addPatient">Add Patient</button>
            <p>No patients found. Please add a patient.</p>
          `;
          document.getElementById('addPatient').addEventListener('click', () => {
            renderAddPatientForm();
          });
        } else {
          // Re-render the dashboard if there are still patients
          renderDashboard(app, patients);
        }
      }
    })
  );
  
};
