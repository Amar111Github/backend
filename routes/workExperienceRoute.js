







const express = require('express');
const workExperienceRoute = express.Router();

const { verifyHREmployee, verifyEmployee} = require('../middleware/authMiddleware');

const { getAllWorkExperience, createWorkExperience, updateWorkExperience, deleteWorkExperience } = require('../controllers/workExperienceController');

// GET: Retrieve all countries
workExperienceRoute.get("/work-experience/:id",  getAllWorkExperience);

// POST: Create a new city
workExperienceRoute.post("/work-experience/:id", verifyEmployee,  createWorkExperience);

// PUT: Update an existing work
workExperienceRoute.put("/work-experience/:id", verifyEmployee,  updateWorkExperience);

// DELETE: Delete a work
workExperienceRoute.delete("/work-experience/:id", verifyEmployee,  deleteWorkExperience);

module.exports = workExperienceRoute;