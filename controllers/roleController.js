
// const Joi = require('joi');
// const { Role } = require('../models/roleModel');
// const { RoleValidation } = require('../validations/roleValidetion');

// const getAllRole = async (req, res, next) => {
//   try {
//     const roles = await Role.find().populate("company").exec();
//     res.status(200).json(roles);
//   } catch (err) {
//     console.error("Error fetching roles:", err);
//     next(err); // Pass error to the error handler middleware
//   }
// };

// // Create a new role
// const createRole = async (req, res, next) => {
//   try {
//     const { error } = RoleValidation.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     const newRole = {
//       RoleName: req.body.RoleName,
//       company: req.body.CompanyID
//     };

//     const role = await Role.create(newRole);
//     res.status(201).json(role);
//     console.log("New role saved");
//   } catch (err) {
//     console.error("Error creating role:", err);
//     next(err); // Pass error to the error handler middleware
//   }
// };

// // Delete a role
// const deleteRole = async (req, res, next) => {
//   try {
//     const employees = await Employee.find({ role: req.params.id });

//     if (employees.length > 0) {
//       return res.status(403).json({ message: "This role is associated with employees and cannot be deleted" });
//     }

//     const role = await Role.findByIdAndRemove(req.params.id);
//     if (!role) {
//       return res.status(404).json({ message: "Role not found" });
//     }

//     res.status(200).json({ message: "Role deleted successfully", role });
//     console.log("Role deleted");
//   } catch (err) {
//     console.error("Error deleting role:", err);
//     next(err); // Pass error to the error handler middleware
//   }
// };

// // Update a role
// const updateRole = async (req, res, next) => {
//   try {
//     const { error } = RoleValidation.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     const updateRole = {
//       RoleName: req.body.RoleName,
//       company: req.body.CompanyID
//     };

//     const role = await Role.findByIdAndUpdate(req.params.id, updateRole, { new: true });
//     if (!role) {
//       return res.status(404).json({ message: "Role not found" });
//     }

//     res.status(200).json(role);
//   } catch (err) {
//     console.error("Error updating role:", err);
//     next(err); // Pass error to the error handler middleware
//   }
// };


// module.exports = {
//     getAllRole,
//     createRole,
//     deleteRole,
//     updateRole
// }

const Joi = require('joi');
const { Role } = require('../models/roleModel');
const { RoleValidation } = require('../validations/roleValidetion');
const { Employee } = require("../models/employeeModel");


const getAllRole = async(req, res) => {
    Role.find().populate("company").exec(function (err, role) {
        res.send(role);
      });
}

const createRole = async(req, res) => {
    Joi.validate(req.body, RoleValidation, (err, result) => {
        if (err) {
          console.log(err);
          res.status(400).send(err.details[0].message);
        } else {
          let newRole;
    
          newRole = {
            RoleName: req.body.RoleName,
            company: req.body.CompanyID
          };
    
          Role.create(newRole, function (err, role) {
            if (err) {
              console.log(err);
              res.send("error");
            } else {
              res.send(role);
            }
          });
        }
      });
}

const deleteRole = async(req, res) => {
    Employee.find({ role: req.params.id }, function (err, r) {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          if (r.length == 0) {
            Role.findByIdAndRemove({ _id: req.params.id }, function (err, role) {
              if (!err) {
                res.send(role);
              } else {
                console.log("error");
                res.send("err");
              }
            });
            
          } else {
            res
              .status(403)
              .send(
                "This role is associated with Employee so you can not delete this"
              );
          }
        }
      }); 
}

const updateRole = async(req, res) => {
    Joi.validate(req.body, RoleValidation, (err, result) => {
        if (err) {
          console.log(err);
          res.status(400).send(err.details[0].message);
        } else {
          let updateRole;
    
          updateRole = {
            RoleName: req.body.RoleName,
            company: req.body.CompanyID
          };
    
          Role.findByIdAndUpdate(req.params.id, updateRole, function (err, role) {
            if (err) {
              res.send("error");
            } else {
              res.send(updateRole);
            }
          });
        }

      });
}


module.exports = {
    getAllRole,
    createRole,
    deleteRole,
    updateRole
}