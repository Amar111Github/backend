// examController.js
const Exam = require("../models/examModel");
const Question = require("../models/questionModel");
const User = require("../models/userModel")

// Add Exam
const addExam = async (req, res) => {
  try {
    const examExists = await Exam.findOne({ name: req.body.name });
    if (examExists) {
      return res
        .status(200)
        .send({ message: "Exam already exists", success: false });
    }
    req.body.questions = [];
    const newExam = new Exam(req.body);
    await newExam.save();
    res.send({ message: "Exam added successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message, data: error, success: false });
  }
};

// Get All Exams
const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find({});
    res.send({
      message: "Exams fetched successfully",
      data: exams,
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message, data: error, success: false });
  }
};



const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.body.examId).populate("questions");

    if (!exam) {
      return res
        .status(404)
        .send({ message: "Exam not found", success: false });
    }

    // Shuffle and select up to 20 random questions
    const shuffledQuestions = exam.questions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledQuestions.slice(0, 20);

    res.send({
      message: "Exam fetched successfully",
      data: { ...exam.toObject(), questions: selectedQuestions },
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message, data: error, success: false });
  }
};

// Edit Exam by ID
const editExamById = async (req, res) => {
  try {
    await Exam.findByIdAndUpdate(req.body.examId, req.body);
    res.send({ message: "Exam edited successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message, data: error, success: false });
  }
};

// Delete Exam by ID
const deleteExamById = async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.body.examId);
    res.send({ message: "Exam deleted successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message, data: error, success: false });
  }
};

// Add Question to Exam
const addQuestionToExam = async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    const question = await newQuestion.save();
    const exam = await Exam.findById(req.body.exam);
    exam.questions.push(question._id);
    await exam.save();
    res.send({ message: "Question added successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message, data: error, success: false });
  }
};

// Edit Question in Exam
const editQuestionInExam = async (req, res) => {
  try {
    await Question.findByIdAndUpdate(req.body.questionId, req.body);
    res.send({ message: "Question edited successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message, data: error, success: false });
  }
};

// Delete Question in Exam
const deleteQuestionInExam = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.body.questionId);
    const exam = await Exam.findById(req.body.examId);
    exam.questions = exam.questions.filter(
      (question) => question._id != req.body.questionId
    );
    await exam.save();
    res.send({ message: "Question deleted successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message, data: error, success: false });
  }
};

const getExams = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found", success: false });
    }

    // Admin logic: fetch all exams
    if (user.isAdmin) {
      const exams = await Exam.find({});
      return res.send({
        message: "Exams fetched successfully",
        success: true,
        data: exams,
      });
    }

    // Regular user logic: fetch user's associated exam
    const exam = await Exam.findById(user.exam).populate("questions");
    if (!exam) {
      return res
        .status(404)
        .send({ message: "Exam associated with the user not found", success: false });
    }

    return res.send({
      message: "Exam fetched successfully",
      success: true,
      data: exam,
    });
  } catch (error) {
    console.error("Error in getExams:", error);
    res.status(500).send({ message: error.message, success: false });
  }
};

module.exports = {
  addExam,
  getAllExams,
  getExamById,
  editExamById,
  deleteExamById,
  addQuestionToExam,
  editQuestionInExam,
  deleteQuestionInExam,
  getExams,
};
