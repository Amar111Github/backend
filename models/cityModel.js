const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = require('../dbConnection/dbconnect');

const citySchema = new mongoose.Schema({
  CityName: { type: String, required: true },
  state: [{ type: mongoose.Schema.Types.ObjectId, ref: "State" }]
});

// Initialize auto-increment for CityID
autoIncrement.initialize(connection);

citySchema.plugin(autoIncrement.plugin, {
  model: "City",
  field: "CityID"
});

// Create the City model
const City = mongoose.model("City", citySchema);

// Export the City model
module.exports = City;