// const mongoose = require("mongoose");
// const { Task } = require("../models/taskModel");
// const { Employee } = require("../models/employeeModel");
// const cloudinary = require("cloudinary").v2;
// const { fileUploadMiddleware, chackFile } = require("../middleware/multer");
// const {
//   uplodeImagesCloudinary,
//   removeCloudinaryImage
// } = require("../cloudinary/cloudinaryFileUpload");
// // find all task
// const FindAllTask = async (req, res, next) => {
//   try {
//     const tasks = await Task.find();
//     res.status(200).json(tasks);
//   } catch (error) {
//     next(error); // Forward error to error handler middleware
//   }
// };

// // find the task
// const findTask = async (req, res, next) => {
//   try {
//     Task.find({}).then((data) => {
//       res.send({ status: "ok", data: data });
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // create a new task
// const CreateTask = async (req, res, next) => {
//   const { Taskname, Priority, description, department, managerEmail, comment, startDate, endDate, adminMail } = req.body;

//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   try {
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: "tasks", 
//       resource_type: "auto" 
//     });

//     const newTask = new Task({
//       Taskname,
//       Priority,
//       pdf: result.secure_url,
//       description,
//       department,
//       managerEmail,
//       comment: "Task Assigned",
//       duration: Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)),
//       adminMail,
//       status: "Assigned",
//       startDate,
//       endDate,
//       employee: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
//     });

//     await newTask.save();
//     res.status(201).json({ message: "Task created successfully", newTask });
//   } catch (error) {
//     next(error); // Forward error to error handler middleware
//   }
// };

// // POST TASK TO EMPLOYEE
// const CreateTaskEmployee = async (req, res, next) => {
//   const taskId = req.params.taskId;
//   try {
//     const task = await Task.findById(taskId);

//     if (!task) {
//       return res.status(404).json({ error: "Task not found" });
//     }

//     const employeesArray = req.body.employees;

//     if (!Array.isArray(employeesArray)) {
//       return res.status(400).json({ error: "Invalid data format" });
//     }

//     const newEmployees = [];

//     for (const employeeData of employeesArray) {
//       const { empname, empemail, empdesignation, emptaskStatus } = employeeData;

//       const existingEmployee = task.employees.find(
//         (employee) => employee.empemail === empemail
//       );

//       if (existingEmployee) {
//         throw new Error(`Duplicate empemail: ${empemail}`);
//       } else {
//         const newEmployee = {
//           empname,
//           empemail,
//           empdesignation,
//           emptaskStatus,
//         };
//         newEmployees.push(newEmployee);
//       }
//     }

//     task.employees.push(...newEmployees);
//     await task.save();

//     res.status(201).json(task);
//   } catch (error) {
//     if (error.message.includes("Duplicate empemail")) {
//       return res.status(400).json({ error: "Duplicate empemail found" });
//     }
//     next(error);
//   }
// };

// // Add Comment between Admin & Manager
// const UpdateTaskAdminManager = async (req, res, next) => {
//   const updateTask = req.body;
//   try {
//     const { status, comment } = req.body;

//     await Task.findByIdAndUpdate(req.params.taskId, updateTask);
//     const task = await Task.findById(req.params.taskId);

//     if (!task) {
//       return res.status(404).json({ message: "Task not found" });
//     }

//     let taskComment = comment || "";
//     task.status = status || task.status;
//     task.comment = taskComment;

//     await task.save();
//     res.status(200).json(task);
//   } catch (error) {
//     next(error);
//   }
// };

// // Add Comment between Manager & Employee
// const UpdateTaskAdminEmployee = async (req, res, next) => {
//   const { emptaskStatus, empTaskComment } = req.body;
//   const { empEmail, taskId } = req.params;

//   try {
//     const task = await Task.findOne({ _id: taskId });

//     if (!task) {
//       return res.status(404).json({ message: "Task not found" });
//     }

//     const employee = task.employees.find((emp) => emp.empemail === empEmail);

//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     employee.emptaskStatus = emptaskStatus;
//     employee.empTaskComment = empTaskComment;

//     await task.save();

//     res.json({ message: "Task updated successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = {
//   FindAllTask,
//   findTask,
//   CreateTask,
//   CreateTaskEmployee,
//   UpdateTaskAdminManager,
//   UpdateTaskAdminEmployee
// };





const mongoose = require("mongoose");
const { Task } = require("../models/taskModel");
const { Employee } = require("../models/employeeModel");

