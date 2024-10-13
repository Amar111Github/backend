const express = require("express");
const {
  FindAllTask,
  CreateTask,
  UpdateTaskAdminEmployee,
  UpdateTaskAdminManager,
  CreateTaskEmployee,
  findTask
} = require("../controllers/taskController");
const { upload, checkFileSize } = require("../middleware/multer");
const {verifyAdmin,verifyAll,verifyManager} = require('../middleware/rbacMiddleware');

const taskRoute = express.Router();

taskRoute.get("/tasks",verifyAll,FindAllTask); //task view admin,hr,employee,manager
// taskRoute.get("/getTask", findTask);
taskRoute.post("/tasks",verifyAdmin,checkFileSize,upload.single("file"), CreateTask); // create task  in admin
taskRoute.post("/tasks/:taskId/employees",verifyManager, CreateTaskEmployee); //
taskRoute.put("/tasks/:taskId",verifyAll,UpdateTaskAdminManager); // update tsk admin and Manager
taskRoute.put("/tasks/:taskId/employees/:empEmail",UpdateTaskAdminEmployee);

module.exports = { taskRoute };
