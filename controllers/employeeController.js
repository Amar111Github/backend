// const { Employee } = require("../models/employeeModel");
// const bcript = require("bcrypt");

// const {
//   cloudinaryFileUploder,
//   removeCloudinaryImage,
//   uplodeImagesCloudinary
// } = require("../cloudinary/cloudinaryFileUpload");
// const { AttendanceModel } = require("../models/attendanceModel");

// const SALT_FECTOUR = 10;


// const getAllEmployee = async (req, res, next) => {
//   try {
//     const employees = await Employee.find()
//       .populate({
//         path: "role position department"
//       })
//       .select("-salary -education -familyInfo -workExperience -Password");

//     res.status(200).json(employees);
//   } catch (err) {
//     next(err); // Pass error to error-handling middleware
//   }
// };


// const createEmployee = async (req, res) => {
//   try {
//     const latestUser = await Employee.findOne({ empID: /^s\d{4}$/ }).sort({
//       empID: -1
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
//       LastName,
//       DOB,
//       ContactNo,
//       EmployeeCode,
//       DepartmentID,
//       PositionID,
//       DateOfJoining,
//       reportManager,
//       reportHr,
//       status,
//       loginStatus
//     } = req.body;
//     const newEmployee = new Employee({
//       empID: newUserID,
//       Email: Email,
//       Password: Password,
//       role: RoleID,
//       Account: Account,
//       Gender: Gender,
//       FirstName: FirstName,
//       reportManager: reportManager,
//       reportHr: reportHr,
//       LastName: LastName,
//       DOB: DOB,
//       ContactNo: ContactNo,
//       EmployeeCode: EmployeeCode,
//       department: DepartmentID,
//       position: PositionID,
//       DateOfJoining: DateOfJoining,
//       profile: null,
//       status,
//       loginStatus
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
//                                 totalBrake: ""
//                               }
//                             ]
//                           }
//                         ]
//                       }
//                     ]
//                   });

//                   // Save the attendance record
//                   const savedAttendance = await newAttendance.save();

//                   // Update the employee with the attendance record ID
//                   savedEmployee.attendanceObjID = savedAttendance._id;

//                   await newEmployee.save();
//                   res.send(newEmployee);
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

// // find and update the city
// const updateEmployee = async (req, res) => {
//   const {
//     Email,
//     RoleID,
//     Account,
//     Gender,
//     FirstName,
//     LastName,
//     DOB,
//     ContactNo,
//     EmployeeCode,
//     DepartmentID,
//     PositionID,
//     DateOfJoining,
//     reportManager,
//     status
//   } = req.body;
//   try {
//     const findEmployee = await Employee.findById(req.params.id);
//     if (!findEmployee) {
//       return res.status(400).send("Employee not found");
//     }

//     let updatedEmployees = {
//       Email: Email,
//       Account: Account,
//       role: RoleID,
//       Gender: Gender,
//       FirstName: FirstName,
//       LastName: LastName,
//       DOB: DOB,
//       ContactNo: ContactNo,
//       EmployeeCode: EmployeeCode,
//       department: DepartmentID,
//       position: PositionID,
//       DateOfJoining: DateOfJoining,
//       reportManager: reportManager,
//       profile: findEmployee.profile,
//       status: status // Default to existing profile
//     };

//     if (
//       Email != "" &&
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
//         const findContact = await Employee.findOne({ ContactNo: ContactNo });
//         if (findContact && req.params.id != findContact._id) {
//           return res.status(400).send("Contact Number is alredy Ragister");
//         } else {
//           if (req.file) {
//             if (findEmployee.profile) {
//               await removeCloudinaryImage(findEmployee.profile.publicId);
//             }

//             const uploadedProfile = await uplodeImagesCloudinary(req.file.path);
//             if (uploadedProfile) {
//               updatedEmployees.profile = uploadedProfile;
//             }
//           }
//           // Update the employee record
//           const updatedResult = await Employee.findByIdAndUpdate(
//             req.params.id,
//             updatedEmployees,
//             { new: true }
//           );
//           res.status(200).send(updatedResult);
//         }
//       } else {
//         return res.status(400).send("Enter valid Contact Number");
//       }
//     } else {
//       return res.status(400).send("file The all input faild");
//     }
//   } catch (error) {
//     res.status(500).send("Internal Server Error");
//   }
// };


