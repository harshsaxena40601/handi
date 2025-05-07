// register.js
document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.getElementById("registrationForm");

  if (registrationForm) {
    registrationForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const firstName = document.getElementById("firstName").value;
      const lastName = document.getElementById("lastName").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      // Validate password match
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      // Validate password strength (optional)
      if (password.length < 6) {
        alert("Password must be at least 6 characters long!");
        return;
      }

      // Get existing users or create empty array
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Check if user already exists
      if (users.find((u) => u.email === email)) {
        alert("Email already registered! Please sign in.");
        window.location.href = "login.html";
        return;
      }

      // Create new user
      const newUser = {
        firstName,
        lastName,
        email,
        password,
        registrationDate: new Date().toISOString(),
      };

      // Add user to array and save to local storage
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      alert("Registration successful! Please sign in.");
      window.location.href = "login.html";
    });
  }
});
