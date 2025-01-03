// // questionSetController.js
// const QuestionSet = require("../models/QuestionSet");
// const Question = require("../models/questionModel");
// const Exam = require("../models/examModel");

// // Create a Question Set
// const createQuestionSet = async (req, res) => {
//   try {
//     const { name, questions, examId } = req.body;

//     // Validate questions
//     const validQuestions = await Question.find({ _id: { $in: questions } });
//     if (validQuestions.length !== questions.length) {
//       return res.status(400).json({ message: "Invalid question IDs provided" });
//     }

//     // Validate exam
//     const exam = await Exam.findById(examId);
//     if (!exam) {
//       return res.status(404).json({ message: "Exam not found" });
//     }

//     // Create question set
//     const questionSet = new QuestionSet({ name, questions, exam: examId });
//     await questionSet.save();

//     // Add question set to exam
//     exam.questionSets.push(questionSet._id);
//     await exam.save();

//     res.status(201).json({ message: "Question set created successfully", questionSet });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to create question set", error: error.message });
//   }
// };

// // Fetch Question Sets for a Specific Exam
// const getQuestionSetsByExam = async (req, res) => {
//   try {
//     const { examId } = req.params;

//     const questionSets = await QuestionSet.find({ exam: examId }).populate("questions");

//     if (!questionSets.length) {
//       return res.status(404).json({ message: "No question sets found for this exam" });
//     }

//     res.status(200).json({ questionSets });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch question sets", error: error.message });
//   }
// };

// // Assign a Question Set to a User
// const assignQuestionSetToUser = async (req, res) => {
//   try {
//     const { userId, questionSetId } = req.body;

//     // Validate the question set
//     const questionSet = await QuestionSet.findById(questionSetId).populate("questions");
//     if (!questionSet) {
//       return res.status(404).json({ message: "Question set not found" });
//     }

//     // Simulate assignment logic (e.g., store in reports or another table)
//     // Add logic here to associate the question set with the user in your database

//     res.status(200).json({ message: "Question set assigned successfully", questionSet });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to assign question set", error: error.message });
//   }
// };

// module.exports = { createQuestionSet, getQuestionSetsByExam,assignQuestionSetToUser   };



const QuestionSet = require("../models/QuestionSet");
const Question = require("../models/questionModel");
const Exam = require("../models/examModel");

// Create a Question Set
const createQuestionSet = async (req, res) => {
  try {
    const { name, questions, examId } = req.body;

    // Validate questions
    const validQuestions = await Question.find({ _id: { $in: questions } });
    if (validQuestions.length !== questions.length) {
      return res.status(400).json({ message: "Invalid question IDs provided" });
    }

    if (validQuestions.length !== 50) {
      return res.status(400).json({ message: "Exactly 50 questions are required to create a set" });
    }

    // Validate exam
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Create question set
    const questionSet = new QuestionSet({ name, questions, exam: examId });
    await questionSet.save();

    // Add question set to exam
    exam.questionSets.push(questionSet._id);
    await exam.save();

    res.status(201).json({ message: "Question set created successfully", questionSet });
  } catch (error) {
    res.status(500).json({ message: "Failed to create question set", error: error.message });
  }
};

// Fetch 20 Random Questions from a Question Set
const getQuestionSetsByExam = async (req, res) => {
  try {
    const { questionSetId } = req.params;

    // Find the question set
    const questionSet = await QuestionSet.findById(questionSetId).populate("questions");
    if (!questionSet) {
      return res.status(404).json({ message: "Question set not found" });
    }

    // Randomize and select 20 questions
    const questions = questionSet.questions.sort(() => 0.5 - Math.random()).slice(0, 20);

    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch questions", error: error.message });
  }
};

// Assign a Question Set to a User
const assignQuestionSetToUser = async (req, res) => {
  try {
    const { userId, questionSetId } = req.body;

    // Validate the question set
    const questionSet = await QuestionSet.findById(questionSetId).populate("questions");
    if (!questionSet) {
      return res.status(404).json({ message: "Question set not found" });
    }

    // Simulate assignment logic (e.g., store in reports or another table)
    // Add logic here to associate the question set with the user in your database

    res.status(200).json({ message: "Question set assigned successfully", questionSet });
  } catch (error) {
    res.status(500).json({ message: "Failed to assign question set", error: error.message });
  }
};

module.exports = { createQuestionSet, getQuestionSetsByExam, assignQuestionSetToUser };
