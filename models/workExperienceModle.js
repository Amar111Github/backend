


const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = require('../dbConnection/dbconnect');

autoIncrement.initialize(connection);

const workExperienceSchema = new mongoose.Schema({
    CompanyName: { type: String, required: true },
    Designation: { type: String, required: true },
    FromDate: { type: Date, required: true },
    ToDate: { type: Date, required: true }
  });
  
  workExperienceSchema.plugin(autoIncrement.plugin, {
    model: "WorkExperience",
    field: "WorkExperienceID"
  });
// Create the City model
const WorkExperience = mongoose.model("WorkExperience", workExperienceSchema);

// Export the City model
module.exports = WorkExperience;