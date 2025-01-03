const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload"); // Assuming `upload` middleware is defined in your project
const {
  uploadRecording,
  getRecordingsByUser,
  deleteRecording,
} = require("../controller/recordingController");

// Upload Recording
router.post("/uploadRecording", upload.single("recording"), uploadRecording);

// Get Recordings by User ID
router.get("/user/:userId", getRecordingsByUser);

// Delete Recording by ID
router.delete("/:id", deleteRecording);

module.exports = router;
