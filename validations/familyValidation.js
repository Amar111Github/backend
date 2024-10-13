

const Joi = require('joi');

const FamilyInfoValidation = Joi.object().keys({
    Name: Joi.string().max(200).required(),
    Relationship: Joi.string().max(200).required(),
    DOB: Joi.date().required(),
    Occupation: Joi.string(),
    parentMobile: Joi.string().max(10).required()
  });

  module.exports = {
    FamilyInfoValidation
  }