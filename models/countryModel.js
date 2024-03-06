const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = require('../dbConnection/dbconnect');

const countrySchema = new mongoose.Schema({
    CountryName: { type: String, required: true },
    CountryID: { type: Number, unique: true },
    states: [{ type: mongoose.Schema.Types.ObjectId, ref: "State" }]
});

autoIncrement.initialize(connection);
countrySchema.plugin(autoIncrement.plugin, {
    model: "Country",
    field: "CountryID"
});

const Country = mongoose.model("Country", countrySchema);
module.exports = Country;
