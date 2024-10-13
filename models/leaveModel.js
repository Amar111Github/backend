const mongoose = require("mongoose");

var leaveApplicationSchema = new mongoose.Schema({
  Leavetype: { type: String, required: true },
  FromDate: { type: Date, required: true },
  ToDate: { type: Date },
  Reasonforleave: { type: String, required: true },
  Status: { type: String, required: true },
  updatedBy: { type: String },
  createdOn: { type: Date, default: Date.now },
  reasonOfRejection: { type: String },
  aditionalManager:{type:String},
  leaveDuration:{type:String},
  employee: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }]
});


var LeaveApplication = mongoose.model(
  "LeaveApplication",
  leaveApplicationSchema
);

module.exports = {
  LeaveApplication
};
