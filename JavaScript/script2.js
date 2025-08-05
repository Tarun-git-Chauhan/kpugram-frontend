// ✅ Navigation shortcuts - functions to go to different pages
function goToHome() {
  window.location.href = '../Home.html';
}
function goToUpload() {
  window.location.href = '../upload.html';
}
function goToConfess() {
  window.location.href = '../confession.html';
}
function goToProfile() {
  window.location.href = '../profile.html';
}
function goToAdminDashboard() {
  window.location.href = '../admin.html';
}

// ✅ DOM Ready logic - runs when the page is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Get saved username from localStorage or use default "username"
  const username = localStorage.getItem("username") || "username";
  // Get admin status (string "true" or "false") and convert to boolean
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // 👤 Show the username in the top-right corner of the page
  const userDiv = document.querySelector(".username");
  if (userDiv) {
    userDiv.textContent = "@" + username;
  }

  // 🔄 Make the logo clickable - redirects to admin dashboard if admin, else home page
  const logo = document.querySelector(".logo");
  if (logo) {
    logo.style.cursor = "pointer"; // Change cursor to pointer on hover
    logo.addEventListener("click", () => {
      isAdmin ? goToAdminDashboard() : goToHome();
    });
  }

  // 🛠️ If user is admin, add "Dashboard" button to the top navigation bar
  if (isAdmin) {
    const navBar = document.querySelector(".nav");
    if (navBar && !document.querySelector(".admin-nav-btn")) {
      const dashBtn = document.createElement("button");
      dashBtn.textContent = "Dashboard";
      dashBtn.className = "admin-nav-btn";
      dashBtn.style.marginLeft = "10px";
      dashBtn.onclick = goToAdminDashboard;
      navBar.appendChild(dashBtn);
    }
  }

  // ✅ If user is admin, add admin dashboard icon button to the bottom navigation
  if (isAdmin) {
    const bottomNav = document.querySelector(".bottom-nav");
    if (bottomNav && !document.querySelector(".admin-nav-icon")) {
      const btn = document.createElement("button");
      btn.className = "admin-nav-icon";
      btn.innerHTML = `<img src="../icons/dashboard.png" style="height:20px;" title="Dashboard"/>`;
      btn.onclick = goToAdminDashboard;
      bottomNav.appendChild(btn);
    }
  }

  // 🖼️ Profile picture preview for signup page
  const fileInput = document.getElementById('profilePicUpload');
  if (fileInput) {
    fileInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      const reader = new FileReader();

      // When the image file is read, update the profile image preview
      reader.onload = function (event) {
        const profileImg = document.getElementById('profileImage');
        if (profileImg) {
          profileImg.src = event.target.result;
        }
      };

      // If a file was selected, start reading it as data URL
      if (file) reader.readAsDataURL(file);
    });
  }

  // 📸 If on home page (has element with id 'feed'), load the posts feed
  if (document.getElementById('feed')) {
    loadPosts();
  }

  // 👤 If on profile page (has element with id 'postGrid'), load user posts and profile info
  if (document.getElementById('postGrid')) {
    loadUserPosts();
    loadProfileInfo();
  }

  // 🔗 Link profile username in feed cards with clickable link to their profile page
  const userDisplay = document.getElementById("userDisplay");
  const userId = localStorage.getItem("userId");
  if (userDisplay && username) {
    userDisplay.textContent = `@${username}`;
    userDisplay.href = `profile.html?userId=${userId}`;
  }
});

