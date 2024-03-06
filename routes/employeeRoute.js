const express = require("express");
const employeeRoute = express.Router();

const {
  verifyAdminHR,
  verifyEmployee
} = require("../middleware/authMiddleware");

const {
  getAllEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employeeController");
const { fileUploadMiddleware, checkFileSize } = require("../middleware/multer");

// GET: Retrieve all countries
employeeRoute.get("/employee/", verifyAdminHR, getAllEmployee);
employeeRoute.get("/employee/:id", verifyEmployee, getAllEmployee);

// POST: Create a new employee
// verifyAdminHR
employeeRoute.post(
  "/employee",
  verifyAdminHR,
  fileUploadMiddleware,
  checkFileSize,
  createEmployee
);

// PUT: Update an existing employee
employeeRoute.put(
  "/employee/:id",
  verifyAdminHR,
  fileUploadMiddleware,
  checkFileSize,
  updateEmployee
);

// DELETE: Delete a employee
// employeeRoute.delete("/employee/:id", verifyAdminHR, deleteEmployee);

module.exports = employeeRoute;
