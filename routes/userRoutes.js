const userRoute = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const userController = require("../controller/userController");

// User Registration
userRoute.post("/register", userController.registerUser);

// User Login
userRoute.post("/login", userController.loginUser);
userRoute.post("/take-test", authMiddleware, userController.takeTest);
// Get User Info
userRoute.post("/get-user-info", authMiddleware, userController.getUserInfo);

module.exports = userRoute;
