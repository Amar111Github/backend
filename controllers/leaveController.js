const Joi = require("joi");
const { Employee } = require("../models/employeeModel");
const { LeaveApplication } = require("../models/leaveModel");
const {
  LeaveApplicationValidation,
  LeaveApplicationHRValidation
} = require("../validations/leavelValidation");

// find  all LeaveApplication Employee
const getAllLeaveApplication = async (req, res) => {
  Employee.findById(req.params.id)
    .populate({
      path: "leaveApplication"
    })
    .select("FirstName LastName MiddleName")
    .exec(function (err, employee) {
      if (err) {
        console.log(err);
        res.send("error");
      } else {
        res.send(employee);
      }
    });
};

// find  all LeaveApplication Admin Hr
const getAllLeaveApplicationHr = async (req, res) => {
  LeaveApplication.find()
    // .populate({ path: "city", populate: { path: "state" } ,populate: { populate: { path: "country" } } })
    .populate({
      path: "employee"
    })
    // .select(" -role -position -department")
    // .select("FirstName LastName MiddleName"
    // )
    .exec(function (err, leaveApplication) {
      // console.log(filteredCompany);
      if (err) {
        console.log(err);
        res.send("error");
      } else {
        res.send(leaveApplication);
      }
    });
};

// create a LeaveApplication
const createLeaveApplication = async (req, res) => {
  Joi.validate(req.body, LeaveApplicationValidation, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send(err.details[0].message);
    } else {
      Employee.findById(req.params.id, function (err, employee) {
        if (err) {
          console.log(err);
          res.send("err");
        } else {
          let newLeaveApplication;
          newLeaveApplication = {
            Leavetype: req.body.Leavetype,
            FromDate: req.body.FromDate,
            ToDate: req.body.ToDate,
            Reasonforleave: req.body.Reasonforleave,
            Status: req.body.Status,
            employee: req.params.id
          };

          LeaveApplication.create(
            newLeaveApplication,
            function (err, leaveApplication) {
              if (err) {
                console.log(err);
                res.send("error");
              } else {
                employee.leaveApplication.push(leaveApplication);
                employee.save(function (err, data) {
                  if (err) {
                    console.log(err);
                    res.send("err");
                  } else {
                    console.log(data);
                    res.send(leaveApplication);
                  }
                });
                console.log("new leaveApplication Saved");
              }
            }
          );
          console.log(req.body);
        }
      });
    }
  });
};

// find and update the LeaveApplication
const updateLeaveApplication = async (req, res) => {
  Joi.validate(req.body, LeaveApplicationValidation, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send(err.details[0].message);
    } else {
      let newLeaveApplication;

      newLeaveApplication = {
        Leavetype: req.body.Leavetype,
        FromDate: req.body.FromDate,
        ToDate: req.body.ToDate,
        Reasonforleave: req.body.Reasonforleave,
        Status: req.body.Status,
        employee: req.params.id
      };

      LeaveApplication.findByIdAndUpdate(
        req.params.id,
        newLeaveApplication,
        function (err, leaveApplication) {
          if (err) {
            res.send("error");
          } else {
            res.send(newLeaveApplication);
          }
        }
      );
    }
  });
};

// find and update the LeaveApplication adminHr
const updateLeaveApplicationHr = async (req, res) => {
  Joi.validate(req.body, LeaveApplicationHRValidation, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send(err.details[0].message);
    } else {
      let newLeaveApplication;

      newLeaveApplication = {
        Status: req.body.Status
      };
      LeaveApplication.findByIdAndUpdate(
        req.params.id,
        {
          $set: newLeaveApplication
        },
        function (err, numberAffected) {
          console.log(numberAffected);
          res.send(newLeaveApplication);
        }
      );

      console.log(req.body);
    }
  });
};

// // find and delete the LeaveApplication Employee
const deleteLeaveApplication = async (req, res) => {
  Employee.findById({ _id: req.params.id }, function (err, employee) {
    if (err) {
      res.send("error");
      console.log(err);
    } else {
      LeaveApplication.findByIdAndRemove(
        { _id: req.params.id2 },
        function (err, leaveApplication) {
          if (!err) {
            console.log("LeaveApplication deleted");
            Employee.update(
              { _id: req.params.id },
              { $pull: { leaveApplication: req.params.id2 } },
              function (err, numberAffected) {
                console.log(numberAffected);
                res.send(leaveApplication);
              }
            );
          } else {
            console.log(err);
            res.send("error");
          }
        }
      );
      console.log("delete");
      console.log(req.params.id);
    }
  });
};

// // find and delete the LeaveApplication AdminHr
const deleteLeaveApplicationHr = async (req, res) => {
  Employee.findById({ _id: req.params.id }, function (err, employee) {
    if (err) {
      res.send("error");
      console.log(err);
    } else {
      LeaveApplication.findByIdAndRemove(
        { _id: req.params.id2 },
        function (err, leaveApplication) {
          if (!err) {
            console.log("LeaveApplication deleted");
            Employee.update(
              { _id: req.params.id },
              { $pull: { leaveApplication: req.params.id2 } },
              function (err, numberAffected) {
                console.log(numberAffected);
                res.send(leaveApplication);
              }
            );
          } else {
            console.log(err);
            res.send("error");
          }
        }
      );
      console.log("delete");
      console.log(req.params.id);
    }
  });
};

module.exports = {
  getAllLeaveApplication,
  getAllLeaveApplicationHr,

  createLeaveApplication,

  updateLeaveApplication,
  updateLeaveApplicationHr,

  deleteLeaveApplication,
  deleteLeaveApplicationHr
};
