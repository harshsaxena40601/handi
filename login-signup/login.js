// login.js - Enhanced with authentication functionality
document.addEventListener("DOMContentLoaded", function () {
  // Get form elements
  const signInForm = document.getElementById("signInForm");
  const signInButton = document.getElementById("signInButton");
  const signUpButton = document.getElementById("signUpButton");
  const signInDiv = document.getElementById("signIn");
  const signUpDiv = document.getElementById("signUp");

  // Toggle between sign in and sign up forms
  if (signUpButton) {
    signUpButton.addEventListener("click", function () {
      signInDiv.style.display = "none";
      signUpDiv.style.display = "block";
    });
  }

  if (signInButton) {
    signInButton.addEventListener("click", function () {
      signUpDiv.style.display = "none";
      signInDiv.style.display = "block";
    });
  }

  // Handle sign in form submission
  if (signInForm) {
    signInForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("signInEmail").value;
      const password = document.getElementById("signInPassword").value;

      // Check if user exists in local storage
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        // Store current user in local storage
        localStorage.setItem("currentUser", JSON.stringify(user));
        alert("Login successful!");
        window.location.href = "dashboard.html";
      } else {
        alert("Invalid email or password!");
      }
    });
  }

  // Handle sign up form submission via main login page
  const signUpForm = document.getElementById("signUpForm");
  if (signUpForm) {
    signUpForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const firstName = document.getElementById("signUpFirstName").value;
      const lastName = document.getElementById("signUpLastName").value;
      const email = document.getElementById("signUpEmail").value;
      const password = document.getElementById("signUpPassword").value;

      // Get existing users or create empty array
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Check if user already exists
      if (users.find((u) => u.email === email)) {
        alert("Email already registered! Please sign in.");
        return;
      }

      // Create new user
      const newUser = {
        firstName,
        lastName,
        email,
        password,
      };

      // Add user to array and save to local storage
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      alert("Registration successful! Please sign in.");

      // Switch to sign in form
      signUpDiv.style.display = "none";
      signInDiv.style.display = "block";

      // Clear form
      signUpForm.reset();
    });
  }
});
