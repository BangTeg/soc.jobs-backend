const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { uploadAvatar, uploadCV } = require('../config/multerConfig');
const {adminToken} = require('../middleware/auth');
const applicationController = require("../controllers/applicationController");

// Routes for user-related actions
router.get('/', userController.getAll);
router.get("/profile", userController.getById);
router.get('/profile/:id', userController.getById);
// router.put("/profile", userController.updateProfile);
router.put("/profile/:id", userController.update);

// Route to get applications by UserID
router.get("/application/:id", adminToken, applicationController.getByUserId);
// // Route to get applications
router.get("/application/", applicationController.getByUserId);

// Routes for file uploads
router.post('/avatar', uploadAvatar.single('avatar'), userController.uploadAvatar);
router.post('/cv', uploadCV.single('cv'), userController.uploadCV);

module.exports = router;
