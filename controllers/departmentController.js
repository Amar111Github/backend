// const Joi = require('joi');
// const Department = require("../models/departmentModel");
// const DepartmentValidation = require("../validations/departmentValideton");


// // GET: Retrieve all departments
// const getAllDepartment = async (req, res, next) => {
//   try {
//       const departments = await Department.find()
//           .populate("company")
//           .exec();

//       res.status(200).json(departments);
//   } catch (err) {
//       console.error('Error retrieving departments:', err.message);
//       next(err); // Pass error to error handling middleware
//   }
// };

// // POST: Create a new department
// const createDepartment = async (req, res, next) => {
//   try {
//       const { error } = DepartmentValidation.validate(req.body);
//       if (error) {
//           return res.status(400).json({ message: error.details[0].message });
//       }

//       const newDepartment = new Department({
//           DepartmentName: req.body.DepartmentName,
//           company: req.body.CompanyID,
//       });

//       const savedDepartment = await Department.create(newDepartment);
//       res.status(201).json({
//           message: "Department created successfully",
//           department: savedDepartment
//       });
//       console.log("New department saved:", savedDepartment);
//   } catch (err) {
//       console.error('Error creating department:', err.message);
//       next(err); // Pass error to error handling middleware
//   }
// };

// // DELETE: Delete a department
// const deleteDepartment = async (req, res, next) => {
//   try {
//       const employees = await Employee.find({ department: req.params.id });

//       if (employees.length > 0) {
//           return res.status(403).json({ 
//               message: "This department is associated with employees, so it cannot be deleted" 
//           });
//       }

//       const deletedDepartment = await Department.findByIdAndRemove(req.params.id);

//       if (!deletedDepartment) {
//           return res.status(404).json({ message: "Department not found" });
//       }

//       res.status(200).json({
//           message: "Department deleted successfully",
//           department: deletedDepartment
//       });
//       console.log("Department deleted:", deletedDepartment);
//   } catch (err) {
//       console.error('Error deleting department:', err.message);
//       next(err); // Pass error to error handling middleware
//   }
// };

// // PUT: Update an existing department
// const updateDepartment = async (req, res, next) => {
//   try {
//       const { error } = DepartmentValidation.validate(req.body);
//       if (error) {
//           return res.status(400).json({ message: error.details[0].message });
//       }

//       const updatedDepartment = {
//           DepartmentName: req.body.DepartmentName,
//           company: req.body.CompanyID,
//       };

//       const department = await Department.findByIdAndUpdate(req.params.id, updatedDepartment, { new: true });

//       if (!department) {
//           return res.status(404).json({ message: "Department not found" });
//       }

//       res.status(200).json({
//           message: "Department updated successfully",
//           department: department
//       });
//   } catch (err) {
//       console.error('Error updating department:', err.message);
//       next(err); // Pass error to error handling middleware
//   }
// };

// module.exports = {
//   getAllDepartment,
//   createDepartment,
//   deleteDepartment,
//   updateDepartment,
// };
const Joi = require('joi');
const Department = require("../models/departmentModel");
const DepartmentValidation = require("../validations/departmentValideton");
const { Employee } = require("../models/employeeModel");


const getAllDepartment = async (req, res) => {
  Department.find()
    .populate("company")
    .exec(function (err, employees) {
      res.send(employees);
    });
};

const createDepartment = async (req, res) => {
  Joi.validate(req.body, DepartmentValidation, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send(err.details[0].message);
    } else {
      let newDepartment;

      newDepartment = {
        DepartmentName: req.body.DepartmentName,
        company: req.body.CompanyID,
      };

      Department.create(newDepartment, function (err, department) {
        if (err) {
          console.log(err);
          res.send("error");
        } else {
          res.send(department);
       
        }
      });
    }
  });
};

const deleteDepartment = async (req, res) => {
  Employee.find({ department: req.params.id }, function (err, d) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      if (d.length == 0) {
        Department.findByIdAndRemove(
          { _id: req.params.id },
          function (err, department) {
            if (!err) {
            
              res.send(department);
              // });
          
            } else {
              console.log("error");
              res.send("err");
            }
          }
        );
        
      } else {
        res
          .status(403)
          .send(
            "This department is associated with Employee so you can not delete this"
          );
      }
    }
  });
};

const updateDepartment = async (req, res) => {
  Joi.validate(req.body, DepartmentValidation, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send(err.details[0].message);
    } else {
      let updateDepartment;

      updateDepartment = {
        DepartmentName: req.body.DepartmentName,
        company: req.body.CompanyID,
      };

      Department.findByIdAndUpdate(
        req.params.id,
        updateDepartment,
        function (err, department) {
          if (err) {
            res.send("error");
          } else {
            res.send(updateDepartment);
          }
        }
      );
    }
  });
};

module.exports = {
  getAllDepartment,
  createDepartment,
  deleteDepartment,
  updateDepartment,
};
