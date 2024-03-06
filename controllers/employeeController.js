const { Employee } = require("../models/employeeModel");
const bcript = require("bcrypt");

const {
  cloudinaryFileUploder,
  removeCloudinaryImage,
  uplodeImagesCloudinary
} = require("../cloudinary/cloudinaryFileUpload");
const { AttendanceModel } = require("../models/attendanceModel");

const SALT_FECTOUR = 10;

const getAllEmployee = async (req, res) => {
  Employee.find()
    // .populate({ path: "city", populate: { path: "state" } ,populate: { populate: { path: "country" } } })
    .populate({
      path: "role position department"
      // populate: {
      //   path: "state",
      //   model: "State",
      //   populate: {
      //     path: "country",
      //     model: "Country"
      //   }
      // }
    })

    .select("-salary -education -familyInfo -workExperience -Password")
    .exec(function (err, employee) {
      res.send(employee);
    });
};

// create a city
// const createEmployee = async (req, res) => {
//   try {
//     const latestUser = await Employee.findOne({ empID: /^KASP\d{4}$/ }).sort({
//       empID: -1,
//     });
//     let newUserID;
//     if (latestUser) {
//       const currentNumber = parseInt(latestUser.empID.substring(4));
//       const nextNumber = currentNumber + 1;
//       newUserID = `KASP${nextNumber.toString().padStart(4, "0")}`;
//     } else {
//       newUserID = "KASP0001"; // Start from 1 if no user exists
//     }

//     const { file } = req;

//     const {
//       Email,
//       Password,
//       RoleID,
//       Account,
//       Gender,
//       FirstName,
//       MiddleName,
//       LastName,
//       DOB,
//       ContactNo,
//       EmployeeCode,
//       DepartmentID,
//       PositionID,
//       DateOfJoining,
//     } = req.body;

//     const newEmployee = new Employee({
//       empID: newUserID,
//       Email: Email,
//       Password: Password,
//       role: RoleID,
//       Account: Account,
//       Gender: Gender,
//       FirstName: FirstName,
//       MiddleName: MiddleName,
//       LastName: LastName,
//       DOB: DOB,
//       ContactNo: ContactNo,
//       EmployeeCode: EmployeeCode,
//       department: DepartmentID,
//       position: PositionID,
//       DateOfJoining: DateOfJoining,
//       profile: null,
//     });

//     if (
//       Email != "" &&
//       Password != "" &&
//       RoleID != "" &&
//       Account != "" &&
//       Gender != "" &&
//       FirstName != "" &&
//       DOB != "" &&
//       ContactNo != "" &&
//       EmployeeCode != " " &&
//       DepartmentID != "" &&
//       PositionID != "" &&
//       DateOfJoining != ""
//     ) {
//       if (ContactNo.length >= 10 && ContactNo.length <= 10) {
//         const findEmail = await Employee.findOne({ Email: Email });

//         if (findEmail) {
//           res.status(400).send("email is alredy exits");
//         } else {
//           const findContact = await Employee.findOne({ ContactNo: ContactNo });
//           if (findContact) {
//             res.status(400).send("Contact Number is alredy exits");
//           } else {
//             if (file) {
//               const response = await cloudinaryFileUploder(file.path);
//               if (response) {
//                 newEmployee.profile = response;
//               }
//             }
//             // hasing Employ password
//             await bcript.hash(
//               req.body.Password,
//               SALT_FECTOUR,
//               async (err, hash) => {
//                 if (err) {
//                   return res.status(400).send("Password is note Secure");
//                 } else {
//                   newEmployee.Password = hash;
//                   const savedEmployee = await Employee.create(newEmployee);

//                   // Create a new attendance record
//                   const currentYear = new Date().getFullYear();
//                   const currentMonth = new Date().getMonth() + 1;
//                   const currentDate = new Date().getDate();
//                   const currentDay = new Date().getDay();

//                   const newAttendance = new AttendanceModel({
//                     employeeObjID: savedEmployee._id, // Change UserObjID to employeeObjID
//                     years: [
//                       {
//                         year: currentYear,
//                         months: [
//                           {
//                             month: currentMonth,
//                             dates: [
//                               {
//                                 date: currentDate,
//                                 day: currentDay,
//                                 loginTime: [],
//                                 logoutTime: [],
//                                 breakTime: [],
//                                 breakTimeMs: [],
//                                 resumeTimeMS: [],
//                                 ResumeTime: [],
//                                 BreakData: [],
//                                 status: "",
//                                 totalBrake: "",
//                               },
//                             ],
//                           },
//                         ],
//                       },
//                     ],
//                   });

//                   console.log("newAttendance ====== ", newAttendance);

//                   // Save the attendance record
//                   const savedAttendance = await newAttendance.save();

//                   // Update the employee with the attendance record ID
//                   savedEmployee.attendanceObjID = savedAttendance._id;
//                   await savedEmployee.save();

//                   res.status(201).json({ employee: newEmployee });
//                 }
//               }
//             );
//           }
//         }
//       } else {
//         res.status(400).send("Enter Valid Contact Number");
//       }
//     } else {
//       res.status(400).send("plase file the all input faild");
//     }
//   } catch (err) {
//     res.status(403).send(err);
//   }
// };

