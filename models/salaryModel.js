
const mongoose = require("mongoose");

// Define the schema with number types
var salarySchema = new mongoose.Schema({
  BasicSalary: { type: Number, required: true },
  BankName: { type: String, required: true },
  AccountNo: { type: String, required: true },
  AccountHolderName: { type: String, required: true },
  IFSCcode: { type: String, required: true },
  TaxDeduction: { type: Number, required: true },
  HRASalary: { type: Number, required: true },
  PFDeduct: { type: Number, required: true },
  LeaveDeduct: { type: Number, required: true },
  MAllowance: { type: Number, required: true },
  SpecialAllowance: { type: Number, required: true },
  otherAllowance: { type: Number, required: true },
  totalSalary: { type: Number, required: true }
});

var Salary = mongoose.model("Salary", salarySchema);

module.exports = {
  Salary
};