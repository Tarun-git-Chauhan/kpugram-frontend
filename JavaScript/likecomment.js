/*
// ✅ Attach like and comment handlers to each post
function attachLikeCommentHandlers() {
  // Get all post elements on the page
  const posts = document.querySelectorAll('.post');

  posts.forEach(post => {
    // 🚫 Skip if like button already exists (prevents duplicates on re-render)
    if (post.querySelector('.like-btn')) return;

    // 🆔 Extract the post ID from data attribute
    const postId = post.getAttribute('data-post-id');
    if (!postId) return; // 🚫 Skip if postId is missing

    // ❤️ CREATE Like button
    const likeBtn = document.createElement('button');
    likeBtn.className = 'like-btn';
    likeBtn.textContent = '❤️ Like';

    // 📌 Add click event to like the post
    likeBtn.onclick = () => {
      const userId = localStorage.getItem("userId"); // 🔐 Get logged-in user ID

      if (!userId) {
        alert("Please log in first.");
        return;
      }

      // 🔗 Send POST request to like the post
      fetch('https://kpugram-backend.onrender.com/api/likes/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: parseInt(postId), userId: parseInt(userId) })
      })
          .then(res => {
            if (!res.ok) throw new Error("Like failed");
            return res.text();
          })
          .then(msg => alert("Liked!")) // ✅ Notify user
          .catch(err => alert("Like error: " + err.message)); // ❌ Error handling
    };

    post.appendChild(likeBtn); // ➕ Add like button to the post

    // 💬 CREATE Comment input field
    const commentInput = document.createElement('input');
    commentInput.className = 'comment-input';
    commentInput.placeholder = 'Add a comment...';

    // 📤 CREATE Post Comment button
    const commentBtn = document.createElement('button');
    commentBtn.textContent = 'Post';
    commentBtn.className = 'comment-btn';

    // 📌 Add click event to post the comment
    commentBtn.onclick = () => {
      const comment = commentInput.value.trim();
      const userId = localStorage.getItem("userId"); // 🔐 Get user ID

      if (!userId) {
        alert("Login required to comment.");
        return;
      }

      if (comment) {
        // 🔗 Send POST request to submit comment
        fetch('https://kpugram-backend.onrender.com/api/comments/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            postId: parseInt(postId),
            userId: parseInt(userId),
            content: comment
          })
        })
            .then(res => {
              if (!res.ok) throw new Error("Comment failed");
              return res.text();
            })
            .then(msg => {
              alert("Comment added!"); // ✅ Notify user
              commentInput.value = ''; // 🧹 Clear input after posting
            })
            .catch(err => {
              alert("Comment error: " + err.message); // ❌ Error handling
            });
      }
    };

    // 📦 CREATE container for existing comments
    const commentSection = document.createElement('div');
    commentSection.className = 'comments';

    // ➕ Append input, button, and comment section to the post
    post.appendChild(commentInput);
    post.appendChild(commentBtn);
    post.appendChild(commentSection);

    // 🔄 LOAD Existing comments from backend
    fetch(`https://kpugram-backend.onrender.com/api/comments/post/${postId}`)
        .then(res => res.json())
        .then(comments => {
          comments.forEach(comment => {
            const p = document.createElement('p');
            p.textContent = `💬 ${comment.content}`; // 🖊️ Show each comment
            commentSection.appendChild(p);
          });
        });
  });
}
*/


// likecomment.js
// Purpose: add comment UI + handlers for each post in the feed.
// Note: Likes are handled in script2.js, so we DO NOT create like buttons here.

const API = window.BASE_URL || "https://kpugram-backend.onrender.com";

/**
 * Called from script2.js after the feed is rendered.
 * Finds each .post card and injects:
 *   - "View Comments" toggle
 *   - Comments list (lazy-loaded)
 *   - Input + Post button
 */
