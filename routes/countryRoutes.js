const express = require('express');
const contery = express.Router();
// const countryController = require('../controllers/countryController');
const {verifyAdminHR} = require('../middleware/authMiddleware');
const { getAllCountries, createCountry, updateCountry, deleteCountry } = require('../controllers/countryController');
// GET: Retrieve all countries
// verifyAdminHR
contery.get("/country", verifyAdminHR, getAllCountries);

// POST: Create a new country
contery.post("/country", verifyAdminHR, createCountry);

// PUT: Update an existing country
contery.put("/country/:id", verifyAdminHR, updateCountry);

// DELETE: Delete a country
contery.delete("/country/:id", verifyAdminHR, deleteCountry);

module.exports = contery;