// ✅ Load posts into the main feed on home page
function loadPosts() {
  const feed = document.getElementById('feed');
  feed.innerHTML = ""; // Clear existing feed content

  fetch('https://kpugram-backend.onrender.com/api/posts/feed')
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
      })
      .then(posts => {
        // Loop through each post and create its HTML
        posts.forEach(post => {
          const postElement = document.createElement('div');
          postElement.className = 'post';
          postElement.setAttribute('data-post-id', post.id);

          const isAnonymous = post.anonymous;
          // Show username or "Anonymous" if post is anonymous
          const displayUsername = isAnonymous ? "Anonymous" : `@${post.username}`;
          // Show profile picture or default anonymous icon
          const profilePicture = isAnonymous
              ? "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              : `https://kpugram-backend.onrender.com${post.profilePicture || "/images/default.png"}`;
          const likeCount = post.likes || 0;

          // Fill post content with username, text, image (if any), likes, and timestamp
          postElement.innerHTML = `
          <div class="post-header">
            <span class="post-username">${displayUsername}</span>
          </div>
          <div class="post-body">
            <p>${post.content}</p>
            ${post.imageUrl ? `<img src="https://kpugram-backend.onrender.com${post.imageUrl}" class="post-img">` : ''}
            <div class="post-footer">
              <span class="likes">❤️ ${likeCount}</span>
              <small>🕒 ${new Date(post.createdAt).toLocaleString()}</small>
            </div>
          </div>
        `;
          feed.appendChild(postElement);
        });

        // Attach like and comment button handlers if function exists
        if (typeof attachLikeCommentHandlers === 'function') {
          attachLikeCommentHandlers();
        }
      })
      .catch(err => {
        console.error("Error loading posts:", err);
        feed.innerHTML = "<p>Failed to load feed 😞</p>";
      });
}

// ✅ Load profile info for current user on profile page
function loadProfileInfo() {
  const userId = localStorage.getItem("userId");

  fetch(`https://kpugram-backend.onrender.com/api/profile/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("Could not fetch profile data");
        return res.json();
      })
      .then(data => {
        const username = data.username || "guest";
        let profilePicture = data.profilePicture;

        // Fix profile picture URL if needed or set default icon
        if (profilePicture?.startsWith("/images/")) {
          profilePicture = "https://kpugram-backend.onrender.com" + profilePicture;
        } else if (!profilePicture || profilePicture === "null") {
          profilePicture = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        }

        const loginCount = data.loginCount || 0;

        // Update profile page elements with data
        document.getElementById("profileImage").src = profilePicture;
        document.getElementById("profileUsername").textContent = "@" + username;
        document.getElementById("handle").textContent = "@" + username;
        document.getElementById("name").textContent = username.charAt(0).toUpperCase() + username.slice(1);
        document.getElementById("streakCount").textContent = loginCount;
      })
      .catch(error => {
        console.error("Failed to load profile info:", error);
      });
}

// ✅ Load posts made by current user for profile page post grid
function loadUserPosts() {
  const userId = localStorage.getItem("userId");
  const grid = document.getElementById('postGrid');
  grid.innerHTML = ""; // Clear existing posts

  fetch(`https://kpugram-backend.onrender.com/api/profile/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("Could not load your posts");
        return res.json();
      })
      .then(data => {
        const posts = data.posts || [];

        // Create post cards for each user post
        posts.forEach(post => {
          const postCard = document.createElement('div');
          postCard.className = 'post';

          // Fix image URL if needed
          const imageUrl = post.imageUrl?.startsWith("/images/")
              ? "https://kpugram-backend.onrender.com" + post.imageUrl
              : post.imageUrl || "";

          postCard.innerHTML = `
          ${imageUrl ? `<img src="${imageUrl}" class="post-img" alt="Post Image" />` : ""}
          <p>${post.content}</p>
        `;
          grid.appendChild(postCard);
        });

        // Show message if no posts exist
        if (posts.length === 0) {
          grid.innerHTML = "<p>No posts yet...</p>";
        }
      })
      .catch(err => {
        console.error("Error loading your posts:", err);
        grid.innerHTML = "<p>Could not load posts 😞</p>";
      });
}

// 🔁 Basic infinite scroll: load more posts when user scrolls near bottom
let page = 1;
function fetchMorePosts() {
  loadPosts();
}
window.addEventListener('scroll', () => {
  // Check if user scrolled to near bottom of the page
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    fetchMorePosts();
  }
});
