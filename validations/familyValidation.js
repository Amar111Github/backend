

const Joi = require('joi');

const FamilyInfoValidation = Joi.object().keys({
    Name: Joi.string().max(200).required(),
    Relationship: Joi.string().max(200).required(),
    DOB: Joi.date().required(),
    Occupation: Joi.string().max(100).required()
  });

  module.exports = {
    FamilyInfoValidation
  }