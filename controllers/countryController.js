// const Country = require('../models/countryModel'); // Assuming you have a country model
// const {CountryValidation} = require('../validations/countryValidation');
// const State = require('../models/stateModel'); // Assuming you have a state model
// const City = require('../models/cityModel'); // Assuming you have a city model
// const Joi = require('joi');

// // GET: Retrieve all countries
// const getAllCountries = (req, res) => {
//     Country.find()
//         .populate({ path: "states", populate: { path: "cities" } })
//         .exec((err, countries) => {
//             if (err) {
//                 console.log(err);
//                 res.send(err);
//             } else {
//                 res.send(countries);
//             }
//         });
// };

// // POST: Create a new country
// const createCountry = (req, res) => {


//     const { CountryName } = req.body;

//     Joi.validate(req.body, CountryValidation, async (err, result) => {
//         if (err) {
//             console.log("err: ", err);
//             res.status(400).send(err.details[0].message);
//         } else {
            
//             const newCountry = Country({
//                 CountryName : CountryName,
//             });

//            await Country.create(newCountry, (err, country) => {
//                 if (err) {
//                     console.log("-------errror", err);
//                     res.send("error");
//                 } else {
//                     // res.send("country", country);
//                     res.status(201).json({
//                         message : "ok",
//                         message : country
//                     })
//                 }
//             });

//             // try {
//             //     console.log('con =======');
//             //     await newCountry.save();
//             //     console.log("New country Saved:", newCountry);
//             //     res.send(newCountry);
             
//             // } catch (saveError) {
//             //     console.log("Error saving country:", saveError);
//             //     res.status(500).send("Error saving country");
//             // }
//         }
//     });
// };

// // PUT: Update an existing country
// const updateCountry = (req, res) => {
//     Joi.validate(req.body, CountryValidation, (err, result) => {
//         if (err) {
//             console.log(err);
//             res.status(400).send(err.details[0].message);
//         } else {
//             let updatedCountry = {
//                 CountryName: req.body.CountryName
//             };

//             Country.findByIdAndUpdate(req.params.id, updatedCountry, (err, country) => {
//                 if (err) {
//                     res.send("error");
//                 } else {
//                     res.send(updatedCountry);
//                 }
//             });
//         }


//     });
// };

// // DELETE: Delete a country
// const deleteCountry = (req, res) => {
//     Country.findById(req.params.id, (err, foundCountry) => {
//         if (err) {
//             res.send(err);
//         } else {
//             if (foundCountry.states.length !== 0) {
//                 res.status(403).send("First, delete all the states in this country before deleting this country");
//             } else {
//                 Country.findByIdAndRemove({ _id: req.params.id }, (err, country) => {
//                     if (!err) {
//                         State.deleteMany({ country: { _id: req.params.id } }, (err) => {
//                             if (err) {
//                                 console.log(err);
//                                 res.send("error");
//                             } else {
//                                 // City.deleteMany({ state: { country: { _id: req.params.id } } }, (err) => {
//                                 //     if (err) {
//                                 //         console.log("city delete Arror =====> ======");
//                                 //         res.send("error");
//                                 //     } else {
//                                 //         console.log("Country deleted");
//                                 //         res.send(country);
//                                 //     }
//                                 // });

//                                 res.status(200).json({
//                                     message : "country is deleted"
//                                 });
//                             }
//                         });
//                     } else {
//                         res.send("error");
//                     }
//                 });
//             }
//         }
//     });
// };

// module.exports = {
//     getAllCountries,
//     createCountry,
//     updateCountry,
//     deleteCountry
// };


const Country = require('../models/countryModel'); // Assuming you have a country model
const {CountryValidation} = require('../validations/countryValidation');
const State = require('../models/stateModel'); // Assuming you have a state model
const City = require('../models/cityModel'); // Assuming you have a city model
const Joi = require('joi');

// GET: Retrieve all countries
const getAllCountries = (req, res) => {
    Country.find()
        .populate({ path: "states", populate: { path: "cities" } })
        .exec((err, countries) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.send(countries);
            }
        });
};

// POST: Create a new country
const createCountry = (req, res) => {


    const { CountryName } = req.body;

    Joi.validate(req.body, CountryValidation, async (err, result) => {
        if (err) {
            console.log("err: ", err);
            res.status(400).send(err.details[0].message);
        } else {
            
            const newCountry = Country({
                CountryName : CountryName,
            });

           await Country.create(newCountry, (err, country) => {
                if (err) {
                    console.log("-------errror", err);
                    res.send("error");
                } else {
                    // res.send("country", country);
                    res.status(201).json({
                        message : "ok",
                        message : country
                    })
                }
            });
        }
    });
};

// PUT: Update an existing country
const updateCountry = (req, res) => {
    Joi.validate(req.body, CountryValidation, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send(err.details[0].message);
        } else {
            let updatedCountry = {
                CountryName: req.body.CountryName
            };

            Country.findByIdAndUpdate(req.params.id, updatedCountry, (err, country) => {
                if (err) {
                    res.send("error");
                } else {
                    res.send(updatedCountry);
                }
            });
        }


    });
};

// DELETE: Delete a country
const deleteCountry = (req, res) => {
    Country.findById(req.params.id, (err, foundCountry) => {
        if (err) {
            res.send(err);
        } else {
            if (foundCountry.states.length !== 0) {
                res.status(403).send("First, delete all the states in this country before deleting this country");
            } else {
                Country.findByIdAndRemove({ _id: req.params.id }, (err, country) => {
                    if (!err) {
                        State.deleteMany({ country: { _id: req.params.id } }, (err) => {
                            if (err) {
                                console.log(err);
                                res.send("error");
                            } else {
                                // City.deleteMany({ state: { country: { _id: req.params.id } } }, (err) => {
                                //     if (err) {
                                //         console.log("city delete Arror =====> ======");
                                //         res.send("error");
                                //     } else {
                                //         console.log("Country deleted");
                                //         res.send(country);
                                //     }
                                // });

                                res.status(200).json({
                                    message : "country is deleted"
                                });
                            }
                        });
                    } else {
                        res.send("error");
                    }
                });
            }
        }
    });
};

module.exports = {
    getAllCountries,
    createCountry,
    updateCountry,
    deleteCountry
};

