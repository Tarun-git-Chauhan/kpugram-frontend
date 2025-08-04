// ✅ Base URL for Render
const BASE_URL = "https://kpugram-backend.onrender.com/api";

// ✅ Upload Post Function
async function uploadPost(isAnonymous = false) {
    const userId = localStorage.getItem("userId");
    const content = document.getElementById("postContent").value;
    const imageInput = document.getElementById("imageUpload");
    const file = imageInput.files[0];

    if (!content && !file) {
        alert("Post content or image is required.");
        return;
    }

    const formData = new FormData();
    formData.append("content", content);
    formData.append("anonymous", isAnonymous);
    if (file) {
        formData.append("image", file);
    }

    try {
        const response = await fetch(`${BASE_URL}/posts/create/${userId}`, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert("Post uploaded successfully!");
            window.location.href = isAnonymous
                ? "/HTML/confession.html"
                : "/HTML/Home.html";
        } else {
            const error = await response.text();
            alert("Upload failed: " + error);
        }
    } catch (error) {
        console.error("Error uploading post:", error);
        alert("Error uploading post.");
    }
}

// ✅ Event Listeners
document.addEventListener("DOMContentLoaded", function () {
    const normalPostBtn = document.getElementById("uploadPostBtn");
    const confessPostBtn = document.getElementById("uploadConfessBtn");

    if (normalPostBtn) {
        normalPostBtn.addEventListener("click", () => uploadPost(false));
    }

    if (confessPostBtn) {
        confessPostBtn.addEventListener("click", () => uploadPost(true));
    }
});
