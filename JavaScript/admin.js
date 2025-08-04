// 🚀 Load all users when page is ready
document.addEventListener("DOMContentLoaded", () => {
    // Fetch user data from backend API
    fetch("http://localhost:8080/api/admin/users")
        .then(res => res.json()) // Convert response to JSON
        .then(users => {
            const tbody = document.querySelector("#userTable tbody"); // Target table body

            // Loop through each user and create a row
            users.forEach(user => {
                const row = document.createElement("tr");

                // Fill table row with user data
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td><img src="${user.profilePicture}" class="profile-thumb" alt="User Image"></td>
                    <td>${user.bio || "-"}</td>
                    <td>${user.admin ? "✅" : "❌"}</td>
                    <td>${user.loginCount}</td>
                    <td>
                        <button class="btn btn-delete" onclick="deleteUser(${user.id})">Delete</button>
                        ${user.admin ? '' : `<button class="btn btn-promote" onclick="promoteUser(${user.id})">Promote</button>`}
                    </td>
                `;

                // Add the new row to the table
                tbody.appendChild(row);
            });
        })
        .catch(err => {
            console.error("Failed to load users:", err); // Log error in console
            alert("❌ Could not load user list."); // Show error to user
        });
});

// ❌ Delete a user by ID
function deleteUser(userId) {
    // Ask for confirmation before deleting
    if (!confirm("Are you sure you want to delete this user?")) return;

    // Send DELETE request to backend
    fetch(`http://localhost:8080/api/admin/user/${userId}`, {
        method: "DELETE"
    })
        .then(res => res.text()) // Convert response to plain text
        .then(msg => {
            alert(msg); // Show result to admin
            location.reload(); // Reload the page to update list
        })
        .catch(err => alert("❌ Failed to delete user: " + err.message));
}

// ⬆️ Promote a user to admin
function promoteUser(userId) {
    // Send PUT request to promote user
    fetch(`http://localhost:8080/api/admin/promote/${userId}`, {
        method: "PUT"
    })
        .then(res => res.text()) // Convert response to text
        .then(msg => {
            alert(msg); // Show confirmation
            location.reload(); // Refresh to reflect promotion
        })
        .catch(err => alert("❌ Failed to promote user: " + err.message));
}

// 🏠 Navigate to Home page
function goToHome() {
    window.location.href = "Home.html";
}

// 🧹 Navigate to Post Moderation page
function goToPostModeration() {
    window.location.href = "../adminPosts.html";
}
