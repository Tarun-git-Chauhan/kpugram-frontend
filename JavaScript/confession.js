/* // ✅ Load all anonymous confessions
function loadConfessionsFromBackend() {
    fetch("ttps://kpugram-backend.onrender.com/api/confessions")
        .then(res => {
            if (!res.ok) throw new Error("Failed to load confessions");
            return res.json();
        })
        .then(confessions => {
            const feed = document.querySelector(".confession-feed");
            feed.innerHTML = "";

            confessions.reverse().forEach(confession => {
                const box = document.createElement("div");
                box.className = "confession-box";

                // Confession content
                const text = document.createElement("p");
                text.textContent = confession.content;

                // Like Button (Future use)
                const likeBtn = document.createElement("button");
                likeBtn.className = "like-btn";
                likeBtn.textContent = `❤️ ${confession.likes || 0}`;
                likeBtn.onclick = () => {
                    alert("Like recorded! (Coming soon)");
                };

                // Comment section
                const commentInput = document.createElement("input");
                commentInput.placeholder = "Add a comment...";
                commentInput.className = "comment-input";

                const commentBtn = document.createElement("button");
                commentBtn.textContent = "Post";
                commentBtn.className = "comment-btn";
                commentBtn.onclick = () => {
                    alert("Commenting not supported yet.");
                };

                const commentsDiv = document.createElement("div");
                commentsDiv.className = "comments";
                commentsDiv.innerHTML = "<small>💬 Comments (future)</small>";

                // 🧱 Append all
                box.appendChild(text);
                box.appendChild(likeBtn);
                box.appendChild(commentInput);
                box.appendChild(commentBtn);
                box.appendChild(commentsDiv);

                feed.appendChild(box);
            });
        })
        .catch(error => {
            console.error("Confession load error:", error);
            document.querySelector(".confession-feed").innerHTML = "<p>Could not load confessions.</p>";
        });
}

// ✅ Submit a confession
function submitConfessionToBackend(content) {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("Please login first!");
        return;
    }

    const data = {
        content: content,
        anonymous: true
    };

    fetch(`ttps://kpugram-backend.onrender.com/api/confessions/create?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (!res.ok) throw new Error("Submission failed");
            return res.text();
        })
        .then(() => {
            alert("✅ Confession submitted!");
            loadConfessionsFromBackend();
        })
        .catch(err => {
            alert("❌ Error: " + err.message);
        });
}

// 🚀 DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    loadConfessionsFromBackend();

    const form = document.querySelector(".confess-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const textarea = form.querySelector("textarea");
        const newConfession = textarea.value.trim();
        if (!newConfession) return;

        submitConfessionToBackend(newConfession);
        textarea.value = "";
    });

    const username = localStorage.getItem("username") || "username";
    const usernameDisplay = document.getElementById("headerUsername");
    if (usernameDisplay) {
        usernameDisplay.textContent = "@" + username;
    }
});
*/
/// ✅ Load all anonymous confessions from backend and render them
function loadConfessionsFromBackend() {
    fetch("https://kpugram-backend.onrender.com/api/confessions")
        .then(res => {
            if (!res.ok) throw new Error("Failed to load confessions");
            return res.json();
        })
        .then(confessions => {
            const feed = document.querySelector(".confession-feed");
            feed.innerHTML = ""; // Clear existing content

            // Reverse to show latest confessions first
            confessions.reverse().forEach(confession => {
                const box = document.createElement("div");
                box.className = "confession-box";

                const confessionId = confession.id;

                // ✅ Retrieve local likes and comments
                const localLikes = JSON.parse(localStorage.getItem("likes")) || {};
                const localComments = JSON.parse(localStorage.getItem("comments")) || {};

                const currentLikeCount = localLikes[confessionId] || 0;
                const comments = localComments[confessionId] || [];

                // 📝 Confession text
                const text = document.createElement("p");
                text.textContent = confession.content;

                // ❤️ Like button
                const likeBtn = document.createElement("button");
                likeBtn.className = "like-btn";
                likeBtn.textContent = `❤️ ${currentLikeCount}`;

                // 🔁 Prevent multiple likes by same user
                let liked = localStorage.getItem(`liked-${confessionId}`) === "true";
                likeBtn.style.opacity = liked ? "0.6" : "1.0";

                likeBtn.onclick = () => {
                    if (!liked) {
                        localLikes[confessionId] = (localLikes[confessionId] || 0) + 1;
                        localStorage.setItem("likes", JSON.stringify(localLikes));
                        localStorage.setItem(`liked-${confessionId}`, "true");

                        likeBtn.textContent = `❤️ ${localLikes[confessionId]}`;
                        likeBtn.style.opacity = "0.6";
                        liked = true;
                    } else {
                        alert("You have already liked this confession.");
                    }
                };

                // 💬 Comments container
                const commentsDiv = document.createElement("div");
                commentsDiv.className = "comments";
                commentsDiv.innerHTML = "<small>💬 Comments</small>";

                // 📋 List existing comments
                const commentList = document.createElement("ul");
                commentList.className = "comment-list";
                comments.forEach(comment => {
                    const li = document.createElement("li");
                    li.textContent = comment;
                    commentList.appendChild(li);
                });

                // ✍️ Comment input field
                const commentInput = document.createElement("input");
                commentInput.placeholder = "Add a comment...";
                commentInput.className = "comment-input";

                // 📨 Comment post button
                const commentBtn = document.createElement("button");
                commentBtn.textContent = "Post";
                commentBtn.className = "comment-btn";

                // ➕ Add new comment to localStorage and UI
                commentBtn.onclick = () => {
                    const commentText = commentInput.value.trim();
                    if (commentText) {
                        comments.push(commentText);
                        localComments[confessionId] = comments;
                        localStorage.setItem("comments", JSON.stringify(localComments));

                        const li = document.createElement("li");
                        li.textContent = commentText;
                        commentList.appendChild(li);
                        commentInput.value = ""; // Clear input
                    }
                };

                // 🧱 Append all elements to the confession box
                commentsDiv.appendChild(commentList);
                box.appendChild(text);
                box.appendChild(likeBtn);
                box.appendChild(commentInput);
                box.appendChild(commentBtn);
                box.appendChild(commentsDiv);

                feed.appendChild(box); // 📥 Add confession to feed
            });
        })
        .catch(error => {
            console.error("Confession load error:", error);
            document.querySelector(".confession-feed").innerHTML = "<p>Could not load confessions.</p>";
        });
}

