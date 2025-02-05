import { renderDashboard } from './patientManager.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  const patients = []; // Initialize an empty array to store patient data

  const renderLogin = () => {
    app.innerHTML = `
      <h1>Login</h1>
      <form id="loginForm">
        <input type="text" id="username" placeholder="Username" required />
        <input type="password" id="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <button id="signup">Signup</button>
    `;

    // Handle login form submission
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        //renderDashboard(app, patients); // Redirect to dashboard
        window.location.href = "dashboard.html";
      } else {
        alert('Login failed');
      }
    });

    // Redirect to signup page
    document.getElementById('signup').addEventListener('click', renderSignup);
  };

  const renderSignup = () => {
    app.innerHTML = `
      <h1>Signup</h1>
      <form id="signupForm">
        <input type="text" id="username" placeholder="Username" required />
        <input type="password" id="password" placeholder="Password" required />
        <button type="submit">Signup</button>
      </form>
      <button id="login">Login</button>
    `;

    // Handle signup form submission
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        alert('Signup successful! Please log in.');
        renderLogin(); // Redirect to login
      } else {
        alert('Signup failed');
      }
    });

    // Redirect to login page
    document.getElementById('login').addEventListener('click', renderLogin);
  };

  // Start the app with the login page
  renderLogin();
});
