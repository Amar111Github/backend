
const Joi = require('joi');
const Company = require('../models/companyModel');
const CompanyValidation = require('../validations/companyValidation');

const createCompany = async(req, res) => {
    Joi.validate(req.body, CompanyValidation, (err, result) => {
        if (err) {
          console.log(err);
          res.status(400).send(err.details[0].message);
        } else {
          let newCompany;
    
          newCompany = {
            CompanyName: req.body.CompanyName,
            Address: req.body.Address,
            city: req.body.CityID,
            PostalCode: req.body.PostalCode,
            Website: req.body.Website,
            Email: req.body.Email,
            ContactPerson: req.body.ContactPerson,
            ContactNo: req.body.ContactNo,
            FaxNo: req.body.FaxNo,
            PanNo: req.body.PanNo,
            GSTNo: req.body.GSTNo,
            CINNo: req.body.CINNo
          };
    
          Company.create(newCompany, function (err, company) {
            if (err) {
              console.log(err);
              res.send("error");
            } else {
              res.send(newCompany);
       
            }
          });
         
        }
      });
}

// find all company 
const getAllCompanyDetails = async(req, res) => {
  // var employee = {};
  // {path: 'projects', populate: {path: 'portals'}}
  Company.find()
    // .populate({ path: "city", populate: { path: "state" } ,populate: { populate: { path: "country" } } })
    .populate({
      path: "city",
      populate: {
        path: "state",
        model: "State",
        populate: {
          path: "country",
          model: "Country"
        }
      }
    })
    .exec(function (err, compnay) {
      res.send(compnay);
    });
}


// find and delete company details 
const updateCompanyDtails = async(req, res) => {

    Joi.validate(req.body, CompanyValidation, (err, result) => {
        if (err) {
          console.log(err);
          res.status(400).send(err.details[0].message);
        } else {
          let newCompany;
    
          newCompany = {
            CompanyName: req.body.CompanyName,
            Address: req.body.Address,
            city: req.body.CityID,
            PostalCode: req.body.PostalCode,
            Website: req.body.Website,
            Email: req.body.Email,
            ContactPerson: req.body.ContactPerson,
            ContactNo: req.body.ContactNo,
            FaxNo: req.body.FaxNo,
            PanNo: req.body.PanNo,
            GSTNo: req.body.GSTNo,
            CINNo: req.body.CINNo
          };
    
          Company.findByIdAndUpdate(req.params.id, newCompany, function (
            err,
            company
          ) {
            if (err) {
              res.send("error");
            } else {
              res.send(newCompany);
            }
          });
        }
  
      });
}
const deleteCompanyDetails = async(req,res)=>{
  const {id} = req.params;
 
try {
 const output= await Company.findByIdAndDelete({_id:id});

 res.status(200).send("company deleted Successfully")
} catch (error) {
  res.status(400).send(error)
}

 
}

module.exports = {
    createCompany,
    getAllCompanyDetails,
    updateCompanyDtails,
    deleteCompanyDetails,
}



// const Joi = require('joi');
// const Company = require('../models/companyModel');
// const CompanyValidation = require('../validations/companyValidation');

// const createCompany = async(req, res) => {
//     Joi.validate(req.body, CompanyValidation, (err, result) => {
//         if (err) {
//           console.log(err);
//           res.status(400).send(err.details[0].message);
//         } else {
//           let newCompany;
    
//           newCompany = {
//             CompanyName: req.body.CompanyName,
//             Address: req.body.Address,
//             city: req.body.CityID,
//             PostalCode: req.body.PostalCode,
//             Website: req.body.Website,
//             Email: req.body.Email,
//             ContactPerson: req.body.ContactPerson,
//             ContactNo: req.body.ContactNo,
//             FaxNo: req.body.FaxNo,
//             PanNo: req.body.PanNo,
//             GSTNo: req.body.GSTNo,
//             CINNo: req.body.CINNo
//           };
    
//           Company.create(newCompany, function (err, company) {
//             if (err) {
//               console.log(err);
//               res.send("error");
//             } else {
//               res.send(newCompany);
       
//             }
//           });
         
//         }
//       });
// }

// // find all company 
// const getAllCompanyDetails = async(req, res) => {
//   // var employee = {};
//   // {path: 'projects', populate: {path: 'portals'}}
//   Company.find()
//     // .populate({ path: "city", populate: { path: "state" } ,populate: { populate: { path: "country" } } })
//     .populate({
//       path: "city",
//       populate: {
//         path: "state",
//         model: "State",
//         populate: {
//           path: "country",
//           model: "Country"
//         }
//       }
//     })
//     .exec(function (err, compnay) {
//       res.send(compnay);
//     });
// }


// // find and delete company details 
// const updateCompanyDtails = async(req, res) => {

//     Joi.validate(req.body, CompanyValidation, (err, result) => {
//         if (err) {
//           console.log(err);
//           res.status(400).send(err.details[0].message);
//         } else {
//           let newCompany;
    
//           newCompany = {
//             CompanyName: req.body.CompanyName,
//             Address: req.body.Address,
//             city: req.body.CityID,
//             PostalCode: req.body.PostalCode,
//             Website: req.body.Website,
//             Email: req.body.Email,
//             ContactPerson: req.body.ContactPerson,
//             ContactNo: req.body.ContactNo,
//             FaxNo: req.body.FaxNo,
//             PanNo: req.body.PanNo,
//             GSTNo: req.body.GSTNo,
//             CINNo: req.body.CINNo
//           };
    
//           Company.findByIdAndUpdate(req.params.id, newCompany, function (
//             err,
//             company
//           ) {
//             if (err) {
//               res.send("error");
//             } else {
//               res.send(newCompany);
//             }
//           });
//         }
  
//       });
// }
// const deleteCompanyDetails = async(req,res)=>{
//   const {id} = req.params;
 
// try {
//  const output= await Company.findByIdAndDelete({_id:id});

//  res.status(200).send("company deleted Successfully")
// } catch (error) {
//   res.status(400).send(error)
// }

 
// }

// module.exports = {
//     createCompany,
//     getAllCompanyDetails,
//     updateCompanyDtails,
//     deleteCompanyDetails,
// }