const createEmployee = async (req, res) => {
  try {
    const latestUser = await Employee.findOne({ empID: /^KASP\d{4}$/ }).sort({
      empID: -1
    });
    let newUserID;
    if (latestUser) {
      const currentNumber = parseInt(latestUser.empID.substring(4));
      const nextNumber = currentNumber + 1;
      newUserID = `KASP${nextNumber.toString().padStart(4, "0")}`;
    } else {
      newUserID = "KASP0001"; // Start from 1 if no user exists
    }

    const { file } = req;
    const {
      Email,
      Password,
      RoleID,
      Account,
      Gender,
      FirstName,
      MiddleName,
      LastName,
      DOB,
      ContactNo,
      EmployeeCode,
      DepartmentID,
      PositionID,
      DateOfJoining
    } = req.body;
    const newEmployee = new Employee({
      empID: newUserID,
      Email: Email,
      Password: Password,
      role: RoleID,
      Account: Account,
      Gender: Gender,
      FirstName: FirstName,
      MiddleName: MiddleName,
      LastName: LastName,
      DOB: DOB,
      ContactNo: ContactNo,
      EmployeeCode: EmployeeCode,
      department: DepartmentID,
      position: PositionID,
      DateOfJoining: DateOfJoining,
      profile: null
    });

    if (
      Email != "" &&
      Password != "" &&
      RoleID != "" &&
      Account != "" &&
      Gender != "" &&
      FirstName != "" &&
      DOB != "" &&
      ContactNo != "" &&
      EmployeeCode != " " &&
      DepartmentID != "" &&
      PositionID != "" &&
      DateOfJoining != ""
    ) {
      if (ContactNo.length >= 10 && ContactNo.length <= 10) {
        const findEmail = await Employee.findOne({ Email: Email });

        if (findEmail) {
          console.log("hi");
          res.status(400).send("email is alredy exits");
        } else {
          const findContact = await Employee.findOne({ ContactNo: ContactNo });
          if (findContact) {
            console.log("hello");
            res.status(400).send("Contact Number is alredy exits");
          } else {
            if (file) {
              const response = await cloudinaryFileUploder(file.path);
              if (response) {
                newEmployee.profile = response;
              }
            }
            console.log("by");
            // hasing Employ password
            await bcript.hash(
              req.body.Password,
              SALT_FECTOUR,
              async (err, hash) => {
                if (err) {
                  return res.status(400).send("Password is note Secure");
                } else {
                  newEmployee.Password = hash;
                  const savedEmployee = await Employee.create(newEmployee);

                  // Create a new attendance record
                  const currentYear = new Date().getFullYear();
                  const currentMonth = new Date().getMonth() + 1;
                  const currentDate = new Date().getDate();
                  const currentDay = new Date().getDay();

                  const newAttendance = new AttendanceModel({
                    employeeObjID: savedEmployee._id, // Change UserObjID to employeeObjID
                    years: [
                      {
                        year: currentYear,
                        months: [
                          {
                            month: currentMonth,
                            dates: [
                              {
                                date: currentDate,
                                day: currentDay,
                                loginTime: [],
                                logoutTime: [],
                                breakTime: [],
                                breakTimeMs: [],
                                resumeTimeMS: [],
                                ResumeTime: [],
                                BreakData: [],
                                status: "",
                                totalBrake: ""
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  });

                  // Save the attendance record
                  const savedAttendance = await newAttendance.save();

                  // Update the employee with the attendance record ID
                  savedEmployee.attendanceObjID = savedAttendance._id;

                  await newEmployee.save();
                  res.send(newEmployee);
                }
              }
            );
          }
        }
      } else {
        res.status(400).send("Enter Valid Contact Number");
      }
    } else {
      res.status(400).send("plase file the all input faild");
    }
  } catch (err) {
    res.status(403).send(err);
  }
};

// find and update the city
const updateEmployee = async (req, res) => {
  const {
    Email,
    RoleID,
    Account,
    Gender,
    FirstName,
    MiddleName,
    LastName,
    DOB,
    ContactNo,
    EmployeeCode,
    DepartmentID,
    PositionID,
    DateOfJoining
  } = req.body;
  try {
    const findEmployee = await Employee.findById(req.params.id);
    if (!findEmployee) {
      return res.status(400).send("Employee not found");
    }

    let updatedEmployees = {
      Email: Email,
      Account: Account,
      role: RoleID,
      Gender: Gender,
      FirstName: FirstName,
      MiddleName: MiddleName,
      LastName: LastName,
      DOB: DOB,
      ContactNo: ContactNo,
      EmployeeCode: EmployeeCode,
      department: DepartmentID,
      position: PositionID,
      DateOfJoining: DateOfJoining,
      profile: findEmployee.profile // Default to existing profile
    };

    if (
      Email != "" &&
      RoleID != "" &&
      Account != "" &&
      Gender != "" &&
      FirstName != "" &&
      DOB != "" &&
      ContactNo != "" &&
      EmployeeCode != " " &&
      DepartmentID != "" &&
      PositionID != "" &&
      DateOfJoining != ""
    ) {
      if (ContactNo.length >= 10 && ContactNo.length <= 10) {
        const findContact = await Employee.findOne({ ContactNo: ContactNo });
        if (findContact && req.params.id != findContact._id) {
          return res.status(400).send("Contact Number is alredy Ragister");
        } else {
          if (req.file) {
            if (findEmployee.profile) {
              await removeCloudinaryImage(findEmployee.profile.publicId);
            }

            const uploadedProfile = await uplodeImagesCloudinary(req.file.path);
            if (uploadedProfile) {
              updatedEmployees.profile = uploadedProfile;
            }
          }
          // Update the employee record
          const updatedResult = await Employee.findByIdAndUpdate(
            req.params.id,
            updatedEmployees,
            { new: true }
          );
          res.status(200).send(updatedResult);
        }
      } else {
        return res.status(400).send("Enter valid Contact Number");
      }
    } else {
      return res.status(400).send("file The all input faild");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// find and delete the city
const deleteEmployee = async (req, res) => {};

module.exports = {
  getAllEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
