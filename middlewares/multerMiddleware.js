const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, `image-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Initialize upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Set file size limit (optional)
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Function to check file type (optional)
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

module.exports = upload;
