const Joi = require('joi');
const City = require('../models/cityModel');
const CityValidation = require('../validations/cityValidation');
const State = require('../models/stateModel');
const Company = require('../models/companyModel');


// get all cit
const getAllcity = async (req, res) => {
  City.find()
    .populate({ path: "state", populate: { path: "country" } })
    .exec(function (err, city) {
      res.send(city)
    });
}

// create a city 
const createCity = async (req, res) => {
  console.log("body ======>   ", req.body);

  await Joi.validate(req.body, CityValidation, (err, result) => {
    console.log("hello ====== ", result);
    if (err) {
      console.log(err);
      res.status(400).send(err.details[0].message);
    } else {
      let newCity;

      newCity = {
        CityName: req.body.CityName,
        state: req.body.StateID
      };

      City.create(newCity, function (err, city) {
        if (err) {
          console.log(err);
          res.send("error");
        } else {
          State.findById(req.body.StateID, function (err, state) {
            if (err) {
              console.log(err);
              res.send("err");
            } else {
              state.cities.push(city);
              state.save(function (err, data) {
                if (err) {
                  console.log(err);
                  res.send("err");
                } else {
                  console.log(data);
                  res.send(city);
                }
              });
            }
          });

          console.log("new city Saved");
        }
      });
    }
  });
}

// find and update the city 
const updateCity = async (req, res) => {
  Joi.validate(req.body, CityValidation, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send(err.details[0].message);
    } else {
      let newCity;

      newCity = {
        CityName: req.body.CityName,
        state: req.body.StateID
      };

      City.findByIdAndUpdate(req.params.id, newCity, function (err, city) {
        if (err) {
          res.send("error");
        } else {
          res.send(newCity);
        }
      });
    }

    console.log("put");
    console.log(req.body);
  });
}

// find and delete the city 
const deleteCity = async (req, res) => {
  // note found the componey 

  try {
    Company.find({ city: req.params.id }, function (err, country) {
      if (err) {
        res.send(err);
      } else {
        if (country.length == 0) {
          City.findByIdAndRemove({ _id: req.params.id }, function (err, city) {
            if (!err) {
              State.update(
                { _id: city.state[0] },
                { $pull: { cities: city._id } },
                function (err, numberAffected) {
                  res.status(200).json({
                    message : "city is deleted"
                  })
                }
              );
            } else {
              res.send("error");
            }
          });
        } else {
          res
            .status(403)
            .send(
              "This city is associated with company so you can not delete this"
            );
        }
      }
    });
  } catch {
    res.status(403).json({
      message: "requist is faild"
    })
  }
}


module.exports = {
  getAllcity,
  createCity,
  updateCity,
  deleteCity
}