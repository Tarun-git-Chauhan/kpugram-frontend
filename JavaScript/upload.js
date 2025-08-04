/**
 * Handles the creation and submission of a regular post with optional caption and image.
 * Requires either a caption or an image to proceed.
 * Submits data using a multipart/form-data POST request to the backend.
 */
function sharePost() {
  const caption = document.getElementById("captionInput").value.trim();
  const imageFile = document.getElementById("imageUpload").files[0];
  const userId = localStorage.getItem("userId");

  // Ensure that at least one input is provided (caption or image)
  if (!caption && !imageFile) {
    alert("Please write a caption or upload an image.");
    return;
  }

  // Prepare the form data for multipart request (handled by Spring Boot backend)
  const formData = new FormData();
  formData.append("userId", userId);        // User ID from localStorage
  formData.append("content", caption);      // Caption text
  formData.append("file", imageFile);       // Optional image file
  formData.append("anonymous", "false");    // Regular post, not anonymous

  // Send POST request to backend to create the post
  fetch("http://localhost:8080/api/posts/create", {
    method: "POST",
    body: formData
  })
      .then(response => {
        if (!response.ok) {
          throw new Error("Post upload failed.");
        }
        return response.text(); // Expecting a plain success message
      })
      .then(data => {
        alert("Post uploaded successfully.");
        // Clear form fields and redirect to the Home/feed page
        document.getElementById("captionInput").value = "";
        document.getElementById("imageUpload").value = "";
        window.location.href = "../Home.html";
      })
      .catch(error => {
        console.error("Upload Error:", error);
        alert("Error uploading post: " + error.message);
      });
}
