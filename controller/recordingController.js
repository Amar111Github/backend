const Recording = require("../models/recordingModel");
const Exam = require("../models/examModel");
const User = require("../models/userModel");

// Upload Recording
const uploadRecording = async (req, res) => {
  try {
    const { userId, username } = req.body;

    if (!userId || !username || !req.file) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const recording = new Recording({
      fileName: req.file.filename,
      user: userId,
      username,
    });

    await recording.save();
    res.status(200).json({ message: "Recording uploaded successfully.", recording });
  } catch (error) {
    console.error("Error saving recording:", error);
    res.status(500).json({ message: "An error occurred while uploading the recording." });
  }
};

// Get Recordings by User ID
const getRecordingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const recordings = await Recording.find({ user: userId });

    if (!recordings || recordings.length === 0) {
      return res.status(404).json({ message: "No recordings found for this user." });
    }

    res.status(200).json(recordings);
  } catch (error) {
    console.error("Error fetching user recordings:", error);
    res.status(500).json({ message: "An error occurred while fetching the recordings." });
  }
};

// Delete Recording by ID
const deleteRecording = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Recording.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Recording not found." });
    }

    res.status(200).json({ message: "Recording deleted successfully." });
  } catch (error) {
    console.error("Error deleting recording:", error);
    res.status(500).json({ message: "An error occurred while deleting the recording." });
  }
};

module.exports = {
  uploadRecording,
  getRecordingsByUser,
  deleteRecording,
};
