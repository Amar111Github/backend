const Joi = require('joi');

const CountryValidation = Joi.object().keys({
    _id: Joi.optional(),
    CountryID: Joi.optional(),
    CountryName: Joi.string().max(200).required()

});

module.exports = {
    CountryValidation,
};
