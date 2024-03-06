const mongoose = require("mongoose");

// const attendanceSchema = new mongoose.Schema(
//   {
//     employeeObjID: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
//     years: [
//       {
//         year: Number,
//         months: [
//           {
//             month: Number,
//             dates: [
//               {
//                 date: Number,
//                 day: Number,
//                 // loginTime: { type: Array, default: formatTime },
//                 loginTime: [],
//                 logoutTime: [],
//                 breakTime: [],
//                 breakTimeMs: [],
//                 resumeTimeMS: [],
//                 ResumeTime: [],
//                 BreakData: [],
//                 status: {
//                   type: String,
//                   default: "logout"
//                 },
//                 totalBrake: { type: Number, default: 0 }
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   },
//   { timestamps: true }
// );

// const AttendanceModel = mongoose.model("Attendance", attendanceSchema);

const attendanceSchema = new mongoose.Schema(
  {
    employeeObjID: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    years: [
      {
        year: Number,
        months: [
          {
            month: Number,
            dates: [
              {
                date: Number,
                day: Number,
                // loginTime: { type: Array, default: formatTime },
                loginTime: [],
                logoutTime: [],
                loginTimeMs: [],
                logoutTimeMs: [],
                LogData: [],
                TotalLogin: { type: Number, default: 0 },
                breakTime: [],
                breakTimeMs: [],
                resumeTimeMS: [],
                ResumeTime: [],
                BreakData: [],
                totalBrake: { type: Number, default: 0 },
                totalLogAfterBreak: { type: Number, default: 0 },
                BreakReasion: [],
                LogStatus: {
                  type: String,
                  default: "--"
                },
                status: {
                  type: String,
                  default: "logout"
                }
              }
            ]
          }
        ]
      }
    ],
  },
  { timestamps: true }
);

const AttendanceModel = mongoose.model("Attendance", attendanceSchema);

// Holiday Schema ---------------
const HolidaySchema = new mongoose.Schema({
  holidayYear: Number,
  holidayMonth: Number,
  holidayDate: Number,
  holidayName: String,
  holidayType: String
});

const Holiday = mongoose.model("Holiday", HolidaySchema);

module.exports = {
  AttendanceModel,
  Holiday
};
