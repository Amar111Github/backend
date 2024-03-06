const mongoose = require("mongoose");
const { Task } = require("../models/taskModel");
const { Employee } = require("../models/employeeModel");

// find all task
const FindAllTask = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
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
  const { path } = req.file;
  const { description } = req.body;
  const { department } = req.body;
  const { managerEmail } = req.body;
  const { comment } = req.body;
  const { duration } = req.body;
  const { status } = req.body;
  const { startDate } = req.body;
  const { endDate } = req.body;

  const dateDifference = Math.ceil(
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
  );
  const extradate = dateDifference;
  const newPdf = new Task({
    Taskname: Taskname,
    pdf: path,
    description: description,
    department: department,
    managerEmail: managerEmail,
    comment: "Task Assigned",
    duration: extradate,
    status: "Assigned",
    startDate: startDate,
    endDate: endDate,
    employee: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }]
  });
  console.log("newPdf ====", newPdf);

  // console.log(Taskname, path, description, department, managerEmail, comment, duration, status, startDate, endDate);
  try {
    // await PdfSchema.create({ title: title, pdf: fileName });

    await newPdf.save();
    res.status(201).json({
      message: "ok"
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
      const { empname, empemail, empdesignation, emptaskStatus } = employeeData;

      // Check if empemail already exists in the task's employees array
      const existingEmployee = task.employees.find(
        (employee) => employee.empemail === empemail
      );

      if (existingEmployee) {
        console.log("Employee with email already exists:", empemail);
        // If the employee already exists, throw an error or handle it accordingly
        throw new Error(`Duplicate empemail: ${empemail}`);
      } else {
        console.log("Creating new employee:", empemail);
        // Create a new employee object and add it to the array
        const newEmployee = {
          empname,
          empemail,
          empdesignation,
          emptaskStatus
        };
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

    console.log("task-----1", task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add Comment between Manager & Employee
const UpdateTaskAdminEmployee = async (req, res) => {
  const { emptaskStatus, empTaskComment } = req.body;
  const { empEmail } = req.params;
  const { taskId } = req.params;

  try {
    // Find the task by employee email
    const task = await Task.findOne({ _id: taskId });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Find the specific employee in the task
    const employee = task.employees.find((emp) => emp.empemail === empEmail);

    if (!employee) {
      return res
        .status(404)
        .json({ message: "Employee not found in the task" });
    }

    // Update the employee's task status and comment
    employee.emptaskStatus = emptaskStatus;
    employee.empTaskComment = empTaskComment;

    // Save the updated task
    await task.save();
    console.log(task);
    res.json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
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
