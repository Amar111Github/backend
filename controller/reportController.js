const Exam = require("../models/examModel");
const User = require("../models/userModel");
const Report = require("../models/reportModel");
const Recording = require("../models/recordingModel");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const addReport = async (req, res) => {
  try {
    const zipFile = req.file;
    const { exam, result, user } = JSON.parse(req.body.payload);

    let recording = null;
    if (zipFile) {
      const cloudinaryResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "video_reports",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(zipFile.buffer).pipe(uploadStream);
      });

      recording = new Recording({
        fileUrl: cloudinaryResult.secure_url,
        cloudinaryId: cloudinaryResult.public_id,
      });

      await recording.save();
    }

    const newReport = new Report({
      exam,
      result,
      user,
      recording: recording ? recording._id : null,
    });

    await newReport.save();

    res.send({
      message: "Attempt added successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error adding report:", error);
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
};

const getAllReports = async (req, res) => {
  try {
    const { examName, userName, recordingFileUrl } = req.body;

    const exams = await Exam.find({
      name: { $regex: examName, $options: "i" },
    });

    const matchedExamIds = exams.map((exam) => exam._id);

    const users = await User.find({
      name: { $regex: userName, $options: "i" },
    });

    const matchedUserIds = users.map((user) => user._id);

    // Fetch all matching reports
    let reports = await Report.find({
      exam: { $in: matchedExamIds },
      user: { $in: matchedUserIds },
    })
      .populate("exam")
      .populate("user")
      .populate("recording")
      .sort({ createdAt: -1 });

    // ✅ Filter only latest attempt per (user + exam)
    const latestReportsMap = new Map();

    reports.forEach((report) => {
      const key = `${report.user._id.toString()}-${report.exam._id.toString()}`;
      if (!latestReportsMap.has(key)) {
        latestReportsMap.set(key, report);
      }
    });

    let filteredReports = Array.from(latestReportsMap.values());

    // ✅ Optional additional filter: search by recordingFileUrl
    if (recordingFileUrl) {
      filteredReports = filteredReports.filter(
        (report) =>
          report.recording && report.recording.fileUrl.includes(recordingFileUrl)
      );
    }

    res.send({
      message: "Latest attempts per user per exam fetched successfully",
      data: filteredReports,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
};

const getAllReportsByUser = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.body.userId })
      .populate("exam")
      .populate("user")
      .populate("recording")
      .sort({ createdAt: -1 });

    // ✅ Filter to get only the latest attempt per exam
    const latestReportsMap = new Map();

    reports.forEach((report) => {
      const examId = report.exam._id.toString();
      if (!latestReportsMap.has(examId)) {
        latestReportsMap.set(examId, report);
      }
    });

    const filteredReports = Array.from(latestReportsMap.values());

    res.send({
      message: "Latest attempts per exam fetched successfully",
      data: filteredReports,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
};

module.exports = { addReport, getAllReports, getAllReportsByUser };



// const Exam = require("../models/examModel");
// const User = require("../models/userModel");
// const Report = require("../models/reportModel");
// const Recording = require("../models/recordingModel");
// const cloudinary = require('cloudinary').v2;

// const streamifier = require('streamifier'); // For streaming to Cloudinary
// const addReport = async (req, res) => {
//   try {
//     const zipFile = req.file; // Assuming multer is used for file upload
//     const { exam, result, user } = JSON.parse(req.body.payload);

//     let recording = null;
//     if (zipFile) {
//       // Upload the ZIP file to Cloudinary
//       const cloudinaryResult = await new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           {
//             folder: 'video_reports',  // Cloudinary folder where ZIP files are saved
//             resource_type: 'auto',    // Automatically determine the resource type
//           },
//           (error, result) => {
//             if (error) {
//               reject(error);  // Reject the promise
//             } else {
//               resolve(result); // Resolve with the Cloudinary result
//             }
//           }
//         );

//         // Streaming the file buffer to Cloudinary
//         streamifier.createReadStream(zipFile.buffer).pipe(uploadStream);
//       });

//       // Save ZIP file details in your database
//       recording = new Recording({
//         fileUrl: cloudinaryResult.secure_url,
//         cloudinaryId: cloudinaryResult.public_id,
//       });

//       await recording.save(); // Save the recording document to the database
//     }

//     // Create a new Report document with the related exam, result, user, and recording ID
//     const newReport = new Report({
//       exam,
//       result,
//       user,
//       recording: recording ? recording._id : null, // Link the recording to the report (if exists)
//     });

//     // Save the report to the database
//     await newReport.save();

//     res.send({
//       message: "Attempt added successfully",
//       success: true,
//     });
//   } catch (error) {
//     console.error("Error adding report:", error);
//     res.status(500).send({
//       message: error.message,
//       data: error,
//       success: false,
//     });
//   }
// };


// const getAllReports = async (req, res) => {
//   try {
//     const { examName, userName, recordingFileUrl } = req.body;

//     // Find exams matching the exam name
//     const exams = await Exam.find({
//       name: { $regex: examName, $options: "i" }, // Case-insensitive regex search
//     });

//     const matchedExamIds = exams.map((exam) => exam._id);

//     // Find users matching the user name
//     const users = await User.find({
//       name: { $regex: userName, $options: "i" }, // Case-insensitive regex search
//     });

//     const matchedUserIds = users.map((user) => user._id);

//     // Query reports with matching exam and user IDs
//     let reports = await Report.find({
//       exam: { $in: matchedExamIds },
//       user: { $in: matchedUserIds },
//     })
//       .populate("exam")
//       .populate("user")
//       .populate("recording") // Include recording details
//       .sort({ createdAt: -1 });

//     if (recordingFileUrl) {
//       reports = reports.filter(
//         (report) => report.recording && report.recording.fileUrl.includes(recordingFileUrl)
//       );
//     }

//     res.send({
//       message: "Attempts fetched successfully",
//       data: reports,
//       success: true,
//     });
//   } catch (error) {
//     res.status(500).send({
//       message: error.message,
//       data: error,
//       success: false,
//     });
//   }
// };


// const getAllReportsByUser = async (req, res) => {
//   try {
//     const reports = await Report.find({ user: req.body.userId })
//       .populate("exam")
//       .populate("user")
//       .populate("recording") // Include recording details
//       .sort({ createdAt: -1 });

//     res.send({
//       message: "Attempts fetched successfully",
//       data: reports,
//       success: true,
//     });
//   } catch (error) {
//     res.status(500).send({
//       message: error.message,
//       data: error,
//       success: false,
//     });
//   }
// };

// module.exports = { addReport, getAllReports, getAllReportsByUser };





