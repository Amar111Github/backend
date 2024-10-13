const Joi = require("joi");
const { Employee } = require("../models/employeeModel");
const { Salary } = require("../models/salaryModel");
const { SalaryValidation } = require("../validations/salaryValidation");

const getAllSalary = async (req, res) => {
  Employee.find()
    .populate({
      path: "salary"
    })
    .select("FirstName LastName empID  profile")
    .populate({
      path: "position"
    })
    .exec(function (err, company) {
      let filteredCompany = company.filter(
        (data) => data["salary"].length == 1
      );
      res.send(filteredCompany);
    });
};

// create a Salary

const createSalary = async (req, res) => {
  try {
    await Joi.validate(req.body, SalaryValidation);

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).send("Employee not found");
    }

    if (employee.salary.length > 0) {
      return res
        .status(403)
        .send("Salary information about this employee already exists");
    }

    const totalSalary =
      Number(req.body.BasicSalary) +
      Number(req.body.HRASalary) +
      Number(req.body.MAllowance) +
      Number(req.body.SpecialAllowance) +
      Number(req.body.otherAllowance) -
      Number(req.body.LeaveDeduct) -
      Number(req.body.PFDeduct) -
      Number(req.body.TaxDeduction);

    const newSalary = {
      BasicSalary: Number(req.body.BasicSalary),
      HRASalary: Number(req.body.HRASalary),
      MAllowance: Number(req.body.MAllowance),
      SpecialAllowance: Number(req.body.SpecialAllowance),
      otherAllowance: Number(req.body.otherAllowance),
      LeaveDeduct: Number(req.body.LeaveDeduct),
      PFDeduct: Number(req.body.PFDeduct),
      BankName: req.body.BankName,
      AccountNo: req.body.AccountNo,
      AccountHolderName: req.body.AccountHolderName,
      IFSCcode: req.body.IFSCcode,
      TaxDeduction: Number(req.body.TaxDeduction),
      totalSalary: totalSalary
    };

    const salary = await Salary.create(newSalary);
    employee.salary.push(salary);
    await employee.save();

    res.send(salary);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message || "An error occurred");
  }
};

const updateSalary = async (req, res) => {
  Joi.validate(req.body, SalaryValidation, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send(err.details[0].message);
    } else {
      // Calculate total salary
      const totalSalary =
        Number(req.body.BasicSalary) +
        Number(req.body.HRASalary) +
        Number(req.body.MAllowance) +
        Number(req.body.SpecialAllowance) +
        Number(req.body.otherAllowance) -
        Number(req.body.LeaveDeduct) -
        Number(req.body.PFDeduct) -
        Number(req.body.TaxDeduction);

      const newSalary = {
        BasicSalary: Number(req.body.BasicSalary),
        HRASalary: Number(req.body.HRASalary),
        MAllowance: Number(req.body.MAllowance),
        SpecialAllowance: Number(req.body.SpecialAllowance),
        otherAllowance: Number(req.body.otherAllowance),
        LeaveDeduct: Number(req.body.LeaveDeduct),
        PFDeduct: Number(req.body.PFDeduct),
        BankName: req.body.BankName,
        AccountNo: req.body.AccountNo,
        AccountHolderName: req.body.AccountHolderName,
        IFSCcode: req.body.IFSCcode,
        TaxDeduction: Number(req.body.TaxDeduction),
        totalSalary: totalSalary
      };

      Salary.findByIdAndUpdate(
        req.params.id,
        newSalary,
        { new: true },
        (err, salary) => {
          if (err) {
            res.status(500).send("An error occurred while updating the salary");
          } else {
            res.send(newSalary);
          }
        }
      );
    }

 
    
  });
};

const deleteSalary = async (req, res) => {
  Employee.findById({ _id: req.params.id }, function (err, employee) {
   
    if (err) {
      res.send("error");
      console.log(err);
    } else {
      Salary.findByIdAndRemove(
        { _id: employee.salary[0] },
        function (err, salary) {
          if (!err) {
           
            Employee.update(
              { _id: req.params.id },
              { $pull: { salary: employee.salary[0] } },
              function (err, numberAffected) {
               
                res.send(salary);
              }
            );
          } else {
            console.log(err);
            res.send("error");
          }
        }
      );
 
    }
  });
};

module.exports = {
  getAllSalary,
  createSalary,
  updateSalary,
  deleteSalary
};