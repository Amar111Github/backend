const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    console.log("Token:", token); // Debug

    if (!token) {
      return res.status(401).send({
        message: "Token not provided or invalid format",
        success: false,
      });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT Verification Error:", err.message);
      return res.status(401).send({
        message: "Invalid or expired token",
        success: false,
      });
    }

    console.log("Decoded Token:", decodedToken); // Debug
    const userId = decodedToken.userId;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).send({
        message: "Invalid UserID",
        success: false,
      });
    }

    const user = await User.findById(userId);
    console.log("User:", user); // Debug
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }

    req.body.userId = userId;
    req.body.isAdmin = user.isAdmin;

    if (!user.isAdmin && user.hasTakenTest) {
      return res.status(403).send({
        message: "You have already taken the test. You cannot take it again.",
        success: false,
      });
    }

    next();
  } catch (error) {
    console.error("Middleware Error:", error.message); // Debug
    res.status(500).send({
      message: "Internal Server Error",
      data: error.message,
      success: false,
    });
  }
};
