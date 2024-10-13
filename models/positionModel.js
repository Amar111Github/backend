const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
  PositionName: { type: String, required: true },
  company: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }]
});

// Initialize auto-increment for CityID
// autoIncrement.initialize(connection);

// positionSchema.plugin(autoIncrement.plugin, {
//   model: "Position",
//   field: "PositionID",
// });

var Position = mongoose.model("Position", positionSchema);

// Export the City model
module.exports = { Position };
