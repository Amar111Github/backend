const multer = require("multer");
const fs = require("fs");

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./employee_profile"); // Destination directory for storing files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); // File naming convention
  }
});

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: { min: 200 * 1024, max: 1024 * 1024 } // Limit the size to between 200 KB and 1 MB
  }
});

// Middleware for handling file uploads
const fileUploadMiddleware = upload.single("profile");

// Middleware to check file size after upload
const checkFileSize = async (req, res, next) => {
  const { file } = req;
  if (!file) {
    next();
  } else {
    if (file.size >= 200 * 1024 && file.size <= 1024 * 1024) {
      next();
    } else {
      await fs.unlinkSync(file.path);
      return res.status(400).send("File size must be between 200 KB and 1MB.");
    }
  }
};

module.exports = {
  fileUploadMiddleware,
  checkFileSize,
  upload
};
