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
      fetch('http://localhost:8080/api/likes/like', {
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
        fetch('http://localhost:8080/api/comments/add', {
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
    fetch(`http://localhost:8080/api/comments/post/${postId}`)
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


// ✅ Attach like and comment handlers to each post
function attachLikeCommentHandlers() {
  const posts = document.querySelectorAll('.post');

  posts.forEach(post => {
    if (post.querySelector('.like-btn')) return;

    const postId = post.getAttribute('data-post-id');
    if (!postId) return;

    // ❤️ Like button
    const likeBtn = document.createElement('button');
    likeBtn.className = 'like-btn';
    likeBtn.textContent = '❤️ Like';

    likeBtn.onclick = () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Please log in first.");
        return;
      }

      fetch('https://kpugram-backend.onrender.com/api/likes/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: parseInt(postId), userId: parseInt(userId) })
      })
          .then(res => {
            if (!res.ok) throw new Error("Like failed");
            return res.text();
          })
          .then(() => alert("✅ Liked!"))
          .catch(err => alert("❌ Like error: " + err.message));
    };

    post.appendChild(likeBtn);

    // 💬 Comment input
    const commentInput = document.createElement('input');
    commentInput.className = 'comment-input';
    commentInput.placeholder = 'Add a comment...';

    const commentBtn = document.createElement('button');
    commentBtn.textContent = 'Post';
    commentBtn.className = 'comment-btn';

    commentBtn.onclick = () => {
      const comment = commentInput.value.trim();
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("Login required to comment.");
        return;
      }

      if (comment) {
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
            .then(() => {
              alert("💬 Comment added!");
              commentInput.value = '';
            })
            .catch(err => {
              alert("❌ Comment error: " + err.message);
            });
      }
    };

    const commentSection = document.createElement('div');
    commentSection.className = 'comments';

    post.appendChild(commentInput);
    post.appendChild(commentBtn);
    post.appendChild(commentSection);

    // 📥 Load existing comments
    fetch(`https://kpugram-backend.onrender.com/api/comments/post/${postId}`)
        .then(res => res.json())
        .then(comments => {
          comments.forEach(comment => {
            const p = document.createElement('p');
            p.textContent = `💬 ${comment.content}`;
            commentSection.appendChild(p);
          });
        })
        .catch(err => {
          console.error("Failed to load comments:", err);
          commentSection.innerHTML = "<p style='color: gray;'>Unable to load comments.</p>";
        });
  });
}
