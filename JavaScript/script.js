// ✅ script.js – Updated to store isAdmin flag and document everything clearly

// Function to navigate to the signup page
function goToSignup() {
    window.location.href = "../HTML/signup.html";
}

// Function to navigate to the login page
function goToLogin() {
    window.location.href = "../HTML/login.html";
}

// Wait until the page content is fully loaded before running this code
document.addEventListener("DOMContentLoaded", () => {
    // Get the login form element by its ID
    const loginForm = document.getElementById("loginForm");
    // Get the signup form element by its ID
    const signupForm = document.getElementById("signupForm");

    // ✅ Login Form Submission Logic
    if (loginForm) {
        // Add event listener for when the login form is submitted
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Prevent the default form submit behavior (page refresh)

            // Collect the entered email and password from the form
            const formData = new FormData(loginForm);
            const email = formData.get("email");
            const password = formData.get("password");

            try {
                // Send login info to backend API to check credentials
                const res = await fetch("http://localhost:8080/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                // If login fails, throw an error to jump to catch block
                if (!res.ok) throw new Error("Login failed");

                // Parse response JSON data
                const data = await res.json();

                // ✅ Save user data in localStorage for other pages to use
                localStorage.setItem("userId", data.id);
                localStorage.setItem("username", data.name);
                localStorage.setItem("profilePicture", data.profilePicture || "https://via.placeholder.com/150");
                localStorage.setItem("loginStreak", data.loginCount?.toString() || "0");
                localStorage.setItem("isAdmin", data.admin); // Store admin status

                alert("✅ Logged in successfully!");

                // ⛳ Redirect admin users to admin dashboard, others to homepage after 1 second
                setTimeout(() => {
                    if (data.admin) {
                        window.location.href = "../HTML/admin.html";
                    } else {
                        window.location.href = "../HTML/Home.html";
                    }
                }, 1000);

            } catch (err) {
                // Show error alert if login failed
                alert("❌ Invalid credentials");
                console.error(err);
            }
        });
    }

    // ✅ Signup Form Submission Logic
    if (signupForm) {
        // Add event listener for when the signup form is submitted
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Prevent page reload

            // Collect all signup data from the form
            const formData = new FormData(signupForm);
            const body = {
                name: formData.get("name"),
                password: formData.get("password"),
                email: formData.get("email"),
                bio: formData.get("bio"),
                // Use uploaded profile picture or default image
                profilePicture: localStorage.getItem("profilePicture") || "http://localhost:8080/Images/blank.png"
            };

            try {
                // Send signup data to backend API to create new user
                const res = await fetch("http://localhost:8080/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                // If signup fails, read error message and throw
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error("Signup failed: " + errorText);
                }

                // Show success message and redirect to login page after 1 second
                alert("🎉 Account created! Please login.");
                setTimeout(() => (window.location.href = "../HTML/login.html"), 1000);

            } catch (err) {
                // Show error alert if signup failed
                alert("❌ Signup error :( " + err.message);
                console.error(err);
            }
        });

        // ✅ Profile Picture Upload Preview
        // Listen for when a file is selected for profile picture upload
        const fileInput = document.getElementById("profilePicUpload");
        if (fileInput) {
            fileInput.addEventListener("change", (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();

                // When file is read, show preview image and save in localStorage
                reader.onload = function (event) {
                    document.getElementById("profileImage").src = event.target.result;
                    localStorage.setItem("profilePicture", event.target.result);
                };

                // Start reading the file if a file was selected
                if (file) reader.readAsDataURL(file);
            });
        }
    }
});
