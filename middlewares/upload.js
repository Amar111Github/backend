require('dotenv').config(); // Load .env variables

const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier'); // For streaming to Cloudinary

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name from .env
  api_key: process.env.CLOUDINARY_API_KEY,       // Cloudinary API key from .env
  api_secret: process.env.CLOUDINARY_API_SECRET, // Cloudinary API secret from .env
});

const storage = multer.memoryStorage(); // Store file in memory

// File type filter for video uploads (MP4, WebM)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["video/mp4", "video/webm"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only MP4 and WebM files are allowed."), false);
  }
};

// Set up Multer with memory storage and file size limits (200MB for 20-minute videos)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000000 }, // Limit file size to 50MB (adjust as needed)
  onFileUploadStart: function (file) {
    file.mimetype === 'video/mp4' || file.mimetype === 'video/webm';
    return true;
  },
  onFileUploadData: function (file, data) {
    
  },
  onError: function (error, req, res, next) {
    
    console.error('Error uploading file: ', error);
    res.status(500).send({ message: 'Error during upload', success: false });
  },
});

// Export the upload instance for use in your routes
module.exports = upload;
