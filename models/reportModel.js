const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "exams",
    },

    result: {
      type: Object,
      required: true,
    },

    recording: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Recording model
      ref: "recordings",
      default: null, // Optional if no recording is provided
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("reports", reportSchema);

module.exports = Report;
