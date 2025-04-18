const express = require("express");
const app = express();
const cors = require('cors');
require("dotenv").config();
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const helmet = require('helmet');

// Middleware to parse JSON bodies
app.use(express.json());

// Security headers
app.use(helmet());

// Disable caching
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Database configuration
const dbConfig = require("./config/dbConfig");

// Models
const Recording = require("./models/recordingModel");
const User = require("./models/userModel");
const Exam = require("./models/examModel");

// CORS config
app.use(cors({
  origin: ["http://localhost:3000"], 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

// API routes
const userRoutes = require("./routes/userRoutes");
const examRoutes = require("./routes/examRoutes");
const questionRoutes = require("./routes/questionRoutes");
const reportRoutes = require("./routes/reportRoutes");

app.use("/api/users", userRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/question-sets", questionRoutes);
app.use("/api/reports", reportRoutes);

// ✅ Serve React build after API routes
const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

// ✅ Fallback route for React Router (must be after static)
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Server port
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

