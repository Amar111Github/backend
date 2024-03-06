const express = require("express");
const cityRoute = express.Router();

// const cityController = require('../controllers/cityController');
const { verifyAdminHR } = require("../middleware/authMiddleware");
const {
  getAllcity,
  createCity,
  updateCity,
  deleteCity
} = require("../controllers/cityController");

// GET: Retrieve all countries
// verifyAdminHR
cityRoute.get("/city", verifyAdminHR, getAllcity);

// POST: Create a new city
cityRoute.post("/city", verifyAdminHR, createCity);

// PUT: Update an existing city
cityRoute.put("/city/:id", verifyAdminHR, updateCity);

// DELETE: Delete a city
cityRoute.delete("/city/:id", verifyAdminHR, deleteCity);

module.exports = cityRoute;
