const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  pdf: String,
  Taskname: String,
  Priority: String,
  description: String,
  startDate: String,
  endDate: String,
  status: String,
  duration: Number,
  department: String,
  comment: String,
  managerEmail: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  adminMail: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  employees: [ {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    empTaskStatus: { type: String, required: true }, // You can adjust validation as needed
    empTaskComment: { type: String }
  }],

  
}, { timestamps: true });  // Corrected line

// autoIncrement.initialize(connection);

// taskSchema.plugin(autoIncrement.plugin, {
//   model: "Task",
//   field: "TaskID"
// });

const Task = mongoose.model("Task", taskSchema);

module.exports = { Task };