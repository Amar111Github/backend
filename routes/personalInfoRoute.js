
const express = require('express');
const personalInfoRoute = express.Router();

const { verifyEmployee, verifyHREmployee} = require('../middleware/authMiddleware');

const { personalInfo, updatepersonalInfo } = require('../controllers/personalInfoController');

// GET: Retrieve all personalInfo
personalInfoRoute.get("/personal-info/:id", verifyHREmployee,  personalInfo);


// PUT: Update an existing personalInfo
personalInfoRoute.put("/personal-info/:id", verifyEmployee,  updatepersonalInfo);


module.exports = personalInfoRoute;