const express = require("express");
const employeeRoute = express.Router();
const {
  getAllEmployee,
  createEmployee,
  updateEmployee,
  findParticularEmployee,
  selectedDeleteNotification,
  deleteNotification,
  notificationStatusUpdate,
  multiSelectedDeleteNotification,
  employeeLoginStatusUpdate,
  getAllEmployeeByStatus,
  employeeLogoutStatusUpdate,EmployeeTeam,employeeByDepartment,
  deleteEmployee,verifyAccount,userData,
  getEmployeeByStatus,
} = require("../controllers/employeeController");
const { fileUploadMiddleware, checkFileSize } = require("../middleware/multer");
const {verifyAdminHRManager,verifyAdminHR ,verifyAll} = require('../middleware/rbacMiddleware');
// GET: Retrieve all countries
employeeRoute.get("/employee/",getAllEmployee);
employeeRoute.post("/verifyAccount",verifyAccount);
employeeRoute.get("/employee/:id?",getAllEmployee);
employeeRoute.get("/particularEmployee/:id",findParticularEmployee);
employeeRoute.get("/userData/:id",userData);
employeeRoute.post("/notificationStatusUpdate/:id", notificationStatusUpdate);
employeeRoute.post("/managersList",getEmployeeByStatus);
employeeRoute.post("/managersMailsList", getAllEmployeeByStatus);
employeeRoute.post("/employeeTeam",EmployeeTeam)
employeeRoute.get("/employeeByDepartment",employeeByDepartment)

employeeRoute.post("/notificationDeleteHandler/:id",deleteNotification);
employeeRoute.patch("/employeeLoginStatusUpdate", employeeLoginStatusUpdate);
employeeRoute.patch("/employeeLogoutStatusUpdate",employeeLogoutStatusUpdate);
employeeRoute.post("/multiSelectedNotificationDelete",multiSelectedDeleteNotification );
employeeRoute.post("/selectedNotificationDelete", selectedDeleteNotification);


employeeRoute.post(
  "/employee",
  fileUploadMiddleware,
  checkFileSize,
  createEmployee
);

// PUT: Update an existing employee
employeeRoute.put(
  "/employee/:id",
  // verifyAdminHR,
  fileUploadMiddleware,
  checkFileSize,
  updateEmployee
);

module.exports = employeeRoute;
