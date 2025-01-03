const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    category: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    passingMarks: { type: Number, required: true },

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "questions",
      },
    ], // Retain this if individual questions are still used
    questionSets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "questionSets",
      },
    ], // Add reference for question sets
  },
  { timestamps: true }
);

const Exam = mongoose.model("exams", examSchema);
module.exports = Exam;





