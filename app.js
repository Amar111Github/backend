var express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);

require("dotenv").config();

// acss the shows bdf file backend
app.use("/files", express.static("files"));

// custom  Routes import file
const loginRoute = require("./routes/loginRoute");
const contery = require("./routes/countryRoutes");
const stateRoute = require("./routes/stateRoute");
const cityRoute = require("./routes/cityRoute");
const companyRoute = require("./routes/companyRoute");
const departmentRoute = require("./routes/departmentRoute");
const roleRoute = require("./routes/roleRoute");
const positionRoute = require("./routes/positionRoute");
const employeeRoute = require("./routes//familyRoute");
const familyRoute = require("./routes/employeeRoute");
const workExperienceRoute = require("./routes//workExperienceRoute");
const portalRoute = require("./routes/portalRoute");
const projectRoute = require("./routes/projectRoute");
const salaryRoute = require("./routes/salaryRoute");
const leaveRoute = require("./routes/leaveRoute");
const educationRoute = require("./routes/educationRoute");
const personalInfoRoute = require("./routes/personalInfoRoute");
const { forgotePassRoute } = require("./routes/forgotePassRoute");
const { taskRoute } = require("./routes/taskRoute");
const { attendanceRoute } = require("./routes/attendanceRoute");
const { type } = require("joi/lib/types/object");
const { Employee } = require("./models/employeeModel");
const { Task } = require("./models/taskModel");
const { fileUploadMiddleware, chackFile } = require("./middleware/multer");
const {
  uplodeImagesCloudinary,
  removeCloudinaryImage
} = require("./cloudinary/cloudinaryFileUpload");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

//for request body
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
  })
);

// create a custom  route
app.use("/api", forgotePassRoute);
app.use("/api", contery);
app.use("/api", stateRoute);
app.use("/api", cityRoute);
app.use("/api", companyRoute);
app.use("/api", roleRoute);
app.use("/api", positionRoute);
app.use("/api", departmentRoute);
app.use("/api", employeeRoute);
app.use("/api", familyRoute);
app.use("/api", educationRoute);
app.use("/api", workExperienceRoute);
app.use("/api", projectRoute);
app.use("/api", portalRoute);
app.use("/api", salaryRoute);
app.use("/api", leaveRoute);
app.use("/api", personalInfoRoute);
app.use("/api", loginRoute);
app.use("/api", taskRoute);
app.use("/api", attendanceRoute);

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  }
});

// require("./pdfDetails");
// const { Task } = require("./models/taskModel");
// const { Employee } = require("./models/employeeModel");

const upload = multer({ storage: storage });

app.post("/api/tasks", upload.single("file"), async (req, res) => {
  console.log(req.file);
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
});
//////

app.get("/api/getTask", async (req, res) => {
  console.log;
  try {
    Task.find({}).then((data) => {
      res.send({ status: "ok........", data: data });
    });
  } catch (error) {}
});

app.post("/api/tasks/:taskId/employees", async (req, res) => {
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
});

//  create a server
var port = process.env.PORT;
// console.log("ip========", port && process.env.IP);
if (port & process.env.IP) {
  server.listen(port, process.env.IP, () => {
    console.log("started");
  });
} else
  server.listen(port, () =>
    console.log(`Example app listening on port ${port}!`)
  );
