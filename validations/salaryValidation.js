
const Joi = require('joi');

const SalaryValidation = Joi.object().keys({
  BasicSalary: Joi.number().required(),
  BankName: Joi.string().required(),
  AccountNo: Joi.string().required(),
  AccountHolderName: Joi.string().required(),
  IFSCcode: Joi.string().required(),
  TaxDeduction: Joi.number().required(),
  HRASalary: Joi.number().required(), // Ensure HRASalary is included and correctly typed
  PFDeduct: Joi.number().required(),
  LeaveDeduct: Joi.number().required(),
  MAllowance: Joi.number().required(),
  SpecialAllowance: Joi.number().required(),
  otherAllowance: Joi.number().required(),
  totalSalary: Joi.number().required()
  });

  module.exports = {
    SalaryValidation
  }