const multer = require('multer');
const path = require('path');

// Define storage settings for avatar
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../src/avatar'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.split (' ').join('_')}`);
  },
});

// Define storage settings for CV
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../src/cv'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.split (' ').join('_')}`);
  },
});

// Define a file filter function for avatar uploads
const avatarFileFilter = (req, file, cb) => {
  const allowedFormats = ['.jpg', '.jpeg', '.png'];

  const fileExt = path.extname(file.originalname).toLowerCase();
  if (allowedFormats.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format for avatar. Supported formats: .jpg, .jpeg, .png'), false);
  }
};

// Define a file filter function for CV uploads
const cvFileFilter = (req, file, cb) => {
  const allowedFormats = ['.doc', '.docx', '.pdf'];

  const fileExt = path.extname(file.originalname).toLowerCase();
  if (allowedFormats.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format for CV. Supported formats: .doc, .docx, .pdf'), false);
  }
};

// Initialize Multer with the storage and file filter configurations
const uploadAvatar = multer({ storage: avatarStorage, fileFilter: avatarFileFilter });
const uploadCV = multer({ storage: cvStorage, fileFilter: cvFileFilter });

module.exports = { uploadAvatar, uploadCV };
