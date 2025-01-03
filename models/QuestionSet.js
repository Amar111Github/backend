const mongoose = require("mongoose");

const questionSetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "questions", // Reference to the Question schema
        required: true,
      },
    ],

    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "exams", // Reference to the Exam schema
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const QuestionSet = mongoose.model("questionSets", questionSetSchema);
module.exports = QuestionSet;
