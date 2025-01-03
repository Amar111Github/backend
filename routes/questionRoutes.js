const express = require("express");
const questionRoute = express.Router();
const questionSetController = require("../controller/questionController");

// Create a Question Set
questionRoute.post("/", questionSetController.createQuestionSet);

// Fetch Question Sets for a Specific Exam
questionRoute.get("/:examId", questionSetController.getQuestionSetsByExam);

// Assign a Question Set to a User
questionRoute.post("/assign", questionSetController.assignQuestionSetToUser);

module.exports = questionRoute;
