// const Joi = require("joi");
// const { Employee } = require("../models/employeeModel");
// const multer = require("multer");
// const {
//   EmployeePersonalInfoValidation
// } = require("../validations/employeeValidation");
// const { fileUploadMiddleware, checkFileSize } = require("../middleware/multer");
// const {
//   cloudinaryFileUploder,
//   removeCloudinaryImage
// } = require("../cloudinary/cloudinaryFileUpload");
// const personalInfo = async (req, res, next) => {
//   try {
//     const employee = await Employee.findById(req.params.id)
//       .populate({
//         path: "role position department"
//         // Additional population can be added here if needed
//       })
//       .select("-salary -education -familyInfo -workExperience")
//       .exec();

//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     res.status(200).json(employee);
//   } catch (err) {
//     console.error("Error fetching employee:", err);
//     next(err); // Pass error to the error handler
//   }
// };

// // Update personal information
// const updatepersonalInfo = async (req, res, next) => {
//   try {
//     // Middleware to handle file upload
//     fileUploadMiddleware(req, res, async (err) => {
//       if (err instanceof multer.MulterError) {
//         return res.status(400).json({ message: "Multer error: " + err.message });
//       } else if (err) {
//         return res.status(500).json({ message: "Internal server error: " + err.message });
//       }

//       // Validate request body
//       const { error } = EmployeePersonalInfoValidation.validate(req.body);
//       if (error) {
//         return res.status(400).json({ message: error.details[0].message });
//       }

//       // Handle other form fields
//       const newEmployee = {
//         BloodGroup: req.body.BloodGroup,
//         ContactNo: req.body.ContactNo,
//         DOB: req.body.DOB,
//         presonalEmail: req.body.presonalEmail,
//         EmergencyContactNo: req.body.EmergencyContactNo,
//         Gender: req.body.Gender,
//         Hobbies: req.body.Hobbies,
//         PANcardNo: req.body.PANcardNo,
//         PermanetAddress: req.body.PermanetAddress,
//         PresentAddress: req.body.PresentAddress,
//         BankName: req.body.BankName,
//         BankAccount: req.body.BankAccount,
//         BankIFSC: req.body.BankIFSC
//       };

//       // Handle file upload to Cloudinary
//       if (req.file) {
//         try {
//           const cloudinaryResponse = await cloudinaryFileUploder(req.file.path);
//           newEmployee.profile = {
//             image_url: cloudinaryResponse.image_url,
//             publicId: cloudinaryResponse.publicId
//           };
//         } catch (cloudinaryError) {
//           return res.status(500).json({ message: "Cloudinary upload error: " + cloudinaryError.message });
//         }
//       }

//       // Update Employee in MongoDB
//       const updatedEmployee = await Employee.findByIdAndUpdate(
//         req.params.id,
//         { $set: newEmployee },
//         { new: true }
//       );

//       if (!updatedEmployee) {
//         return res.status(404).json({ message: "Employee not found" });
//       }

//       // Send response
//       res.status(200).json(updatedEmployee);
//     });
//   } catch (error) {
//     console.error("Server error:", error);
//     next(error); // Pass error to the error handler
//   }
// };

// module.exports = {
//   personalInfo,
//   updatepersonalInfo
// };


const Joi = require("joi");
const { Employee } = require("../models/employeeModel");
const multer = require("multer");
const {
  EmployeePersonalInfoValidation
} = require("../validations/employeeValidation");
const { fileUploadMiddleware, checkFileSize } = require("../middleware/multer");
const {
  cloudinaryFileUploder,
  removeCloudinaryImage
} = require("../cloudinary/cloudinaryFileUpload");
const personalInfo = async (req, res) => {
  Employee.findById(req.params.id)
    .populate({
      path: "role position department"
      
    })
    .select("-salary -education -familyInfo -workExperience")
    .exec(function (err, employee) {
      // employee = employees;
      res.send(employee);
    });
};


const updatepersonalInfo = async (req, res) => {
  try {
    // Middleware to handle file upload
    fileUploadMiddleware(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).send("Multer error");
      } else if (err) {
        return res.status(500).send("Internal server error");
      }

      // Handle other form fields
      const newEmployee = {
        BloodGroup: req.body.BloodGroup,
        ContactNo: req.body.ContactNo,
        DOB: req.body.DOB,
        presonalEmail: req.body.presonalEmail,
        EmergencyContactNo: req.body.EmergencyContactNo,
        Gender: req.body.Gender,
        Hobbies: req.body.Hobbies,
        PANcardNo: req.body.PANcardNo,
        PermanetAddress: req.body.PermanetAddress,
        PresentAddress: req.body.PresentAddress,
        BankName: req.body.BankName,
        BankAccount: req.body.BankAccount,
        BankIFSC: req.body.BankIFSC
      };

      // Handle file upload to Cloudinary
      if (req.file) {
        const cloudinaryResponse = await cloudinaryFileUploder(req.file.path);
        newEmployee.profile = {
          image_url: cloudinaryResponse.image_url,
          publicId: cloudinaryResponse.publicId
        };
      }

      // Update Employee in MongoDB
      const updatedEmployee = await Employee.findByIdAndUpdate(
        req.params.id,
        { $set: newEmployee },
        { new: true }
      );

      // Send response
      res.json(updatedEmployee);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  personalInfo,
  updatepersonalInfo
};