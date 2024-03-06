const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = require('../dbConnection/dbconnect');

// Initialize auto-increment for CityID
autoIncrement.initialize(connection);

const educationSchema = new mongoose.Schema({
    SchoolUniversity: { type: String, required: true },
    Degree: { type: String, required: true },
    Grade: { type: String, required: true },
    PassingOfYear: { type: String, required: true }
  });

  educationSchema.plugin(autoIncrement.plugin, {
    model: "Education",
    field: "EducationID"
  });
  
  const Education = mongoose.model("Education", educationSchema);

  module.exports = {
    Education
  }