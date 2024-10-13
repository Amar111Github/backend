// const Joi = require('joi');
// const State = require('../models/stateModel');
// const  { StateValidation } = require('../validations/stateValidation');
// const Country = require('../models/countryModel');


// // get all states 
// const getAllStates = async (req, res, next) => {
//   try {
//     const states = await State.find().populate('country citiesx').exec();
//     res.status(200).json(states);
//   } catch (err) {
//     next(err); // Pass error to middleware
//   }
// };

// // Create a state
// const createState = async (req, res) => {
//   Joi.validate(req.body, StateValidation, (err, result) => {
//       if (err) {
//           console.log(err);
//           res.status(400).send(err.details[0].message);
//       } else {
//           let newState;

//           newState = {
//               StateName: req.body.StateName,
//               country: req.body.CountryID
//           };


//           State.create(newState, function (err, state) {
//               if (err) {
//                   res.send("error");
//               } else {
//                   Country.findById(req.body.CountryID, function (err, country) {
//                       if (err) {
//                           res.send("err");
//                       } else {
//                           country.states.push(state);
//                           country.save(function (err, data) {
//                               if (err) {
//                                   console.log(err);
//                               } else {
//                                   res.send(state);
//                               }
//                           });
//                       }
//                   });
//               }
//           });
//       }
//   });
// }

// // Update a state
// const updateState = async (req, res, next) => {
//   try {
//     await StateValidation.validateAsync(req.body);

//     const updatedState = {
//       StateName: req.body.StateName,
//       country: req.body.CountryID
//     };

//     const state = await State.findByIdAndUpdate(req.params.id, updatedState, { new: true });
//     if (!state) {
//       return res.status(404).json({ message: 'State not found' });
//     }

//     res.status(200).json(state);
//   } catch (err) {
//     next(err); // Pass error to middleware
//   }
// };

// // Delete a state
// const deleteState = async (req, res, next) => {
//   try {
//     const foundState = await State.findById(req.params.id);
//     if (!foundState) {
//       return res.status(404).json({ message: 'State not found' });
//     }

//     if (foundState.cities.length > 0) {
//       return res.status(403).json({ message: 'Delete all cities in this state before deleting the state' });
//     }

//     const state = await State.findByIdAndRemove(req.params.id);
//     if (!state) {
//       return res.status(404).json({ message: 'State not found' });
//     }

//     await Country.updateOne(
//       { _id: state.country },
//       { $pull: { states: state._id } }
//     );

//     res.status(200).json({ message: 'State is deleted' });
//   } catch (err) {
//     next(err); // Pass error to middleware
//   }
// };


// module.exports = {
//     getAllStates,
//     createState,
//     deleteState,
//     updateState
// }



const Joi = require('joi');
const State = require('../models/stateModel');
const  { StateValidation } = require('../validations/stateValidation');
const Country = require('../models/countryModel');


// get all states 
const getAllStates = async (req, res) => {
    State.find().populate("country citiesx").exec(function (err, country) {
        res.send(country);
    });
}

// create ane state 
const createState = async (req, res) => {
    Joi.validate(req.body, StateValidation, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send(err.details[0].message);
        } else {
            let newState;

            newState = {
                StateName: req.body.StateName,
                country: req.body.CountryID
            };


            State.create(newState, function (err, state) {
                if (err) {
                    res.send("error");
                } else {
                    Country.findById(req.body.CountryID, function (err, country) {
                        if (err) {
                            res.send("err");
                        } else {
                            country.states.push(state);
                            country.save(function (err, data) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    res.send(state);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

// find one and update  
const updateState = async (req, res) => {
    Joi.validate(req.body, StateValidation, (err, result) => {
        if (err) {
          console.log(err);
          res.status(400).send(err.details[0].message);
        } else {
          let newState;
    
          newState = {
            StateName: req.body.StateName,
            country: req.body.CountryID
          };
    
          State.findByIdAndUpdate(req.params.id, newState, function (err, state) {
            if (err) {
              res.send("error");
            } else {
              res.send(newState);
            }
          });
        }
      });
}

// find one and delete 
const deleteState = async (req, res) => {
    State.findById(req.params.id, function (err, foundState) {
        if (err) {
          res.send(err);
        } else {
            
          if (!foundState.cities.length == 0) {
            res
              .status(403)
              .send(
                "First Delete All The cities in this state before deleting this state"
              );
          } else {
            State.findByIdAndRemove({ _id: req.params.id }, function (err, state) {
              if (!err) {
                Country.update(
                  { _id: state.country[0] },
                  { $pull: { states: state._id } },
                  function (err, numberAffected) {
                    res.status(200).json({
                      message : "state is deleted",
                    });
                  }
                );
              } else {
                res.send("error");
              }
            });
          }
        }
      });
}


module.exports = {
    getAllStates,
    createState,
    deleteState,
    updateState
}