// // find and delete the city
// const deleteEmployee = async (req, res, next) => {
//   try {
//     const employeeId = req.params.id;
//     const deletedEmployee = await Employee.findByIdAndDelete(employeeId);
    
//     if (!deletedEmployee) {
//       return res.status(404).send("Employee not found");
//     }
    
//     // Optionally, delete associated attendance records here if necessary
    
//     res.status(200).send("Employee successfully deleted");
//   } catch (error) {
//     next(error); // Pass error to error-handling middleware
//   }
// };
// const upcomingBirthDay = async (req, res, next) => {
//   try {
//     const employees = await Employee.find();

//     // Get today's date
//     const today = new Date();
//     const currentMonth = today.getMonth();
//     const currentDay = today.getDate();

//     // Filter employees with birthdays in the upcoming week
//     const upcomingBirthdays = employees.filter(employee => {
//       const dob = new Date(employee.DOB);
//       return dob.getMonth() === currentMonth && (dob.getDate() - currentDay) >= 0 && (dob.getDate() - currentDay) <= 7;
//     });

//     const response = upcomingBirthdays.map(employee => ({
//       FirstName: employee.FirstName,
//       LastName: employee.LastName,
//       DOB: employee.DOB
//     }));

//     res.status(200).json(response);
//   } catch (error) {
//     next(error); // Pass error to error-handling middleware
//   }
// };

// const findParticularEmployee = async (req, res, next) => {
//   const id = req.params.id;

//   try {
//     const findEmployee = await Employee.findById(id);
//     if (findEmployee) {
//       return res.status(200).send(findEmployee);
//     } else {
//       return res.status(404).send("Employee not found");
//     }
//   } catch (error) {
//     next(error); // Pass error to error-handling middleware
//   }
// };

// const notificationStatusUpdate = async (req, res, next) => {
//   const id = req.params.id;
//   const { email } = req.body;

//   try {
//     const findEmployee = await Employee.findOne({ Email: email });

//     if (findEmployee) {
//       const notificationIndex = findEmployee.Notification.findIndex(
//         (notification) => notification.taskId === id
//       );

//       if (notificationIndex !== -1) {
//         findEmployee.Notification[notificationIndex].status = "seen";
//         findEmployee.markModified("Notification");
//         await findEmployee.save();
//         res.status(200).json({
//           message: "Notification status updated to seen",
//           result: findEmployee
//         });
//       } else {
//         res.status(404).json({
//           message: "Notification not found with the specified id"
//         });
//       }
//     } else {
//       res.status(404).json({
//         message: "User not found with the specified email"
//       });
//     }
//   } catch (error) {
//     next(error); // Pass error to error-handling middleware
//   }
// };

// const employeeLoginStatusUpdate = async (req, res, next) => {
//   const { email } = req.body;
  
//   try {
//     const findEmployee = await Employee.findOne({ Email: email });

//     if (findEmployee) {
//       findEmployee.loginStatus = "loggedIn";
//       findEmployee.markModified("loginStatus");
//       await findEmployee.save();
//       res.status(200).json({
//         message: "Login status updated to LoggedIn"
//       });
//     } else {
//       res.status(404).json({
//         message: "User not found with the specified email"
//       });
//     }
//   } catch (error) {
//     next(error); // Pass error to error-handling middleware
//   }
// };

// const employeeLogoutStatusUpdate = async (req, res, next) => {
//   const { email } = req.body;
  
//   try {
//     const findEmployee = await Employee.findOne({ Email: email });

//     if (findEmployee) {
//       findEmployee.loginStatus = "loggedOut";
//       findEmployee.markModified("loginStatus");
//       await findEmployee.save();
//       res.status(200).json({
//         message: "Employee status updated to loggedOut"
//       });
//     } else {
//       res.status(404).json({
//         message: "User not found with the specified email"
//       });
//     }
//   } catch (error) {
//     next(error); // Pass error to error-handling middleware
//   }
// };

// const deleteNotification = async (req, res, next) => {
//   const id = req.params.id;
//   const { email } = req.body;
  
//   try {
//     const findEmployee = await Employee.findOne({ Email: email });

//     if (findEmployee) {
//       const notificationIndex = findEmployee.Notification.findIndex(
//         (notification) => notification.taskId === id
//       );

