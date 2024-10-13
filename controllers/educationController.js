// const Joi = require('joi');
// const { EducationValidation } = require('../validations/educationValidation');
// const { Education } = require('../models/educationModel');
// const { Employee } = require('../models/employeeModel');

// const getAllEducation = async (req, res, next) => {
//   try {
//       const employee = await Employee.findById(req.params.id)
//           .populate({
//               path: "education"
//           })
//           .select("FirstName LastName MiddleName")
//           .exec();

//       if (!employee) {
//           return res.status(404).json({ message: "Employee not found" });
//       }

//       res.status(200).json(employee);
//   } catch (err) {
//       console.error('Error retrieving education details:', err.message);
//       next(err); // Pass error to error handling middleware
//   }
// };

// // POST: Create a new education entry for an employee
// const createEducation = async (req, res, next) => {
//   try {
//       const { error } = EducationValidation.validate(req.body);
//       if (error) {
//           return res.status(400).json({ message: error.details[0].message });
//       }

//       const employee = await Employee.findById(req.params.id);
//       if (!employee) {
//           return res.status(404).json({ message: "Employee not found" });
//       }

//       const newEducation = new Education({
//           SchoolUniversity: req.body.SchoolUniversity,
//           Degree: req.body.Degree,
//           Grade: req.body.Grade,
//           PassingOfYear: req.body.PassingOfYear
//       });

//       const education = await Education.create(newEducation);

//       employee.education.push(education);
//       await employee.save();

//       res.status(201).json({
//           message: "Education added successfully",
//           education: education
//       });
//       console.log("New education saved:", education);
//   } catch (err) {
//       console.error('Error creating education:', err.message);
//       next(err); // Pass error to error handling middleware
//   }
// };

// // PUT: Update an existing education entry
// const updateEducation = async (req, res, next) => {
//   try {
//       const { error } = EducationValidation.validate(req.body);
//       if (error) {
//           return res.status(400).json({ message: error.details[0].message });
//       }

//       const updatedEducation = {
//           SchoolUniversity: req.body.SchoolUniversity,
//           Degree: req.body.Degree,
//           Grade: req.body.Grade,
//           PassingOfYear: req.body.PassingOfYear
//       };

//       const education = await Education.findByIdAndUpdate(req.params.id2, updatedEducation, { new: true });

//       if (!education) {
//           return res.status(404).json({ message: "Education not found" });
//       }

//       res.status(200).json({
//           message: "Education updated successfully",
//           education: education
//       });
//   } catch (err) {
//       console.error('Error updating education:', err.message);
//       next(err); // Pass error to error handling middleware
//   }
// };

// // DELETE: Delete an education entry
// const deleteEducation = async (req, res, next) => {
//   try {
//       const employee = await Employee.findById(req.params.id);
//       if (!employee) {
//           return res.status(404).json({ message: "Employee not found" });
//       }

//       const education = await Education.findByIdAndRemove(req.params.id2);
//       if (!education) {
//           return res.status(404).json({ message: "Education not found" });
//       }

//       await Employee.updateOne(
//           { _id: req.params.id },
//           { $pull: { education: req.params.id2 } }
//       );

//       res.status(200).json({
//           message: "Education deleted successfully",
//           education: education
//       });
//       console.log("Education deleted:", education);
//   } catch (err) {
//       console.error('Error deleting education:', err.message);
//       next(err); // Pass error to error handling middleware
//   }
// };
  
  
//   module.exports = {
//     getAllEducation,
//     createEducation,
//     updateEducation,
//     deleteEducation
//   }








const Joi = require('joi');
const { EducationValidation } = require('../validations/educationValidation');
const { Education } = require('../models/educationModel');
const { Employee } = require('../models/employeeModel');

const getAllEducation = async (req, res) => {
  
  // var employee = {};
  // {path: 'projects', populate: {path: 'portals'}}
  Employee.findById(req.params.id)
    // .populate({ path: "city", populate: { path: "state" } ,populate: { populate: { path: "country" } } })
    .populate({
      path: "education"
      // populate: {
      //   path: "state",
      //   model: "State",
      //   populate: {
      //     path: "country",
      //     model: "Country"
      //   }
      // }
    })
    // .select(" -role -position -department")
    .select("FirstName LastName MiddleName")
    .exec(function (err, employee) {
      // console.log(filteredCompany);
      res.send(employee);
    });
  }
  
  // create a city 
  const createEducation = async (req, res) => {
    Joi.validate(req.body, EducationValidation, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send(err.details[0].message);
      } else {
        Employee.findById(req.params.id, function (err, employee) {
          if (err) {
            console.log(err);
            res.send("err");
          } else {
            let newEducation;
  
            newEducation = {
              SchoolUniversity: req.body.SchoolUniversity,
              Degree: req.body.Degree,
              Grade: req.body.Grade,
              PassingOfYear: req.body.PassingOfYear
            };
  
            Education.create(newEducation, function (err, education) {
              if (err) {
                console.log(err);
                res.send("error");
              } else {
                employee.education.push(education);
                employee.save(function (err, data) {
                  if (err) {
                    console.log(err);
                    res.send("err");
                  } else {
                  
                    res.send(education);
                  }
                });
      
              }
            });
        
          }
        });
      }
    });
  }
  
  // find and update the city 
  const updateEducation = async (req, res) => {
    Joi.validate(req.body, EducationValidation, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send(err.details[0].message);
      } else {
        let newEducation;
  
        newEducation = {
          SchoolUniversity: req.body.SchoolUniversity,
          Degree: req.body.Degree,
          Grade: req.body.Grade,
          PassingOfYear: req.body.PassingOfYear
        };
  
        Education.findByIdAndUpdate(req.params.id, newEducation, function (
          err,
          education
        ) {
          if (err) {
            res.send("error");
          } else {
            res.send(newEducation);
          }
        });
      }

    });
  }
  
  // find and delete the city 
  const deleteEducation = async (req, res) => {
    Employee.findById({ _id: req.params.id }, function (err, employee) {
      if (err) {
        res.send("error");
        console.log(err);
      } else {
        Education.findByIdAndRemove({ _id: req.params.id2 }, function (
          err,
          education
        ) {
          if (!err) {
          
            Employee.update(
              { _id: req.params.id },
              { $pull: { education: req.params.id2 } },
              function (err, numberAffected) {
              
                res.send(education);
              }
            );
          } else {
            console.log(err);
            res.send("error");
          }
        });
      
      }
    });
  }
  
  
  module.exports = {
    getAllEducation,
    createEducation,
    updateEducation,
    deleteEducation
  }