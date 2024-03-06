const express = require("express");
const leaveRoute = express.Router();

const {
  verifyHR,
  verifyEmployee,
  verifyAdminHR,
  verifyHREmployee,
  verifyAdminHREmployee
} = require("../middleware/authMiddleware");
const {
  getAllLeaveApplication,
  createLeaveApplication,
  updateLeaveApplication,
  deleteLeaveApplication,
  updateLeaveApplicationHr,
  getAllLeaveApplicationHr,
  deleteLeaveApplicationHr
} = require("../controllers/leaveController");

// GET: Retrieve all leave
leaveRoute.get(
  "/leave-application-emp/:id?",
  verifyAdminHREmployee,
  getAllLeaveApplication
);
leaveRoute.get(
  "/leave-application-hr",
  verifyAdminHR,
  getAllLeaveApplicationHr
);

// POST: Create a new leave
leaveRoute.post(
  "/leave-application-emp/:id?",
  verifyHREmployee,
  createLeaveApplication
);

// PUT: Update an existing leave
leaveRoute.put(
  "/leave-application-emp/:id?",
  verifyHREmployee,
  updateLeaveApplication
);
leaveRoute.put(
  "/leave-application-hr/:id",
  verifyAdminHR,
  updateLeaveApplicationHr
);

// DELETE: Delete a leave
leaveRoute.delete(
  "/leave-application-emp/:id/:id2",
  verifyEmployee,
  deleteLeaveApplication
);
leaveRoute.delete(
  "/leave-application-hr/:id/:id2",
  verifyAdminHR,
  deleteLeaveApplicationHr
);

module.exports = leaveRoute;
