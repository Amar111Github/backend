const { AttendanceModel, Holiday } = require("../models/attendanceModel");
const { Employee } = require("../models/employeeModel");
const schedule = require("node-schedule");
// const Moment = require("moment");

const Moment = require("moment-timezone"); // Add this line to include moment-timezone

const createAttendance = async (req, res) => {
  const {
    employeeId,

    breakTime,
    breakTimeMs,
    ResumeTime,
    resumeTimeMS,
    BreakReasion,

    status,
    totalLogAfterBreak,
  } = req.body;
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const date = new Date().getDate();
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const isWeekend = [0, 6].includes(currentDate.getDay());

  // Convert the current time to IST using moment-timezone
  const currentTimeMs = Math.round(
    Moment().tz("Asia/Kolkata").valueOf() / 1000 / 60
  );
  const currentTime = Moment().tz("Asia/Kolkata").format("HH:mm:ss");

  let loginTime;
  let logoutTime;
  let loginTimeMs;
  let logoutTimeMs;
  let resumeTime;
  let ResumeTimeMS;
  let BreakTime;
  let BreakTimeMs;
  if (status === "login") {
    loginTime = [currentTime];
    loginTimeMs = [currentTimeMs];
  } else if (status === "logout") {
    logoutTime = [currentTime];
    logoutTimeMs = [currentTimeMs];
  }

  try {
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res
        .status(404)
        .json({ error: "Employee ID not found: " + employeeId });
    }

    let attendanceRecord = await AttendanceModel.findById({
      _id: employee.attendanceObjID,
    });
    if (!attendanceRecord) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    let yearObject = attendanceRecord.years.find((y) => y.year === year);
    if (!yearObject) {
      yearObject = {
        year: year,
        months: [
          {
            month: month,
            dates: [
              {
                date: date,
                day: new Date(year, month - 1, currentDay).getDay(),
                loginTime: isWeekend ? ["WO"] : loginTime ? loginTime : [],
                logoutTime: isWeekend ? ["WO"] : [],
                loginTimeMs: isWeekend
                  ? ["WO"]
                  : loginTimeMs
                  ? loginTimeMs
                  : [],
                logoutTimeMs: isWeekend ? ["WO"] : [],
                breakTime: isWeekend ? [] : [],
                resumeTime: isWeekend ? [0] : [],
                breakTimeMs: isWeekend ? [0] : [],
                resumeTimeMS: isWeekend ? [0] : [],
                BreakReasion: isWeekend ? [] : [],
                BreakData: isWeekend ? [0] : [],
                status: isWeekend ? "WO" : "logout",
                totalBrake: isWeekend ? 0 : 0,
              },
            ],
          },
        ],
      };
      attendanceRecord.years.push(yearObject);
    }

    let monthObject = yearObject.months.find((m) => m.month === month);
    if (!monthObject) {
      monthObject = {
        month: month,
        dates: [
          {
            date: date,
            day: new Date(year, month - 1, currentDay).getDay(),
            loginTime: isWeekend ? ["WO"] : loginTime ? loginTime : [],
            logoutTime: isWeekend ? ["WO"] : [],
            loginTimeMs: isWeekend ? ["WO"] : loginTimeMs ? loginTimeMs : [],
            logoutTimeMs: isWeekend ? ["WO"] : [],
            breakTime: isWeekend ? [] : [],
            resumeTime: isWeekend ? [0] : [],
            breakTimeMs: isWeekend ? [0] : [],
            resumeTimeMS: isWeekend ? [0] : [],
            BreakReasion: isWeekend ? [] : [],
            BreakData: isWeekend ? [0] : [],
            status: isWeekend ? "WO" : "logout",
            totalBrake: isWeekend ? 0 : 0,
          },
        ],
      };
      yearObject.months.push(monthObject);
    }

    let dateObject = monthObject.dates.find((d) => d.date === date);

    if (!dateObject) {
      dateObject = {
        date: date,
        day: new Date(year, month - 1, currentDay).getDay(),
        loginTime: isWeekend ? ["WO"] : loginTime ? loginTime : [],
        logoutTime: isWeekend ? ["WO"] : [],
        loginTimeMs: isWeekend ? ["WO"] : loginTimeMs ? loginTimeMs : [],
        logoutTimeMs: isWeekend ? ["WO"] : [],
        breakTime: isWeekend ? [] : [],
        resumeTime: isWeekend ? [0] : [],
        breakTimeMs: isWeekend ? [0] : [],
        resumeTimeMS: isWeekend ? [0] : [],
        BreakReasion: isWeekend ? [] : [],
        BreakData: isWeekend ? [0] : [],
        status: isWeekend ? "WO" : "logout",
        totalBrake: isWeekend ? 0 : 0,
      };
      monthObject.dates.push(dateObject);
    } else if (dateObject.day === 0) {
      return res.status(400).json({ error: "Cannot modify data for Sunday." });
    }

    // Handling login and logout updates
    if (dateObject.logoutTime.length === dateObject.loginTime.length) {
      if (loginTime) {
        dateObject.loginTime = [...dateObject.loginTime, ...loginTime];
      }
      if (loginTimeMs) {
        dateObject.loginTimeMs = [...dateObject.loginTimeMs, ...loginTimeMs];
      }
    } else if (dateObject.logoutTime.length < dateObject.loginTime.length) {
      if (logoutTime) {
        dateObject.logoutTime = [...dateObject.logoutTime, ...logoutTime];
      }

      if (logoutTimeMs) {
        dateObject.logoutTimeMs = [...dateObject.logoutTimeMs, ...logoutTimeMs];

        const logoutTimeMSArray = dateObject.logoutTimeMs.slice(
          -logoutTimeMs.length
        );
        const loginTimeMsArray = dateObject.loginTimeMs.slice(
          -logoutTimeMs.length
        );

        const loginDataArray = logoutTimeMSArray.map((login, index) => {
          const LogMs = loginTimeMsArray[index];
          return login - LogMs;
        });

        dateObject.LogData = [...dateObject.LogData, ...loginDataArray];

        dateObject.TotalLogin = dateObject.LogData.reduce(
          (sum, value) => sum + value,
          0
        );
        dateObject.totalLogAfterBreak = Math.max(
          0,
          dateObject.TotalLogin - dateObject.totalBrake
        );
      }
    }

    // Handling break and resume time updates
    if (breakTime) {
    
      BreakTime = [currentTime];
      BreakTimeMs = [currentTimeMs];
      if (dateObject.ResumeTime.length === dateObject.breakTime.length) {
        if (breakTime) {
          dateObject.breakTime = [...dateObject.breakTime, ...BreakTime];
        }
        if (breakTimeMs) {
          dateObject.breakTimeMs = [...dateObject.breakTimeMs, ...BreakTimeMs];
        }
      }
    } else if (ResumeTime) {
      resumeTime = [currentTime];
      ResumeTimeMS = [currentTimeMs];
      if (dateObject.ResumeTime.length < dateObject.breakTime.length) {
        if (resumeTimeMS) {
          dateObject.resumeTimeMS = [
            ...dateObject.resumeTimeMS,
            ...ResumeTimeMS,
          ];

          const resumeTimeMSArray = dateObject.resumeTimeMS.slice(
            -resumeTimeMS.length
          );
          const breakTimeMsArray = dateObject.breakTimeMs.slice(
            -resumeTimeMS.length
          );

          const breakDataArray = resumeTimeMSArray.map((Resume, index) => {
            const BreakMs = breakTimeMsArray[index];
            return Resume - BreakMs;
          });

          dateObject.BreakData = [...dateObject.BreakData, ...breakDataArray];

          dateObject.totalBrake = dateObject.BreakData.reduce(
            (sum, value) => sum + value,
            0
          );
        }

        if (ResumeTime) {
          dateObject.ResumeTime = [...dateObject.ResumeTime, ...resumeTime];
        }
        if (BreakReasion) {
          dateObject.BreakReasion = [
            ...dateObject.BreakReasion,
            ...BreakReasion,
          ];
        }

        if (totalLogAfterBreak) {
          dateObject.totalLogAfterBreak =
            dateObject.TotalLogin >= dateObject.totalBrake
              ? dateObject.TotalLogin - dateObject.totalBrake
              : 0;
        }
      }
    }

    dateObject.status = status;
    await attendanceRecord.save();

    res.status(200).json({ message: "Attendance data updated successfully" });
  } catch (error) {
    console.error("Error updating attendance data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createHolidays = async (req, res) => {
  try {
    // Create a new Holiday record using the Holiday model
    const newHoliday = new Holiday({
      holidayYear: req.body.holidayYear,
      holidayMonth: req.body.holidayMonth,
      holidayDate: req.body.holidayDate,
      holidayName: req.body.holidayName,
      holidayType: req.body.holidayType,
    });

    // Save the Holiday record
    await newHoliday.save();

    res
      .status(201)
      .json({ message: "Holiday data added successfully", newHoliday });
  } catch (error) {
    console.error("Error adding Holiday data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// find all employee Attendance
const findAttendance = async (req, res) => {
  try {
    // Fetch attendance data from the database
    const attendanceData = await AttendanceModel.find().populate(
      "employeeObjID"
    );
    res.json(attendanceData);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// find single employee AttendanceId
const findEmployeeAttendanceId = async (req, res) => {
  try {
    const allAttendance = await AttendanceModel.find().populate(
      "employeeObjID"
    ); // Populate the user information

    res.status(200).json(allAttendance);
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// find single employeeId
const findEmployeeAttendanceEployeeId = async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Find the user based on the provided employee ID
    const employee = await Employee.findOne({ _id: employeeId });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Find the attendance record associated with the user
    const attendanceRecord = await AttendanceModel.findOne({
      employeeObjID: employee._id,
    });

    if (!attendanceRecord) {
      return res
        .status(404)
        .json({ error: "Attendance record not found for the user" });
    }
    const years = attendanceRecord?.years;
    const months = years[years?.length - 1].months;
    const dates = months[months.length - 1].dates;
    const today = dates[dates.length - 1];

    res.status(200).json({ today, attendanceID: attendanceRecord._id });
  } catch (error) {
    console.error("Error fetching attendance data by employee ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// find all holidays
const findAllHolidays = async (req, res) => {
  try {
    const allHolidays = await Holiday.find();
    res.status(200).json(allHolidays);
  } catch (error) {
    console.error("Error fetching holiday data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const attendanceRegister = async (req, res) => {
  try {
    const { year, month } = req.params;

    // Convert year and month to numbers
    const yearNumber = parseInt(year);
    const monthNumber = parseInt(month);

    // Fetch all users from the database
    const users = await Employee.find();

    // Define an array to hold the formatted attendance register data
    const attendanceRegister = [];

    // Iterate over each user
    for (const employee of Employee) {
      // Find the attendance record for the specified year and month
      const attendanceRecord = await AttendanceModel.findOne({
        employeeObjID: Employee._id,
        "years.year": yearNumber,
        "years.months.month": monthNumber,
      });

      // If attendance record exists, format the data
      if (attendanceRecord) {
        const attendanceData = attendanceRecord.years[0].months[0].dates.map(
          (dateData) => {
            // Translate attendance status codes to corresponding letters
            const attendanceStatus = {
              P: "Present",
              A: "Absent",
              H: "Holiday",
              L: "Leave",
            };

            // Convert status codes to letters
            const formattedData = dateData.status.map(
              (status) => attendanceStatus[status]
            );

            return formattedData;
          }
        );

        // Push user's attendance data to the register array
        attendanceRegister.push({
          EmpId: employee.empID,
          Name: employee.name,
          ...attendanceData,
        });
      }
    }

    res.status(200).json(attendanceRegister);
  } catch (error) {
    console.error("Error fetching attendance register:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const todaysAttendance = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    // Find all users and populate their attendance data for today
    const usersWithAttendance = await Employee.find({status:"active"})
      .populate("attendanceObjID")
      .populate("position")
      .populate("department");

    // Extract relevant attendance data and send it in the response
    const attendanceData = usersWithAttendance.map((user) => {
      const attendanceRecord = user.attendanceObjID;
      let attendance = null;

      // Check if attendanceRecord exists and has valid data
      if (
        attendanceRecord &&
        attendanceRecord.years &&
        attendanceRecord.years.length > 0
      ) {
        const yearData = attendanceRecord.years.find(
          (year) => year.year === currentYear
        );

        if (yearData && yearData.months && yearData.months.length > 0) {
          const monthData = yearData.months.find(
            (month) => month.month === currentMonth
          );

          if (monthData && monthData.dates && monthData.dates.length > 0) {
            const dateData = monthData.dates.find(
              (date) => date.date === currentDay
            );

            if (dateData) {
              attendance = dateData;
            }
          }
        }
      }

      return {
        userId: user._id,
        FirstName: user.FirstName,
        LastName: user.LastName,
        empID: user.empID,
        Account: user.Account,
        reportManager: user.reportManager,
        position: user.position ? user.position[0] : null,
        department: user.department ? user.department[0] : null,
        attendance: attendance,
        profile: user.profile,
      };
    });

    res.status(200).json(attendanceData);
  } catch (error) {
    console.error("Error fetching today's attendance data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getEmployeeTodayAttendance = async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Fetch the employee based on the provided employee ID
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Fetch today's attendance for the employee
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    const attendanceRecord = await AttendanceModel.findOne({
      employeeObjID: employee._id,
      "years.year": currentYear,
      "years.months.month": currentMonth,
    });

    if (!attendanceRecord) {
      return res
        .status(404)
        .json({ error: "Attendance record not found for the employee" });
    }

    const monthData = attendanceRecord.years[0].months.find(
      (month) => month.month === currentMonth
    );

    if (!monthData) {
      return res
        .status(404)
        .json({ error: "Attendance data not found for the current month" });
    }

    const dateData = monthData.dates.find((date) => date.date === currentDay);

    if (!dateData) {
      return res
        .status(404)
        .json({ error: "Attendance data not found for today" });
    }

    const employeeAttendanceData = {
      loginTime: dateData.loginTime[0],
      logoutTime: dateData.logoutTime[dateData.logoutTime.length - 1],
      totalBrake: dateData.totalBrake,
      status: dateData.status,
      totalLoginTime: dateData.totalLogAfterBreak, // Assuming this is the total login time after deducting break time
    };

    res.status(200).json(employeeAttendanceData);
  } catch (error) {
    console.error("Error fetching today's attendance for employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { Email, date, loginTime, logoutTime, remark, updatedBy } = req.body;

    // Extract year, month, and day from the provided date
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth() + 1;
    const day = new Date(date).getDate();

    // Find the employee by their Email
    const attendance = await Employee.find({ Email: Email });

    const attendanceId = attendance[0].attendanceObjID;

    // Find the attendance object by ID
    const attendanceObjArray = await AttendanceModel.find({
      _id: attendanceId,
    });
    const attendanceObj = attendanceObjArray[0];

    if (!attendanceObj) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Find the correct year, month, and date
    const yearObj = attendanceObj.years.find((y) => y.year === year);
    if (!yearObj) return res.status(404).json({ message: "Year not found" });

    const monthObj = yearObj.months.find((m) => m.month === month);
    if (!monthObj) return res.status(404).json({ message: "Month not found" });

    const dateObj = monthObj.dates.find((d) => d.date === day);
    if (!dateObj) return res.status(404).json({ message: "Date not found" });

    // Update the login time, logout time, and remark

    if (loginTime && logoutTime) {
      dateObj.loginTime[0] = loginTime;
      dateObj.logoutTime[dateObj.logoutTime.length - 1] = logoutTime;

      // Optionally update the millisecond values
      dateObj.loginTimeMs[0] = Math.round(
        new Date(`${date}T${loginTime}`).getTime() / 1000 / 60
      );
      dateObj.logoutTimeMs[dateObj.logoutTimeMs.length - 1] = Math.round(
        new Date(`${date}T${logoutTime}`).getTime() / 1000 / 60
      );
    } else if (loginTime) {
      dateObj.loginTime[0] = loginTime;
      dateObj.loginTimeMs[0] = Math.round(
        new Date(`${date}T${loginTime}`).getTime() / 1000 / 60
      );
    } else if (logoutTime) {
      if (dateObj.logoutTime.length - 1 < 0) {
        dateObj.logoutTime[0] = logoutTime;
        dateObj.logoutTimeMs[0] = Math.round(
          new Date(`${date}T${logoutTime}`).getTime() / 1000 / 60
        );
      } else {
        dateObj.logoutTime[dateObj.logoutTime.length - 1] = logoutTime;
        dateObj.logoutTimeMs[dateObj.logoutTimeMs.length - 1] = Math.round(
          new Date(`${date}T${logoutTime}`).getTime() / 1000 / 60
        );
      }
    } else {
      return;
    }

    // Mark fields as modified
    const loginTimeNew = dateObj.loginTimeMs;
    const logoutimeNew = dateObj.logoutTimeMs;

    const LogData = logoutimeNew.map((val, i) => {
      let login = loginTimeNew[i];
      return val - login;
    });
    dateObj.LogData = LogData;
    dateObj.TotalLogin = LogData.reduce((sum, value) => sum + value, 0);
    dateObj.totalLogAfterBreak = dateObj.TotalLogin - dateObj.totalBrake;
    dateObj.updatedBy = updatedBy;
    dateObj.remark = remark;
    attendanceObj.markModified("years");
    attendanceObj.markModified("years.months");
    attendanceObj.markModified("years.months.dates");

    // Save the updated attendance document
    await attendanceObj.save();

    res.status(200).json({ message: "Attendance updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createAttendance,
  createHolidays,
  findAttendance,
  findEmployeeAttendanceEployeeId,
  findEmployeeAttendanceId,
  findAllHolidays,
  attendanceRegister,
  todaysAttendance,
  getEmployeeTodayAttendance,
  updateAttendance,
};
