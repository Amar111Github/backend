const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const connection = require("../dbConnection/dbconnect");

const employeeSchema = new mongoose.Schema({
  FirstName: { type: String, required: true },
  MiddleName: { type: String },
  LastName: { type: String },
  empID: { type: String, required: true, unmodifiable: true },
  Email: { type: String, required: true, unmodifiable: true },
  Password: { type: String, required: true },
  Gender: { type: String, required: true },
  DOB: { type: Date },
  DateOfJoining: { type: Date },
  TerminateDate: { type: Date },
  Deleted: { type: Boolean },
  profile: { type: {} },
  ContactNo: { type: String },
  // EmployeeCode: { type: String, required: true },
  Account: { type: Number },
  role: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
  position: [{ type: mongoose.Schema.Types.ObjectId, ref: "Position" }],
  department: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department" }],
  salary: [{ type: mongoose.Schema.Types.ObjectId, ref: "Salary" }],
  education: [{ type: mongoose.Schema.Types.ObjectId, ref: "Education" }],
  familyInfo: [{ type: mongoose.Schema.Types.ObjectId, ref: "FamilyInfo" }],
  workExperience: [
    { type: mongoose.Schema.Types.ObjectId, ref: "WorkExperience" }
  ],
  leaveApplication: [
    { type: mongoose.Schema.Types.ObjectId, ref: "LeaveApplication" }
  ],
  attendanceObjID: { type: mongoose.Schema.Types.ObjectId, ref: "Attendance" },

  BloodGroup: { type: String },
  EmergencyContactNo: { type: String },
  Hobbies: { type: String },
  PANcardNo: { type: String },
  PermanetAddress: { type: String },
  PresentAddress: { type: String }
});

autoIncrement.initialize(connection);

employeeSchema.plugin(autoIncrement.plugin, {
  model: "Employee",
  field: "EmployeeID"
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = { Employee };
