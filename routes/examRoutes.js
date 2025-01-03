const examRoute = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const examController = require("../controller/examController");

// Add Exam
examRoute.post("/add", authMiddleware, examController.addExam);

// Get All Exams
examRoute.post("/get-all-exams", examController.getAllExams);

// Get Exam by ID
examRoute.post("/get-exam-by-id", examController.getExamById);

// Get Exam by userID
// examRoute.post("/getExamsByUserId",examController.getExamsByUserId);

// Get User Exam
// examRoute.post("/get-user-exam", authMiddleware, examController.getExamsByUserId); // Adjust the method name if needed

// Edit Exam by ID
examRoute.post("/edit-exam-by-id", authMiddleware, examController.editExamById);

// Delete Exam by ID
examRoute.post("/delete-exam-by-id", authMiddleware, examController.deleteExamById);

// Add Question to Exam
examRoute.post("/add-question-to-exam", authMiddleware, examController.addQuestionToExam);

// Edit Question in Exam
examRoute.post("/edit-question-in-exam", authMiddleware, examController.editQuestionInExam);

// Delete Question in Exam
examRoute.post("/delete-question-in-exam", authMiddleware, examController.deleteQuestionInExam);

examRoute.post("/get-exams",authMiddleware, examController.getExams);

module.exports = examRoute;
