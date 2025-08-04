// ✅ Navigation shortcuts
function goToHome() {
  window.location.href = '/HTML/Home.html';
}
function goToUpload() {
  window.location.href = '/HTML/upload.html';
}
function goToConfess() {
  window.location.href = '/HTML/confession.html';
}
function goToProfile() {
  window.location.href = '/HTML/profile.html';
}
function goToAdminDashboard() {
  window.location.href = '/HTML/admin.html';
}

// ✅ Base URL (Change this if deploying somewhere else)
const BASE_URL = "https://kpugram-backend.onrender.com/api";

// ✅ DOM Ready logic
document.addEventListener('DOMContentLoaded', async function () {
  const username = localStorage.getItem("username") || "username";
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // 👤 Show username in header
  const userDisplay = document.getElementById("userDisplay");
  if (userDisplay) {
    userDisplay.textContent = "@" + username;
  }

  // 🎯 Show admin dashboard button only for admins
  const dashboardBtn = document.getElementById("dashboardBtn");
  if (dashboardBtn) {
    dashboardBtn.style.display = isAdmin ? "inline-block" : "none";
  }

  // 🏠 Make logo clickable
  const logo = document.querySelector(".logo");
  if (logo) {
    logo.style.cursor = "pointer";
    logo.addEventListener("click", () => {
      if (isAdmin) {
        window.location.href = "/HTML/admin.html";
      } else {
        window.location.href = "/HTML/Home.html";
      }
    });
  }
});
