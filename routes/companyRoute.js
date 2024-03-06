const express = require('express');
const companyRoute = express.Router();

// const companyController = require('../controllers/companyController');
const {verifyHR, verifyAdminHR} = require('../middleware/authMiddleware');


const { getAllCompanyDetails, createCompany, updateCompanyDtails } = require('../controllers/compnayController');

// verifyHR
// GET: Retrieve all company
companyRoute.get("/company", verifyAdminHR, getAllCompanyDetails);

// POST: Create a new company
companyRoute.post("/company", verifyHR, createCompany);

// PUT: Update an existing company
companyRoute.put("/company/:id", verifyHR, updateCompanyDtails);


module.exports = companyRoute;