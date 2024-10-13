const express = require("express");
const {
  createAttendance,
  createHolidays,
  findAttendance,
  findEmployeeAttendanceEployeeId,
  findEmployeeAttendanceId,
  findAllHolidays,
  todaysAttendance,
  attendanceRegister,updateAttendance,
  getEmployeeTodayAttendance // Add this function to your controller
} = require("../controllers/AttendanceController");
const {verifyAdminHRManager,verifyAdminHR,verifyAll, verifyAdmin, verifyHR, verifyEmployee} = require('../middleware/rbacMiddleware');

const attendanceRoute = express.Router();

// Create a Attendance Route

attendanceRoute.post("/attendance/:attendanceId",verifyAll ,createAttendance);
attendanceRoute.post("/updateAttendance",verifyAdminHR,updateAttendance);
attendanceRoute.get("/attendance",verifyAll,findAttendance);
attendanceRoute.get( "/attendances/:employeeId", findEmployeeAttendanceEployeeId);
attendanceRoute.get("/attendance/:id",verifyAll,findEmployeeAttendanceId);  ////manager also view self attendence and all employee attendence 
attendanceRoute.get("/attendance-register/:year/:month", attendanceRegister); /// not working
attendanceRoute.get("/todays-attendance", verifyAdminHRManager,todaysAttendance); // today attendence for all user
// Route to fetch today's attendance for a particular employee
attendanceRoute.get( "/employee/:employeeId/today-attendance",verifyAll, getEmployeeTodayAttendance);

// holiday route
attendanceRoute.get("/holidays",findAllHolidays);
attendanceRoute.post("/Create-holiday", createHolidays);

 
 

module.exports = {
  attendanceRoute
};
