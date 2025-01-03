// const mongoose = require("mongoose");
// // MongoDB Schema
// const recordingSchema = new mongoose.Schema({
//     fileName: { type: String, required: true },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "users",
//     },
//     exam: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "exams",
//     },
//     report: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "reports", // Reference to the Report schema
//     },
//     username: { type: String, required: true },
//     uploadedAt: { type: Date, default: Date.now },
//   });
  
//   const Recording = mongoose.model("recording", recordingSchema);

//   module.exports = Recording;


const mongoose = require("mongoose");

const recordingSchema = new mongoose.Schema(
  {
    fileUrl: {
      type: String,
      required: true,
    },
    cloudinaryId: { type: String, required: true },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Recording = mongoose.model("recordings", recordingSchema);

module.exports = Recording;




// const mongoose = require("mongoose");

// const RecordingSchema = new mongoose.Schema({
//   fileName: { type: String, required: true },
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
//   exam: { type: mongoose.Schema.Types.ObjectId, ref: "exams", required: true },
//   username: { type: String, required: true },
//   examName: { type: String, required: true },
//   uploadedAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("recordings", RecordingSchema);