//       if (notificationIndex !== -1) {
//         findEmployee.Notification.splice(notificationIndex, 1);
//         findEmployee.markModified("Notification");
//         await findEmployee.save();
//         res.status(200).json({
//           message: "Notification deleted successfully",
//           result: findEmployee
//         });
//       } else {
//         res.status(404).json({
//           message: "Notification not found with the specified id"
//         });
//       }
//     } else {
//       res.status(404).json({
//         message: "User not found with the specified email"
//       });
//     }
//   } catch (error) {
//     next(error); // Pass error to error-handling middleware
//   }
// };
// const multiSelectedDeleteNotification = async (req, res, next) => {
//   const { employeeMail, tasks } = req.body;

//   try {
//     const findEmployee = await Employee.findOne({ Email: employeeMail });

//     if (findEmployee) {
//       const filteredObjectsArray = findEmployee.Notification.filter(
//         (obj) => !tasks.includes(obj.taskId)
//       );

//       findEmployee.Notification = filteredObjectsArray;
//       findEmployee.markModified("Notification");
//       await findEmployee.save();
//       res.status(200).json({
//         message: "Notifications deleted successfully",
//         result: findEmployee
//       });
//     } else {
//       res.status(404).json({
//         message: "User not found with the specified email"
//       });
//     }
//   } catch (error) {
//     next(error); // Pass error to error-handling middleware
//   }
// };

// const selectedDeleteNotification = async (req, res, next) => {
//   const { email } = req.body;
  
//   try {
//     const findEmployee = await Employee.findOne({ Email: email });
    
//     if (findEmployee) {
//       findEmployee.Notification = [];
//       findEmployee.markModified("Notification");
//       await findEmployee.save();
//       res.status(200).json({
//         message: "Notifications cleared successfully",
//         result: findEmployee
//       });
//     } else {
//       res.status(404).json({
//         message: "User not found with the specified email"
//       });
//     }
//   } catch (error) {
//     next(error); // Pass error to error-handling middleware
//   }
// };

// const getEmployeeByStatus = async (req, res, next) => {
//   const { status, email } = req.body;

//   try {
//     if (status === "employee") {
//       const manager = await Employee.find({
//         $or: [{ Account: 4 }, { Account: 1 }, { Account: 2 }]
//       }).select("Email");
//       const employee = await Employee.find({ Email: email }).select("reportManager reportHr");
//       const mails = manager.filter(val => val.Email !== employee[0].reportManager && val.Email !== employee[0].reportHr);
      
//       res.status(200).send(mails);
//     } else if (status === "manager" || status === "hr") {
//       const manager = await Employee.find({ $or: [{ Account: 1 }] }).select("Email");
//       const employee = await Employee.find({ Email: email }).select("reportManager reportHr");
//       const mails = manager.filter(val => val.Email !== employee[0].reportManager && val.Email !== employee[0].reportHr);
      
//       res.status(200).send(mails);
//     } else {
//       res.status(400).json({ message: "Invalid status parameter" });
//     }
//   } catch (error) {
//     next(error); // Pass error to error-handling middleware
//   }
// };
// const getAllEmployeeByStatus = async (req, res, next) => {
//   const { status, email } = req.body;

//   try {
//     if (status === "employee") {
//       const employee = await Employee.find({ Email: email }).select("reportManager");
//       const reportManager = employee[0].reportManager;
//       let managers = await Employee.find({
//         $or: [{ Account: 4 }, { Account: 1 }, { Account: 2 }]
//       }).select("Email");

//       managers = managers.filter(manager => manager.Email !== reportManager);
      
//       res.status(200).send({ reportManager, managers });
//     } else if (status === "manager" || status === "hr") {
//       const employee = await Employee.find({ Email: email }).select("reportManager");
//       let managers = await Employee.find({ $or: [{ Account: 1 }] }).select("Email");

//       const reportManager = employee[0].reportManager;
//       managers = managers.filter(manager => manager.Email !== reportManager);
      
//       res.status(200).send({ reportManager, managers });
//     } else {
//       res.status(400).json({ message: "Invalid status parameter" });
//     }
//   } catch (error) {
//     next(error); // Pass error to error-handling middleware
//   }
// };




