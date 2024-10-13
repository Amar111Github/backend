const mongoose = require("mongoose");

// autoIncrement.initialize(connection);

const familyInfoSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Relationship: { type: String, required: true },
  DOB: { type: Date, required: true },
  Occupation: { type: String, required: true },
  parentMobile: { type: String, required: true }
});

// familyInfoSchema.plugin(autoIncrement.plugin, {
//   model: "FamilyInfo",
//   field: "FamilyInfoID",
// });

const FamilyInfo = mongoose.model("FamilyInfo", familyInfoSchema);

module.exports = {
  FamilyInfo
};
