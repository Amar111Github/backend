const express = require("express");
const educationRoute = express.Router();

const {
  getAllEducation,
  createEducation,
  updateEducation,
  deleteEducation
} = require("../controllers/educationController");

const {
  verifyHREmployee,
  verifyEmployee
} = require("../middleware/authMiddleware");
// GET: Retrieve all countries

educationRoute.get("/education/:id", verifyHREmployee, getAllEducation);

// POST: Create a new city
educationRoute.post("/education/:id", verifyEmployee, createEducation);

// PUT: Update an existing education
educationRoute.put("/education/:id", verifyEmployee, updateEducation);

// DELETE: Delete a education
educationRoute.delete("/education/:id/:id2", verifyEmployee, deleteEducation);

module.exports = educationRoute;