// const employeeByDepartment = async (req, res, next) => {
//   try {
//     const allEmp = await Employee.find({ status: "active", $or: [{ Account: 2 }, { Account: 4 }] })
//       .select("department Email FirstName LastName Account position profile")
//       .populate("department position");
    
//     const department = {};

//     allEmp.forEach((val) => {
//       if (department[val.department[0].DepartmentName]) {
//         department[val.department[0].DepartmentName].push(val);
//       } else {
//         department[val.department[0].DepartmentName] = [val];
//       }
//     });

//     res.status(200).send(department);
//   } catch (error) {
//     next(error); // Pass error to error-handling middleware
//   }
// };


// const EmployeeTeam = async (req, res, next) => {
//   try {
//     const { email } = req.body;

//     // Validate input
//     if (!email) {
//       return res.status(400).json({ error: 'Reporting manager email is required' });
//     }

//     // Query to find employees whose reportingManager email matches the provided email
//     const employees = await Employee.find({ $or: [{ reportManager: email }, { reportHr: email }] })
//       .populate({
//         path: "position"
//       })
//       .select("profile FirstName LastName empID Account status Email ContactNo loginStatus");

//     // Check if employees were found
//     if (employees.length === 0) {
//       return res.status(404).json({ message: 'No employees found with the provided reporting manager email' });
//     }

//     // Send the found employees as response
//     res.status(200).json(employees);
//   } catch (error) {
//     console.error('Error fetching employees:', error);
//     next(error); // Pass error to error-handling middleware
//   }
// };

// module.exports = {
//   employeeByDepartment,
//   getEmployeeByStatus,
//   EmployeeTeam,
//   getAllEmployeeByStatus,
//   getAllEmployee,
//   upcomingBirthDay,
//   createEmployee,
//   updateEmployee,
//   deleteEmployee,
//   findParticularEmployee,
//   selectedDeleteNotification,
//   deleteNotification,
//   notificationStatusUpdate,
//   multiSelectedDeleteNotification,
//   employeeLogoutStatusUpdate,
//   employeeLoginStatusUpdate
// };




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

