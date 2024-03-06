const Joi = require("joi");
const { Employee } = require("../models/employeeModel");
const { FamilyInfo } = require("../models/familyModel");
const { FamilyInfoValidation } = require("../validations/familyValidation");

const getAllFamily = async (req, res) => {
  console.log(req.params.id);
  // var employee = {};
  // {path: 'projects', populate: {path: 'portals'}}
  Employee.findById(req.params.id)
    // .populate({ path: "city", populate: { path: "state" } ,populate: { populate: { path: "country" } } })
    .populate({
      path: "familyInfo",
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
};

// create a city
const createFamily = async (req, res) => {
  Joi.validate(req.body, FamilyInfoValidation, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send(err.details[0].message);
    } else {
      Employee.findById(req.params.id, function (err, employee) {
        if (err) {
          console.log(err);
          res.send("err");
        } else {
          let newFamilyInfo;

          newFamilyInfo = {
            Name: req.body.Name,
            Relationship: req.body.Relationship,
            DOB: req.body.DOB,
            Occupation: req.body.Occupation
          };

          FamilyInfo.create(newFamilyInfo, function (err, familyInfo) {
            if (err) {
              console.log(err);
              res.send("error");
            } else {
              employee.familyInfo.push(familyInfo);
              employee.save(function (err, data) {
                if (err) {
                  console.log(err);
                  res.send("err");
                } else {
                  console.log(data);
                  res.send(familyInfo);
                }
              });
              console.log("new familyInfo Saved");
            }
          });
          console.log(req.body);
        }
      });
    }
  });
};

// find and update the city
const updateFamily = async (req, res) => {
  Joi.validate(req.body, FamilyInfoValidation, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send(err.details[0].message);
    } else {
      let newFamilyInfo;

      newFamilyInfo = {
        Name: req.body.Name,
        Relationship: req.body.Relationship,
        DOB: req.body.DOB,
        Occupation: req.body.Occupation
      };

      FamilyInfo.findByIdAndUpdate(req.params.id, newFamilyInfo, function (
        err,
        familyInfo
      ) {
        if (err) {
          res.send("error");
        } else {
          res.send(newFamilyInfo);
        }
      });
    }
    console.log("put");
    console.log(req.body);
  });
};

// find and delete the city
const deleteFamily = async (req, res) => {
  Employee.findById({ _id: req.params.id }, function (err, employee) {
    if (err) {
      res.send("error");
      console.log(err);
    } else {
      FamilyInfo.findByIdAndRemove({ _id: req.params.id2 }, function (
        err,
        familyInfo
      ) {
        if (!err) {
          console.log("FamilyInfo deleted");
          Employee.update(
            { _id: req.params.id },
            { $pull: { familyInfo: req.params.id2 } },
            function (err, numberAffected) {
              console.log(numberAffected);
              res.send(familyInfo);
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
};

module.exports = {
  getAllFamily,
  createFamily,
  updateFamily,
  deleteFamily,
};
