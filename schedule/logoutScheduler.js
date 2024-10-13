const schedule = require('node-schedule');
const { AttendanceModel } = require('../models/attendanceModel');

// Scheduler to logout employees at 7 PM every day
const logoutScheduler = () => {
  // Define the rule for scheduling (7 PM every day)
  const rule = new schedule.RecurrenceRule();
  rule.hour = 19;
  rule.minute = 0;
  rule.second = 0;

  // Schedule the job
  schedule.scheduleJob(rule, async () => {
    try {
      // Find all employees whose status is "Login" or "Break"
      const employeesToLogout = await AttendanceModel.find({
        status: { $in: ['Login', 'Break'] }
      });

      // Logout all found employees
      for (const employee of employeesToLogout) {
        // Update the status to "Logout"
        employee.status = 'Logout';
        await employee.save();
      }

     
    } catch (error) {
      console.error('Error logging out employees:', error);
    }
  });
};

module.exports = {
  logoutScheduler
};
