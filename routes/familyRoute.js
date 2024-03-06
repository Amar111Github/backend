



const express = require('express');
const familyRoute = express.Router();

const {verifyHREmployee, verifyEmployee} = require('../middleware/authMiddleware');

const { getAllFamily, createFamily, updateFamily, deleteFamily } = require('../controllers/familyController');

// GET: Retrieve all countries
familyRoute.get("/family-info/:id", verifyHREmployee,  getAllFamily);

// POST: Create a new family
familyRoute.post("/family-info/:id", verifyEmployee,  createFamily);

// PUT: Update an existing family
familyRoute.put("/family-info/:id", verifyEmployee,  updateFamily);

// DELETE: Delete a family
familyRoute.delete("family-info/:id", verifyEmployee,  deleteFamily);

module.exports = familyRoute;