


const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
// const { addReport, getAllReports, getAllReportsByUser } = require("../controllers/reportController");
const reportController = require("../controller/reportController");
const authMiddleware = require("../middlewares/authMiddleware");


router.post("/add-report", upload.single("file"),authMiddleware, reportController.addReport); // Handle recording file
router.post("/get-all-reports",authMiddleware, reportController.getAllReports);
router.post("/get-all-reports-by-user",authMiddleware, reportController.getAllReportsByUser);

module.exports = router;

