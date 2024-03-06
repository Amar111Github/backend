
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = require('../dbConnection/dbconnect');

// Initialize auto-increment for CityID
autoIncrement.initialize(connection);

var salarySchema = new mongoose.Schema({
  BasicSalary: { type: String, required: true },
  BankName: { type: String, required: true },
  AccountNo: { type: String, required: true },
  AccountHolderName: { type: String, required: true },
  IFSCcode: { type: String, required: true },
  TaxDeduction: { type: String, required: true }
});

salarySchema.plugin(autoIncrement.plugin, {
  model: "Salary",
  field: "SalaryID"
});

var Salary = mongoose.model("Salary", salarySchema);

  module.exports = {
    Salary
  }