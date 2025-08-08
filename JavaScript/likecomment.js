// likecomment.js
// Robust comments for each post using event delegation, so taps always work
// even if posts are re-rendered later.

const API = "https://kpugram-backend.onrender.com";

/** Call this AFTER rendering the feed (script2.js already does this). */
function attachLikeCommentHandlers() {
  console.log("[comments] attaching handlers…");
  const posts = document.querySelectorAll(".post");

  posts.forEach(post => {
    const postId = post.getAttribute("data-post-id");
    if (!postId) return;

    // Avoid duplicating UI if loadPosts() runs again
    if (post.querySelector(".comments-section")) return;

    // Build comments UI
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
    list.style.display = "none";

    const formWrap = document.createElement("div");
    formWrap.className = "comment-form";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Write a comment…";
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

    // Append under the post body so it’s tappable
    (post.querySelector(".post-body") || post).appendChild(commentsSection);
  });
}

/* ========= Event Delegation (works for all current & future posts) ========= */
document.addEventListener("click", async (e) => {
  // Toggle comments
  const toggleBtn = e.target.closest(".view-comments-btn");
  if (toggleBtn) {
    const postId = toggleBtn.getAttribute("data-id");
    const list = document.getElementById(`comment-list-${postId}`);
    const isOpen = toggleBtn.getAttribute("data-open") === "true";

    console.log("[comments] toggle click", { postId, isOpen });

    if (isOpen) {
      list.style.display = "none";
      toggleBtn.textContent = "💬 View Comments";
      toggleBtn.setAttribute("data-open", "false");
      return;
    }

    // Opening: try to load, but show panel regardless
    try {
      await loadCommentsForPost(postId);
    } catch (err) {
      console.error("[comments] load failed", err);
      list.innerHTML = "<div class='comments-error'>Could not load comments.</div>";
    }
    list.style.display = "block";
    toggleBtn.textContent = "💬 Hide Comments";
    toggleBtn.setAttribute("data-open", "true");
  }

  // Submit new comment
  const sendBtn = e.target.closest(".comment-submit-btn");
  if (sendBtn) {
    const postId = sendBtn.getAttribute("data-id");
    const input = document.getElementById(`comment-input-${postId}`);
    const userId = localStorage.getItem("userId");
    const content = (input?.value || "").trim();

    if (!userId) return alert("Login required to comment.");
    if (!content) return;

    try {
      await createComment(postId, userId, content);
      input.value = "";
      // If list is open, refresh
      const toggle = sendBtn.closest(".comments-section").querySelector(".view-comments-btn");
      if (toggle && toggle.getAttribute("data-open") === "true") {
        await loadCommentsForPost(postId);
      }
    } catch (err) {
      console.error("[comments] create failed", err);
      alert("Could not add comment.");
    }
  }
});

/* ====================== API helpers ====================== */

async function loadCommentsForPost(postId) {
  const listEl = document.getElementById(`comment-list-${postId}`);
  if (!listEl) return;
  listEl.innerHTML = "<div class='comments-loading'>Loading…</div>";

  const res = await fetch(`${API}/api/comments/post/${postId}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const comments = await res.json(); // [{id, username, content, createdAt}, …]

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
}

async function createComment(postId, userId, content) {
  const res = await fetch(`${API}/api/comments/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId: +postId, userId: +userId, content })
  });
  if (!res.ok) throw new Error(await res.text());
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[s]));
}
