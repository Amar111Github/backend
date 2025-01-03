// userController.js
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Exam = require("../models/examModel"); 


// User Register
const registerUser = async (req, res) => {
  try {
    const { email, password, examId } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).send({ message: "User already exists", success: false });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = { ...req.body, password: hashedPassword };

    // Associate exam if examId is provided
    if (examId) {
      const exam = await Exam.findById(examId);
      if (!exam) {
        return res.status(400).send({ message: "Invalid exam ID", success: false });
      }
      userData.exam = exam._id; // Assuming `exam` is a field in the User model
    }

    // Save the new user
    const newUser = new User(userData);
    await newUser.save();

    // Populate the exam field if it exists
    const userWithExam = await User.findById(newUser._id).populate("exam");

    res.status(201).send({
      message: "User created successfully",
      success: true,
      data: userWithExam,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).send({ message: error.message, success: false });
  }
};

// User Login
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({ message: "User does not exist", success: false });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(200).send({ message: "Invalid password", success: false });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.send({ message: "User logged in successfully", success: true, data: token });
  } catch (error) {
    res.status(500).send({ message: error.message, data: error, success: false });
  }
};

// Get User Info
const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    res.send({ message: "User info fetched successfully", success: true, data: user });
  } catch (error) {
    res.status(500).send({ message: error.message, data: error, success: false });
  }
};

module.exports = { registerUser, loginUser,getUserInfo   };
