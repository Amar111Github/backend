const express = require("express");
const {
  createAttendance,
  createHolidays,
  findAttendance,
  findEmployeeAttendanceEployeeId,
  findEmployeeAttendanceId,
  findAllHolidays,
  todaysAttendance,
  attendanceRegister
} = require("../controllers/AttendanceController");

const attendanceRoute = express.Router();

// Create a Attendance Route

attendanceRoute.post("/attendance/:attendanceId", createAttendance);
attendanceRoute.post("/Create-holiday", createHolidays);
attendanceRoute.post("/attendance", findAttendance);
attendanceRoute.post(
  "/attendance/:employeeId",
  findEmployeeAttendanceEployeeId
);
attendanceRoute.get("/attendance/:id", findEmployeeAttendanceId);
attendanceRoute.get("/holidays", findAllHolidays);

attendanceRoute.get("/attendance-register/:year/:month", attendanceRegister);
attendanceRoute.get("/todays-attendance", todaysAttendance);

module.exports = {
  attendanceRoute
};
