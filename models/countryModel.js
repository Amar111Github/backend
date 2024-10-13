const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  CountryName: { type: String, required: true },
  CountryID: { type: Number, unique: true },
  states: [{ type: mongoose.Schema.Types.ObjectId, ref: "State" }]
});

const Country = mongoose.model("Country", countrySchema);
module.exports = Country;
