/*
// 🏠 Navigate to the Home page
function goToHome() {
    window.location.href = "../HTML/Home.html";
}

// 📰 Load all posts when the page is ready
document.addEventListener("DOMContentLoaded", () => {
    // Fetch posts from backend
    fetch("http://localhost:8080/api/posts/feed")
        .then(res => res.json()) // Convert response to JSON
        .then(posts => {
            const tableBody = document.querySelector("#postTable tbody"); // Select table body
            tableBody.innerHTML = ""; // Clear any existing content

            // Loop through each post and create a table row
            posts.forEach(post => {
                const row = document.createElement("tr");

                // Fill in row with post data
                row.innerHTML = `
                    <td>${post.id}</td>
                    <td>${post.content}</td>
                    <td>${post.imageUrl ? `<img src="http://localhost:8080${post.imageUrl}" class="post-img">` : "-"}</td>
                    <td>${post.anonymous ? "Anonymous" : `@${post.username}`}</td>
                    <td>${new Date(post.createdAt).toLocaleString()}</td>
                    <td><button class="delete-btn" onclick="deletePost(${post.id})">Delete</button></td>
                `;

                // Add the row to the table
                tableBody.appendChild(row);
            });
        })
        .catch(err => {
            console.error("Failed to load posts:", err); // Log error in console
            // Show error message in table
            document.querySelector("#postTable tbody").innerHTML = "<tr><td colspan='6'>Error loading posts</td></tr>";
        });
});

// ❌ Delete a post by ID
function deletePost(postId) {
    // Ask for confirmation before deleting
    if (!confirm("Are you sure you want to delete this post?")) return;

    const userId = localStorage.getItem("userId"); // Required by backend

    // Send DELETE request with postId and userId
    fetch(`http://localhost:8080/api/posts/${postId}?userId=${userId}`, {
        method: "DELETE"
    })
        .then(res => {
            if (res.ok) {
                alert("✅ Post deleted!"); // Notify success
                location.reload();        // Refresh the page to update table
            } else {
                alert("❌ Failed to delete post"); // Notify failure
            }
        })
        .catch(err => {
            console.error("Error deleting post:", err); // Log error
            alert("Error occurred while deleting");     // Show alert to user
        });
}

// 👥 Navigate to the User Dashboard (Admin page)
function goToUserDashboard() {
    window.location.href = "../admin.html";
}
*/

// 🏠 Navigate to the Home page
function goToHome() {
    window.location.href = "/Home.html";
}

// 📰 Load all posts when the page is ready
document.addEventListener("DOMContentLoaded", () => {
    // ✅ Fetch posts from Render backend
    fetch("https://kpugram-backend.onrender.com/api/posts/feed")
        .then(res => res.json())
        .then(posts => {
            const tableBody = document.querySelector("#postTable tbody");
            tableBody.innerHTML = "";

            posts.forEach(post => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${post.id}</td>
                    <td>${post.content}</td>
                    <td>${post.imageUrl ? `<img src="https://kpugram-backend.onrender.com${post.imageUrl}" class="post-img">` : "-"}</td>
                    <td>${post.anonymous ? "Anonymous" : `@${post.username}`}</td>
                    <td>${new Date(post.createdAt).toLocaleString()}</td>
                    <td><button class="delete-btn" onclick="deletePost(${post.id})">Delete</button></td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(err => {
            console.error("Failed to load posts:", err);
            document.querySelector("#postTable tbody").innerHTML = "<tr><td colspan='6'>Error loading posts</td></tr>";
        });
});

// ❌ Delete a post by ID
function deletePost(postId) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const userId = localStorage.getItem("userId");

    fetch(`https://kpugram-backend.onrender.com/api/posts/${postId}?userId=${userId}`, {
        method: "DELETE"
    })
        .then(res => {
            if (res.ok) {
                alert("✅ Post deleted!");
                location.reload();
            } else {
                alert("❌ Failed to delete post");
            }
        })
        .catch(err => {
            console.error("Error deleting post:", err);
            alert("Error occurred while deleting");
        });
}

// 👥 Navigate to the User Dashboard (Admin page)
function goToUserDashboard() {
    window.location.href = "/admin.html";
}