// ✅ Submit a confession to backend (Spring Boot API)
function submitConfessionToBackend(content) {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("Please login first!");
        return;
    }

    const data = {
        content: content,
        anonymous: true
    };

    // 📤 Send confession using POST request
    fetch(`https://kpugram-backend.onrender.com/api/confessions/create?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (!res.ok) throw new Error("Submission failed");
            return res.text();
        })
        .then(() => {
            alert("✅ Confession submitted!");
            loadConfessionsFromBackend(); // 🔁 Refresh feed
        })
        .catch(err => {
            alert("❌ Error: " + err.message);
        });
}

// 🚀 On DOM Ready: Load confessions and setup form events
document.addEventListener("DOMContentLoaded", () => {
    loadConfessionsFromBackend();

    // 🎤 Handle confession form submission
    const form = document.querySelector(".confess-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const textarea = form.querySelector("textarea");
        const newConfession = textarea.value.trim();
        if (!newConfession) return;

        submitConfessionToBackend(newConfession);
        textarea.value = ""; // Clear input field
    });

    // 👤 Display logged-in username
    const username = localStorage.getItem("username") || "username";
    const usernameDisplay = document.getElementById("headerUsername");
    if (usernameDisplay) {
        usernameDisplay.textContent = "@" + username;
    }
});
