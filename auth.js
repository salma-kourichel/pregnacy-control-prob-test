const form = document.getElementById("authForm");
const toggleForm = document.getElementById("toggleForm");
let isLogin = true;

toggleForm.addEventListener("click", () => {
  isLogin = !isLogin;
  form.querySelector("button").textContent = isLogin ? "Login" : "Signup";
  toggleForm.textContent = isLogin ? "Switch to Signup" : "Switch to Login";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const endpoint = isLogin ? "/auth/login" : "/auth/signup";
  const response = await fetch(`http://localhost:80${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } else {
    alert(await response.text());
  }
});
