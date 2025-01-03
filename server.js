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

// Database configuration
const dbConfig = require("./config/dbConfig");
app.use(helmet());
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');  // Don't cache anything
  res.setHeader('Pragma', 'no-cache');         // Older HTTP 1.0 header
  res.setHeader('Expires', '0');               // Expire immediately
  next();
});


// new controller based
const userRoutes = require("./routes/userRoutes");
const examRoutes = require("./routes/examRoutes");
const questionRoutes = require("./routes/questionRoutes");
const reportRoutes = require("./routes/reportRoutes");
const Recording = require("./models/recordingModel");
const User = require("./models/userModel");
const Exam = require("./models/examModel");


app.use(cors({
  origin: ["http://localhost:3000"], 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

// Serve static files from React build


// new routes 
app.use("/api/users", userRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/question-sets", questionRoutes);
app.use("/api/reports", reportRoutes);

const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

// Fallback route to serve index.html for any random GET request
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});



const port = process.env.PORT || 5000;


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
