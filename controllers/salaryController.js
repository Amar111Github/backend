




const Joi = require('joi');
const { Employee } = require('../models/employeeModel');
const { Salary } = require('../models/salaryModel');
const { SalaryValidation } = require('../validations/salaryValidation');

const getAllSalary = async (req, res) => {
  Employee.find()
    .populate({
      path: "salary"
    })
    .select("FirstName LastName MiddleName")
    .exec(function (err, company) {
      let filteredCompany = company.filter(data => data["salary"].length == 1);
      res.send(filteredCompany);
    });
  }
  
  // create a Salary 
  const createSalary = async (req, res) => {
    Joi.validate(req.body, SalaryValidation, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send(err.details[0].message);
      } else {
        Employee.findById(req.params.id, function (err, employee) {
          if (err) {
            console.log(err);
            res.send("err");
          } else {
            if (employee.salary.length == 0) {
              let newSalary;
  
              newSalary = {
                BasicSalary: req.body.BasicSalary,
                BankName: req.body.BankName,
                AccountNo: req.body.AccountNo,
                AccountHolderName: req.body.AccountHolderName,
                IFSCcode: req.body.IFSCcode,
                TaxDeduction: req.body.TaxDeduction
              };
  
              Salary.create(newSalary, function (err, salary) {
                if (err) {
                  console.log(err);
                  res.send("error");
                } else {
                  employee.salary.push(salary);
                  employee.save(function (err, data) {
                    if (err) {
                      console.log(err);
                      res.send("err");
                    } else {
                      console.log(data);
                      res.send(salary);
                    }
                  });
                  console.log("new salary Saved");
                }
              });
              console.log(req.body);
            } else {
              res
                .status(403)
                .send("Salary Information about this employee already exits");
            }
          }
        });
      }
    });
  }
  
  // find and update the Salary 
  const updateSalary = async (req, res) => {
    Joi.validate(req.body, SalaryValidation, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send(err.details[0].message);
      } else {
        let newSalary;
  
        newSalary = {
          BasicSalary: req.body.BasicSalary,
          BankName: req.body.BankName,
          AccountNo: req.body.AccountNo,
          AccountHolderName: req.body.AccountHolderName,
          IFSCcode: req.body.IFSCcode,
          TaxDeduction: req.body.TaxDeduction
        };
  
        Salary.findByIdAndUpdate(req.params.id, newSalary, function (err, salary) {
          if (err) {
            res.send("error");
          } else {
            res.send(newSalary);
          }
        });
      }
  
      console.log("put");
      console.log(req.body);
    });
  }
  
  // find and delete the Salary 
  const deleteSalary = async (req, res) => {
    Employee.findById({ _id: req.params.id }, function (err, employee) {
      console.log("uuuuuuuunnnnnnnnnnnnnnndef", employee.salary[0]);
      if (err) {
        res.send("error");
        console.log(err);
      } else {
        Salary.findByIdAndRemove({ _id: employee.salary[0] }, function (
          err,
          salary
        ) {
          if (!err) {
            console.log("salary deleted");
            Employee.update(
              { _id: req.params.id },
              { $pull: { salary: employee.salary[0] } },
              function (err, numberAffected) {
                console.log(numberAffected);
                res.send(salary);
              }
            );
          } else {
            console.log(err);
            res.send("error");
          }
        });
        console.log("delete");
        console.log(req.params.id);
      }
    });
  }
  
  
  module.exports = {
    getAllSalary,
    createSalary,
    updateSalary,
    deleteSalary
  }