// find all task
const FindAllTask = async (req, res) => {
  try {
   
    const tasks = await Task.find()
    .populate({
      path: 'managerEmail',         // Populate the managerEmail field
      select: 'Email Account profile -_id'  // Fields to include from the Employee model
    })
    .populate({
      path: 'adminMail',            // Populate the adminMail field
      select: 'Email Account profile -_id'  // Fields to include from the Employee model
    })
    .populate({
      path: 'employees.employee',   // Populate the employee field inside the employees array
      select: 'Email  FirstName LastName profile -_id' ,
      populate:{
        path: "position",
        select: "PositionName -_id"
      } // Fields to include from the Employee model
    }); // Converts the result to plain JavaScript objects, not Mongoose documents

    res.status(200).json(tasks);
  } catch (error) {
    console.error("eroro" , error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// find the task
const findTask = async (req, res) => {
  try {
    Task.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {}
};

const day = new Date();
const date = day.getDate();
const month = day.getMonth() + 1; // Add 1 to get correct month
const year = day.getFullYear();

// create a new task
const CreateTask = async (req, res) => {
  const { Taskname } = req.body;
  const { Priority } = req.body;
  const { path } = req.file;
  const { description } = req.body;
  const { department } = req.body;
  const { managerEmail } = req.body;
  const { comment } = req.body;
  const { duration } = req.body;
  const { status } = req.body;
  const { startDate } = req.body;
  const { endDate } = req.body;
  const { adminMail } = req.body;
  
  const dateDifference = Math.ceil(
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
  );
  const managerId = await Employee.find({Email: managerEmail}).select("_id")

  const extradate = dateDifference;
  const newPdf = new Task({
    Taskname: Taskname,
    Priority: Priority,
    pdf: path,
    description: description,
    department: department,
    managerEmail: managerId[0],
    comment: "Task Assigned",
    duration: extradate,
    adminMail,
    status: "Assigned",
    startDate: startDate,
    endDate: endDate,
    employee: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }]
  });

  // console.log(Taskname, path, description, department, managerEmail, comment, duration, status, startDate, endDate);
  try {
    // await PdfSchema.create({ title: title, pdf: fileName });
    await newPdf.save();
    res.status(201).json({
      message: "Task Created successfully"
    });
    // res.send({ status: "ok", data: newPdf });
  } catch (error) {
    res.status(400).send(error);
    // res.json({ status: error });
  }
};

// POST TASK TO EMPLOYEE
const CreateTaskEmployee = async (req, res) => {
  const taskId = req.params.taskId;
  try {
    const task = await Task.findById(taskId);
 

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const employeesArray = req.body.employees;

    if (!Array.isArray(employeesArray)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    const newEmployees = [];

    for (const employeeData of employeesArray) {
      const { empname, empemail, empdesignation, empTaskStatus } = employeeData;
   
      // Check if empemail already exists in the task's employees array
      const existingEmployee = task.employees.find(
        (employee) => employee.empemail === empemail
      );

      if (existingEmployee) {
     
        // If the employee already exists, throw an error or handle it accordingly
        throw new Error(`Duplicate empemail: ${empemail}`);
      } else {
       
        // Create a new employee object and add it to the array
        const empId = await Employee.find({Email: empemail}).select("_id")
        const newEmployee = {employee:empId[0],empTaskStatus:empTaskStatus,};
        newEmployees.push(newEmployee);
      }
    }

    // Add the new employees to the task's employees array
    task.employees.push(...newEmployees);

    // Save the updated task
    await task.save();

    // Respond with the updated task
    res.status(201).json(task);
  } catch (error) {
    console.error(error.message);

    // Check if the error is due to a duplicate empemail
    if (error.message.includes("Duplicate empemail")) {
      return res
        .status(400)
        .json({ error: "Duplicate empemail found in the request" });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add Comment between Admin & Manager
const UpdateTaskAdminManager = async (req, res) => {
  const updateTask = req.body;
  try {
    const { status, comment } = req.body;

    await Task.findByIdAndUpdate(req.params.taskId, updateTask);
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    let taskComment = comment || "";
    task.status = status || task.status;
    task.comment = taskComment;

    await task.save();
    res.status(200).json(task);

     } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add Comment between Manager & Employee
const UpdateTaskAdminEmployee = async (req, res) => {
  const { empTaskStatus, empTaskComment } = req.body;
  const { empEmail, taskId } = req.params; // Ensure empEmail and taskId are strings

  

  try {
    // Find the task by ID and populate only the 'Email' field from the employee reference
    const task = await Task.findOne({ _id: taskId }).populate({
      path: 'employees.employee',  // Path to the employee reference
      select: 'Email'  // Ensure only 'Email' is populated
    });
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Find the specific employee by 'Email' and make sure the data type matches
    const employee = task.employees.find((emp) => emp.employee.Email === empEmail);



    if (!employee) {
      return res.status(404).json({ message: "Employee not found in the task" });
    }

    // Update the employee's task status and comment
    employee.empTaskStatus = empTaskStatus;
    employee.empTaskComment = empTaskComment;

    // Save the updated task
    await task.save();

    res.json({ message: "Task updated successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error" });
  }
};



module.exports = {
  FindAllTask,
  findTask,
  CreateTask,
  CreateTaskEmployee,
  UpdateTaskAdminManager,
  UpdateTaskAdminEmployee
};



