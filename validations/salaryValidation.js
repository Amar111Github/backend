
const Joi = require('joi');

const SalaryValidation = Joi.object().keys({
    BasicSalary: Joi.string().max(20).required(),
    BankName: Joi.string().max(200).required(),
    AccountNo: Joi.string().max(200).required(),
    AccountHolderName: Joi.string().max(200).required(),
    IFSCcode: Joi.string().max(200).required(),
    TaxDeduction: Joi.string().max(100).required()
  });

  module.exports = {
    SalaryValidation
  }