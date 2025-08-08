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
  window.location.href = '../admin.html'
}

const BASE_URL = "https://kpugram-backend.onrender.com"; // this will be used as a based URL to it make easy to switch between the online or local hosting

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

  fetch(`${BASE_URL}/api/posts/feed`)
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
              : `${BASE_URL}${post.profilePicture || "/images/default.png"}`;
          const likeCount = post.likeCount || 0; // when you will correct the like thing just look under the LikeController.java where you can see the endpoints
/*
          // here got two options like we can fetch everytime to get the likes seperately which increase the api traffic
          // it is ok if it is only 10 to 50 posts but we have another option we change the DTO where we can give the likecount so it will work into the single api
          // Fill post content with username, text, image (if any), likes, and timestamp
          // here we have to fetch the like count dynamically per post
          fetch(`${BASE_URL}//api/likes/count/${post.id}`)
              .then(res => res.json())
              .then(likeCount => {
                  postElement.innerHTML = `
            <div class="post-header">
              <span class="post-username">${displayUsername}</span>
            </div>
            <div class="post-body">
              <p>${post.content}</p>
              ${post.imageUrl ? `<img src="${BASE_URL}${post.imageUrl}" class="post-img">` : ''}
              <div class="post-footer">
                <span class="likes">❤️ ${likeCount}</span>
                <small>🕒 ${new Date(post.createdAt).toLocaleString()}</small>
              </div>
            </div>
          `;
                  feed.appendChild(postElement);
              });

 */
          // Fix image URL
          const imgUrl = post.imageUrl
              ? (post.imageUrl.startsWith('http') ? post.imageUrl : `${BASE_URL}${post.imageUrl}`)
              : null;

          postElement.innerHTML = `
            <div class="post-header">
              <span class="post-username" style="cursor: pointer;" onclick="viewUserProfile(${post.userId})">${displayUsername}</span>
            </div>
            <div class="post-body">
              <p>${post.content}</p>
<!--              ${post.imageUrl ? `<img src="${BASE_URL}${post.imageUrl}" class="post-img">` : ''}-->
              ${imgUrl ? `<img src="${imgUrl}" class="post-img" alt="Post Image">` : ''}
              <div class="post-footer">
<!--              here we adding the button-->
                <button class="like-btn" data-id="${post.id}">❤️</button>
              <span class="likes-count" id="likes-${post.id}">${likeCount}</span>
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

// this one to click on the @Username then go to the profile of that user.
function viewUserProfile(userId) {
  if (!userId) {
    alert("Anonymous profile cannot be viewed.");
    return;
  }
  window.location.href = `profile.html?userId=${userId}`;
}


// ✅ Load profile info for current user on profile page
/*function loadProfileInfo() {
  // const userId = localStorage.getItem("userId");

  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId") || localStorage.getItem("userId");

  fetch(`${BASE_URL}/api/profile/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("Could not fetch profile data");
        return res.json();
      })
      .then(data => {
        const username = data.username || "guest";
        let profilePicture = data.profilePicture;

        // Fix profile picture URL if needed or set default icon
        if (profilePicture?.startsWith("/images/")) {
          profilePicture = `${BASE_URL}` + profilePicture;
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
}*/
/*function loadProfileInfo() {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId") || localStorage.getItem("userId");

  fetch(`${BASE_URL}/api/profile/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("Could not fetch profile data");
        return res.json();
      })
      .then(data => {
        // username priority: DB -> localStorage -> 'guest'
        const storedUsername = localStorage.getItem("username");
        const username = (data.username && data.username.trim()) || storedUsername || "guest";

        // profile pic: prefix BASE_URL if relative; fallback to default icon
        let profilePicture = data.profilePicture;
        if (profilePicture) {
          if (!profilePicture.startsWith("http")) {
            profilePicture = `${BASE_URL}${profilePicture}`;
          }
        } else {
          profilePicture = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        }

        // bio (DB first; you can also fall back to localStorage if you store it there)
        const bio = (data.bio && data.bio.trim()) || "";

        const loginCount = data.loginCount || 0;

        // ✅ write to DOM — use IDs that actually exist in profile.html
        document.getElementById("profileImage").src = profilePicture;
        document.getElementById("fullName").textContent = username.charAt(0).toUpperCase() + username.slice(1);
        document.getElementById("handle").textContent = "@" + username;
        document.getElementById("headerUsername").textContent = "@" + username;
        document.getElementById("streakCount").textContent = loginCount;
        const bioEl = document.getElementById("bio");
        if (bioEl) bioEl.textContent = bio || ""; // leave empty if no bio
      })
      .catch(err => {
        console.error("Failed to load profile info:", err);

        // Fallbacks so the page still shows sensible data
        const username = localStorage.getItem("username") || "guest";
        document.getElementById("fullName").textContent = username.charAt(0).toUpperCase() + username.slice(1);
        document.getElementById("handle").textContent = "@" + username;
        document.getElementById("headerUsername").textContent = "@" + username;
      });
}*/

function loadProfileInfo() {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId") || localStorage.getItem("userId");

  fetch(`${BASE_URL}/api/profile/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("Could not fetch profile data");
        return res.json();
      })
      .then(data => {
        // Username priority: API → localStorage → guest
        const storedUsername = localStorage.getItem("username");
        const username = (data.username && data.username.trim()) || storedUsername || "guest";

        // Profile picture handling
        let profilePicture = data.profilePicture;
        if (profilePicture) {
          if (!profilePicture.startsWith("http")) {
            profilePicture = `${BASE_URL}${profilePicture}`;
          }
        } else {
          profilePicture = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        }

        // Bio from API (no localStorage fallback here unless you store it there)
        const bio = (data.bio && data.bio.trim()) || "";

        // Login streak count
        const loginCount = data.loginCount || 0;

        // ✅ Update DOM elements (matching profile.html IDs)
        document.getElementById("profileImage").src = profilePicture;
        document.getElementById("fullName").textContent = username.charAt(0).toUpperCase() + username.slice(1);
        document.getElementById("handle").textContent = "@" + username;
        document.getElementById("headerUsername").textContent = "@" + username;
        document.getElementById("streakCount").textContent = loginCount;
        const bioEl = document.getElementById("bio");
        if (bioEl) bioEl.textContent = bio;
      })
      .catch(err => {
        console.error("Failed to load profile info:", err);
        // Fallback to localStorage if API fails
        const username = localStorage.getItem("username") || "guest";
        document.getElementById("fullName").textContent = username.charAt(0).toUpperCase() + username.slice(1);
        document.getElementById("handle").textContent = "@" + username;
        document.getElementById("headerUsername").textContent = "@" + username;
      });
}



// ✅ Load posts made by current user for profile page post grid
function loadUserPosts() {
  // const userId = localStorage.getItem("userId");
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("userId") || localStorage.getItem("userId");


  const grid = document.getElementById('postGrid');
  grid.innerHTML = ""; // Clear existing posts

  fetch(`${BASE_URL}/api/profile/${userId}`)
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
              ? `${BASE_URL}` + post.imageUrl
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

// to like button click handler work

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('like-btn')) {
    const postId = e.target.getAttribute('data-id');
    const userId = localStorage.getItem('userId');

    fetch(`${BASE_URL}/api/likes/like?userId=${userId}&postId=${postId}`, {
      method: 'POST'
    })
        .then(res => res.text())
        .then(msg => {
          console.log(msg);
          if (msg.includes("successfully")) {
            const likeCountEl = document.getElementById(`likes-${postId}`);
            if (likeCountEl) {
              likeCountEl.textContent = parseInt(likeCountEl.textContent) + 1;
            }
            e.target.disabled = true;
            e.target.style.opacity = "0.5";
            e.target.title = "You already liked this post";
          }
        })
        .catch(err => console.error("Failed to like post:", err));
  }
});
