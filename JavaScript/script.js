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

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const form = e.target;
            const name = form.name.value.trim();
            const password = form.password.value;
            const email = form.email.value.trim();
            const bio = form.bio.value.trim();
            const profilePic = document.getElementById("profilePicUpload").files[0];

            const formData = new FormData();
            formData.append("name", name);
            formData.append("password", password);
            formData.append("email", email);
            formData.append("bio", bio);
            if (profilePic) {
                formData.append("profilePicture", profilePic);
            }

            try {
                const response = await fetch(`${BASE_URL}/users/register`, {
                    method: "POST",
                    body: formData
                });

                if (response.ok) {
                    alert("🎉 Account registered! You can now log in.");
                    window.location.href = "login.html";
                } else {
                    const error = await response.text();
                    alert("Signup failed: " + error);
                }
            } catch (err) {
                console.error("Signup error:", err);
                alert("❌ Something went wrong during registration.");
            }
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const email = loginForm.email.value.trim();
            const password = loginForm.password.value;

            if (!email || !password) {
                alert("Please enter both email and password.");
                return;
            }

            const data = { email, password };

            try {
                const response = await fetch(`${BASE_URL}/users/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    const user = await response.json();
                    localStorage.setItem("userId", user.id);
                    localStorage.setItem("username", user.name);
                    localStorage.setItem("isAdmin", user.admin);

                    alert("✅ Logged in!");
                    window.location.href = "Home.html";
                } else {
                    const error = await response.text();
                    alert("Login failed: " + error);
                }
            } catch (err) {
                console.error("Login error:", err);
                alert("❌ Something went wrong while logging in.");
            }
        });
    }
});



function goToSignup() {
    window.location.href = "signup.html";
}

function goToLogin() {
    window.location.href = "login.html";
}

