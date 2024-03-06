
const express = require('express');
const stateRoute = express.Router();

// const stateController = require('../controllers/stateController');
const {verifyAdminHR} = require('../middleware/authMiddleware');
const { getAllStates, createState, updateState, deleteState } = require('../controllers/stateControler');

// GET: Retrieve all countries
// verifyAdminHR
stateRoute.get("/state/:id?", verifyAdminHR, getAllStates);

// POST: Create a new state
stateRoute.post("/state", verifyAdminHR, createState);

// PUT: Update an existing state
stateRoute.put("/state/:id", verifyAdminHR, updateState);

// DELETE: Delete a state
stateRoute.delete("/state/:id", verifyAdminHR, deleteState);

module.exports = stateRoute;