function attachLikeCommentHandlers() {
  const posts = document.querySelectorAll(".post");

  posts.forEach(post => {
    const postId = post.getAttribute("data-post-id");
    if (!postId) return;

    // Avoid duplicating the comments UI if loadPosts() is called again
    if (post.querySelector(".comments-section")) return;

    // --- Build comments UI ---
    const commentsSection = document.createElement("div");
    commentsSection.className = "comments-section";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "view-comments-btn";
    toggleBtn.textContent = "💬 View Comments";
    toggleBtn.setAttribute("data-open", "false");
    toggleBtn.setAttribute("data-id", postId);

    const list = document.createElement("div");
    list.className = "comment-list";
    list.id = `comment-list-${postId}`;
    list.style.display = "none"; // hidden until opened

    const formWrap = document.createElement("div");
    formWrap.className = "comment-form";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Write a comment...";
    input.className = "comment-input";
    input.id = `comment-input-${postId}`;

    const send = document.createElement("button");
    send.textContent = "Post";
    send.className = "comment-submit-btn";
    send.setAttribute("data-id", postId);

    formWrap.appendChild(input);
    formWrap.appendChild(send);

    commentsSection.appendChild(toggleBtn);
    commentsSection.appendChild(list);
    commentsSection.appendChild(formWrap);

    // Insert comments UI at the bottom of the post body
    const postBody = post.querySelector(".post-body") || post;
    postBody.appendChild(commentsSection);

    // --- Wire up events ---

    // Toggle + lazy-load comments
    toggleBtn.addEventListener("click", async () => {
      const isOpen = toggleBtn.getAttribute("data-open") === "true";
      if (isOpen) {
        list.style.display = "none";
        toggleBtn.textContent = "💬 View Comments";
        toggleBtn.setAttribute("data-open", "false");
        return;
      }

      // Opening: fetch comments then show
      await loadCommentsForPost(postId);
      list.style.display = "block";
      toggleBtn.textContent = "💬 Hide Comments";
      toggleBtn.setAttribute("data-open", "true");
    });

    // Submit a new comment
    send.addEventListener("click", async () => {
      const userId = localStorage.getItem("userId");
      const content = input.value.trim();
      if (!userId) return alert("Login required to comment.");
      if (!content) return;

      try {
        await createComment(postId, userId, content);
        input.value = "";
        // Refresh list if open
        if (toggleBtn.getAttribute("data-open") === "true") {
          await loadCommentsForPost(postId);
        }
      } catch (err) {
        console.error(err);
        alert("Could not add comment.");
      }
    });
  });
}

/** Fetch and render comments for a post */
async function loadCommentsForPost(postId) {
  const listEl = document.getElementById(`comment-list-${postId}`);
  if (!listEl) return;
  listEl.innerHTML = "<div class='comments-loading'>Loading...</div>";

  try {
    // FIXED: https (had missing 'h' before)
    const res = await fetch(`${API}/api/comments/post/${postId}`);
    if (!res.ok) throw new Error("Failed to load comments");
    const comments = await res.json(); // expected: [{ id, username, content, createdAt }, ...]

    if (!comments.length) {
      listEl.innerHTML = "<div class='no-comments'>Be the first to comment!</div>";
      return;
    }

    listEl.innerHTML = comments.map(c => `
      <div class="comment">
        <div class="comment-header">
          <span class="comment-username">@${escapeHtml(c.username || "user")}</span>
          <span class="comment-time">${new Date(c.createdAt).toLocaleString()}</span>
        </div>
        <div class="comment-content">${escapeHtml(c.content || "")}</div>
      </div>
    `).join("");
  } catch (e) {
    console.error(e);
    listEl.innerHTML = "<div class='comments-error'>Failed to load comments.</div>";
  }
}

/** Create a new comment via your existing endpoint */
async function createComment(postId, userId, content) {
  const res = await fetch(`${API}/api/comments/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      postId: parseInt(postId),
      userId: parseInt(userId),
      content
    })
  });
  if (!res.ok) throw new Error(await res.text());
}

/** basic escape to prevent injecting HTML via comments */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;"
  }[s]));
}
