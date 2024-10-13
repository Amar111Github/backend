const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  DepartmentName: { type: String, required: true },
  company: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }]
});

// autoIncrement.initialize(connection);

// departmentSchema.plugin(autoIncrement.plugin, {
//   model: "Department",
//   field: "DepartmentID"
// });

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
