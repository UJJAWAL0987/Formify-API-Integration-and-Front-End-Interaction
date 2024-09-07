// Function to check password strength dynamically
function checkPasswordStrength(password) {
  let strength = 0;
  const strengthDisplay = document.getElementById("passwordStrength");

  if (password.length >= 8) strength++; // Length check
  if (/[A-Z]/.test(password)) strength++; // Uppercase letter
  if (/[a-z]/.test(password)) strength++; // Lowercase letter
  if (/[0-9]/.test(password)) strength++; // Number
  if (/[\W]/.test(password)) strength++; // Special character

  // Display feedback based on strength score
  if (strength <= 2) {
    strengthDisplay.textContent = "Weak password";
    strengthDisplay.style.color = "red";
  } else if (strength <= 4) {
    strengthDisplay.textContent = "Moderate password";
    strengthDisplay.style.color = "orange";
  } else {
    strengthDisplay.textContent = "Strong password";
    strengthDisplay.style.color = "green";
  }
}

// Attach real-time password strength validation
document.getElementById("password").addEventListener("input", (event) => {
  checkPasswordStrength(event.target.value);
});

// Client-side form validation
// Handle form submission
async function handleSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const age = document.getElementById("age").value;

  const errors = validateForm(name, email, password, age);

  if (errors.length === 0) {
    // Clear the form if no errors
    const data = { name, email, password, age };

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

       console.log("Response status:", response.status);
       console.log("Response headers:", response.headers);
       
      const result = await response.json();

      // Check if the response has a 'message' field
      if (result.message) {
        alert(result.message);
      } 
      else {
        alert("Unexpected response from server");
      }
      

      // Reset the form and fetch updated submissions
      document.getElementById("mainForm").reset();
      fetchSubmissions();
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("An error occurred while submitting the form");
    }
  } else {
    alert(errors.join("\n"));
  }
}

// Edit submission function
async function editSubmission(id) {
  const name = prompt('Enter new name:');
  const email = prompt('Enter new email:');
  const password = prompt('Enter new password:');
  const age = prompt('Enter new age:');
  
  const data = { name, email, password, age };

  try {
    const response = await fetch(`/api/submissions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    // Check if the response has a 'message' field
    if (result.message) {
      alert(result.message);
    } else {
      alert("Unexpected response from server");
    }

    // Fetch updated submissions
    fetchSubmissions();
  } catch (error) {
    console.error('Error updating submission:', error);
    alert("An error occurred while updating the submission");
  }
}

// Delete submission function
async function deleteSubmission(id) {
  if (confirm('Are you sure you want to delete this submission?')) {
    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      // Check if the response has a 'message' field
      if (result.message) {
        alert(result.message);
      } else {
        alert("Unexpected response from server");
      }

      // Fetch updated submissions
      fetchSubmissions();
    } catch (error) {
      console.error('Error deleting submission:', error);
      alert("An error occurred while deleting the submission");
    }
  }
}

// Form validation logic
function validateForm(name, email, password, age) {
  const errors = [];

  if (name.length < 3) {
    errors.push("Name must be at least 3 characters long.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push("Please enter a valid email.");
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  if (isNaN(age) || age <= 0) {
    errors.push("Please enter a valid age.");
  }

  return errors;
}

// Client-side routing to switch between sections
function routeToSection(sectionId) {
  const sections = ["formSection", "submissionsSection", "footer"];

  sections.forEach((id) => {
    const section = document.getElementById(id);
    section.style.display = id === sectionId ? "block" : "none";
  });
}

// Add event listeners to nav links for client-side routing
document.querySelector(".navbar-nav").addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    event.preventDefault();
    const target = event.target.getAttribute("href").substring(1); // Get section ID
    routeToSection(target);
  }
});

// Fetch and display submissions from the API
async function fetchSubmissions() {
  const response = await fetch("/api/submissions");
  const submissions = await response.json();
  const submissionsList = document.getElementById("submissionsList");
  submissionsList.innerHTML = "";

  submissions.forEach((sub) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.textContent = `${sub.name} - ${sub.email} (Age: ${sub.age})`;
    submissionsList.appendChild(li);
  });
}

// Fetch submissions on page load
window.onload = () => {
  fetchSubmissions();
  routeToSection("formSection"); // Start with form section
};
