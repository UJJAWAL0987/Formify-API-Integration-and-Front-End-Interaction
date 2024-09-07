const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Temporary in-memory storage for submissions
let submissions = [];
let nextId = 1; // Unique ID for each submission

// Middleware
app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files from 'public'

// Set up the view engine
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("form");
});

// RESTful API Endpoints for CRUD Operations

// GET all submissions
app.get("/api/submissions", (req, res) => {
  res.json(submissions);
});

// POST a new submission
app.post("/api/submissions", (req, res) => {
  const { name, email, password, age } = req.body;

  // Server-side validation
  if (!name || !email || !password || !age) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Add a new submission to in-memory storage
  const newSubmission = { id: nextId++, name, email, password, age };
  submissions.push(newSubmission);

  res.json({
    message: "Submission added successfully!",
    submission: newSubmission,
  });
});

// PUT (Update) a submission by ID
app.put("/api/submissions/:id", (req, res) => {
  const submissionId = parseInt(req.params.id, 10);
  const { name, email, password, age } = req.body;

  // Find the submission to update
  const submission = submissions.find((sub) => sub.id === submissionId);

  if (!submission) {
    return res.status(404).json({ error: "Submission not found" });
  }

  // Update the submission
  if (name) submission.name = name;
  if (email) submission.email = email;
  if (password) submission.password = password;
  if (age) submission.age = age;

  res.json({ message: "Submission updated successfully!", submission });
});

// DELETE a submission by ID
app.delete("/api/submissions/:id", (req, res) => {
  const submissionId = parseInt(req.params.id, 10);
  const index = submissions.findIndex((sub) => sub.id === submissionId);

  if (index === -1) {
    return res.status(404).json({ error: "Submission not found" });
  }

  // Remove the submission from the array
  submissions.splice(index, 1);

  res.json({ message: "Submission deleted successfully!" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
