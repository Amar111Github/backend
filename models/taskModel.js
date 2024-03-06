const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const connection = require("../dbConnection/dbconnect");

const taskSchema = new mongoose.Schema({
  pdf: String,
  Taskname: String,
  description: String,
  startDate: String,
  endDate: String,
  managerEmail: String,
  status: String,
  duration: Number,
  department: String,
  comment: String,
  employees: [
    {
      empname: String,
      empemail: {
        type: String
      },
      empdesignation: String,
      emptaskStatus: String,
      empTaskComment: String
    }
  ]
});

autoIncrement.initialize(connection);

taskSchema.plugin(autoIncrement.plugin, {
  model: "Task",
  field: "TaskID"
});

const Task = mongoose.model("Task", taskSchema);

module.exports = { Task };
