// logout.js
document.addEventListener("DOMContentLoaded", function () {
  // Check if user is logged in
  const currentUser = localStorage.getItem("currentUser");
  const logoutBtn = document.getElementById("logoutBtn");
  const userDisplay = document.getElementById("userDisplay");

  // Display user info if logged in
  if (currentUser) {
    const user = JSON.parse(currentUser);
    if (userDisplay) {
      userDisplay.textContent = `Welcome, ${user.firstName}!`;
      userDisplay.style.display = "block";
    }

    // Show logout button if logged in
    if (logoutBtn) {
      logoutBtn.style.display = "block";

      // Add logout functionality
      logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        alert("You have been logged out successfully!");
        window.location.href = "login.html";
      });
    }
  } else {
    // Hide logout button if not logged in
    if (logoutBtn) {
      logoutBtn.style.display = "none";
    }

    if (userDisplay) {
      userDisplay.style.display = "none";
    }

    // If on dashboard and not logged in, redirect to login
    if (window.location.pathname.includes("dashboard.html")) {
      window.location.href = "login.html";
    }
  }
});