const createEmployee = async (req, res) => {
  try {
    const latestUser = await Employee.findOne({ empID: /^UPBS\d{4}$/ }).sort({
      empID: -1
    });
    let newUserID;
    if (latestUser) {
      const currentNumber = parseInt(latestUser.empID.substring(4));
      const nextNumber = currentNumber + 1;
      newUserID = `UPBS${nextNumber.toString().padStart(4, "0")}`;
    } else {
      newUserID = "UPBS0001"; // Start from 1 if no user exists
    }

    const { file } = req;
   
    const {
      Email,
      Password,
      RoleID,
      Account,
      Gender,
      FirstName,
      LastName,
      DOB,
      ContactNo,
      EmployeeCode,
      DepartmentID,
      PositionID,
      DateOfJoining,
      reportManager,
      reportHr,
      status,
      loginStatus
    } = req.body;
    const newEmployee = new Employee({
      empID: newUserID,
      Email: Email,
      Password: Password,
      role: RoleID,
      Account: Account,
      Gender: Gender,
      FirstName: FirstName,
      reportManager: reportManager,
      reportHr: reportHr,
      LastName: LastName,
      DOB: DOB,
      ContactNo: ContactNo,
      EmployeeCode: EmployeeCode,
      department: DepartmentID,
      position: PositionID,
      DateOfJoining: DateOfJoining,
      profile: null,
      status,
      loginStatus
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
         
          res.status(400).send("email is alredy exits");
        } else {
          const findContact = await Employee.findOne({ ContactNo: ContactNo });
          if (findContact) {
          
            res.status(400).send("Contact Number is alredy exits");
          } else {
            if (file) {
              const response = await cloudinaryFileUploder(file.path);
              if (response) {
                newEmployee.profile = response;
              }
            }
          
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
    LastName,
    DOB,
    ContactNo,
    EmployeeCode,
    DepartmentID,
    PositionID,
    DateOfJoining,
    reportManager,
    status
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
      LastName: LastName,
      DOB: DOB,
      ContactNo: ContactNo,
      EmployeeCode: EmployeeCode,
      department: DepartmentID,
      position: PositionID,
      DateOfJoining: DateOfJoining,
      reportManager: reportManager,
      profile: findEmployee.profile,
      status: status // Default to existing profile
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
const upcomingBirthDay = async (req, res) => {
  const employee = await Employee.find();

  employee.forEach((data) => {
    let temp = {
      data,
      FirstName: data["FirstName"],
      LastName: data["LastName"],
      DOB: data["DOB"]
    };

    // Use set function to update state
  });
};
const findParticularEmployee = async (req, res) => {
  const id = req.params.id;

  try {
    const findEmployee = await Employee.findById({ _id: id });
    if (findEmployee) {
      return res.status(200).send(findEmployee);
    } else {
      return res.status(400).send("Employee not found");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
const userData = async (req, res) => {
  const id = req.params.id;

  try {
    const findEmployee = await Employee.findById({ _id: id }, "Email Account FirstName LastName Notification");

    if (findEmployee) {
      return res.status(200).send(findEmployee);
    } else {
      return res.status(400).send("Employee not found");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
const notificationStatusUpdate = async (req, res) => {
  const id = req.params.id;
  const { email } = req.body;
 
  try {
    const findEmployee = await Employee.findOne({ Email: email });
 
    if (findEmployee) {
      const notificationIndex = findEmployee.Notification.findIndex(
        (notification) => notification.taskId === id
      );

      
      if (notificationIndex !== -1) {
        findEmployee.Notification[notificationIndex].status = "seen";
        findEmployee.markModified("Notification");
        await findEmployee.save();
        res.status(200).json({
          message: "Notification status updated to seen",
          result: findEmployee
        });
      } else {
        res.status(404).json({
          message: "Notification not found with the specified id"
        });
      }
    } else {
      res.status(404).json({
        message: "User not found with the specified email"
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const employeeLoginStatusUpdate = async (req, res) => {
  const { email } = req.body;
  try {
    const findEmployee = await Employee.findOne({ Email: email });

    if (findEmployee) {
      findEmployee.loginStatus = "loggedIn";
      findEmployee.markModified("loginStatus");
      await findEmployee.save();
      res.status(200).json({
        message: "Notification status updated to LoggedIn"
      });
    } else {
      res.status(404).json({
        message: "User not found with the specified email"
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const employeeLogoutStatusUpdate = async (req, res) => {
  const { email } = req.body;
  try {
    const findEmployee = await Employee.findOne({ Email: email });

    if (findEmployee) {
      findEmployee.loginStatus = "loggedOut";
      findEmployee.markModified("loginStatus");
      await findEmployee.save();
      res.status(200).json({
        message: "Notification status updated to loggedOut"
      });
    } else {
      res.status(404).json({
        message: "User not found with the specified email"
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const deleteNotification = async (req, res) => {
  const id = req.params.id;
  const { email } = req.body;
  try {
    const findEmployee = await Employee.findOne({ Email: email });
   
    if (findEmployee) {
      const notificationIndex = findEmployee.Notification.findIndex(
        (notification) => notification.taskId === id
      );

     
      if (notificationIndex !== -1) {
        findEmployee.Notification.splice(notificationIndex, 1);
        findEmployee.markModified("Notification");
        await findEmployee.save();
        res.status(200).json({
          message: "Notification status updated to seen",
          result: findEmployee
        });
      } else {
        res.status(404).json({
          message: "Notification not found with the specified id"
        });
      }
    } else {
      res.status(404).json({
        message: "User not found with the specified email"
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const multiSelectedDeleteNotification = async (req, res) => {
  const { employeeMail, tasks } = req.body;

  try {
    const findEmployee = await Employee.findOne({ Email: employeeMail });


    if (findEmployee) {
      const filteredObjectsArray = findEmployee.Notification.filter(
        (obj) => !tasks.includes(obj.taskId)
      );

      findEmployee.Notification = filteredObjectsArray;
      findEmployee.markModified("Notification");
      await findEmployee.save();
      res.status(200).json({
        message: "Notification status updated to seen",
        result: findEmployee
      });

    } else {
      res.status(404).json({
        message: "User not found with the specified email"
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const selectedDeleteNotification = async (req, res) => {
  const { email } = req.body;
  try {
    const findEmployee = await Employee.findOne({ Email: email });
    if (findEmployee) {
      findEmployee.Notification = [];
      findEmployee.markModified("Notification");
      await findEmployee.save();
      res.status(200).json({
        message: "Notification status updated to seen",
        result: findEmployee
      });
    } else {
      res.status(404).json({
        message: "User not found with the specified email"
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const getEmployeeByStatus = async (req, res)=>{
  const {status, email} = req.body;

  if(status==="employee"){
    const manager = await Employee.find({
      $or: [{ Account: 4 }, { Account: 1 },{ Account: 2 }]
    }).select("Email");
    const employee = await Employee.find({ Email: email }).select("reportManager reportHr");
    const mails = manager.filter((val)=> val.Email !==employee[0].reportManager  && val.Email !==employee[0].reportHr)
   
    res.status(200).send(mails)
  }else if(status==="manager" || status ==="hr"){

    const manager = await Employee.find({
      $or: [{ Account: 1 }]
    }).select("Email");
  
    const employee = await Employee.find({ Email: email }).select("reportManager reportHr");
    const mails = manager.filter((val)=> val.Email !==employee[0]?.reportManager  && val.Email !==employee[0]?.reportHr)
   
    res.status(200).send(mails)
  }
}
const getAllEmployeeByStatus = async (req, res) => {
  const { status, email } = req.body;

  if (status === "employee") {
    const employee = await Employee.find({ Email: email }).select("reportManager");
    const reportManager = employee[0].reportManager;
    let managers = await Employee.find({
      $or: [{ Account: 4 }, { Account: 1 }, { Account: 2 }]
    }).select("Email");

    // Remove the reportManager email from the managers list
    managers = managers.filter(manager => manager.Email !== reportManager);
    
    res.status(200).send({ reportManager, managers });
  } else if (status === "manager" || status === "hr") {
    const employee = await Employee.find({ Email: email }).select("reportManager");
    let managers = await Employee.find({
      $or: [{ Account: 1 }]
    }).select("Email");

    // Remove the reportManager email from the managers list
    const reportManager = employee[0].reportManager;
    managers = managers.filter(manager => manager.Email !== reportManager);

    res.status(200).send({ reportManager, managers });
  }
};



const employeeByDepartment = async (req,res)=>{
  try {
    const allEmp = await Employee.find({status:"active", $or:[{Account:2}, {Account:4}]}).select("department Email FirstName LastName Account position profile").populate("department position")
    const department = {
     
    }

    allEmp.forEach((val)=>{
      console.log(department[val.department[0].DepartmentName])
     if(department[val.department[0].DepartmentName]){
      department[val.department[0].DepartmentName].push(val)
     }else{
      department[val.department[0].DepartmentName]=[val]
     }
    })
    res.status(200).send(department);
  } catch (error) {
    res.status(500).send(error);
  }

 }

const EmployeeTeam =  async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ error: 'Reporting manager email is required' });
    }

    // Query to find employees whose reportingManager email matches the provided email
    const employees = await Employee.find({$or:[{reportManager: email},{reportHr: email}]  })   // .populate({ path: "city", populate: { path: "state" } ,populate: { populate: { path: "country" } } })
    .populate({
      path: "position"
 
    })

    .select("profile FirstName LastName empID Account status Email ContactNo loginStatus");

    // Check if employees were found
    if (employees.length === 0) {
      return res.status(404).json({ message: 'No employees found with the provided reporting manager email' });
    }

    // Send the found employees as response
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const verifyAccount = async (req, res) => {
  try {
    const { _id, Account } = req.body;

    // Find employee by ID
    const emp = await Employee.findOne({ _id });
    
    // If employee is not found
    if (!emp) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // If account does not match
    if (emp.Account !== Account) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }

    // If everything is correct (authorized access)
    return res.status(200).json({ message: "Authorized Access" });

  } catch (error) {
    // Catch any server errors
    return res.status(500).json({ error: "Server error" });
  }
}
module.exports = {
  employeeByDepartment,
  getEmployeeByStatus,
  verifyAccount,
  EmployeeTeam,
  getAllEmployeeByStatus,
  getAllEmployee,
  upcomingBirthDay,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  findParticularEmployee,
  selectedDeleteNotification,
  deleteNotification,
  userData,
  notificationStatusUpdate,
  multiSelectedDeleteNotification,
  employeeLogoutStatusUpdate,
  employeeLoginStatusUpdate
};


