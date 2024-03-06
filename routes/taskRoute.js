const express = require("express");
const {
  FindAllTask,
  CreateTask,
  UpdateTaskAdminEmployee,
  UpdateTaskAdminManager,
  CreateTaskEmployee,
  findTask
} = require("../controllers/taskController");
// const { upload, ChackTaskFile } = require("../middleware/taskImageMulter");

const taskRoute = express.Router();

taskRoute.get("/tasks", FindAllTask);
// taskRoute.get("/getTask", findTask);
// taskRoute.post("/tasks", ChackTaskFile, upload.single("file"), CreateTask); // create task  in admin
taskRoute.post("/tasks/:taskId/employees", CreateTaskEmployee); //
taskRoute.put("/tasks/:taskId", UpdateTaskAdminManager); // update tsk admin and Manager
taskRoute.put("/tasks/:taskId/employees/:empEmail", UpdateTaskAdminEmployee);

module.exports = { taskRoute };
