const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { uploadAvatar, uploadCV } = require('../config/multerConfig');
const { adminToken, verifiedToken } = require('../middleware/auth');
const applicationController = require("../controllers/applicationController");

// Routes for user-related actions
router.get('/', userController.getAll);

// Route to get user information by token
router.get('/profile', verifiedToken, userController.getByToken);
router.get('/profile/:id', userController.getById);
// router.put("/profile", userController.updateProfile);
router.put("/profile/:id", userController.update);

// Route to get applications by the user's token
router.get("/applications/token", verifiedToken, applicationController.getApplicationsByUserToken);
// Route to get applications by UserID
router.get("/application/:id", adminToken, applicationController.getByUserId);
// Route to get applications
router.get("/application/", applicationController.getByUserId);

// Route to upload avatar
router.post('/avatar', verifiedToken, uploadAvatar.single('avatar'), userController.uploadAvatar);

// Route to get a user's avatar by token
router.get('/avatar', verifiedToken, userController.getAvatar);

// Route to upload CV
router.post('/cv', verifiedToken, uploadCV.single('cv'), userController.uploadCV);

// Route to get a user's CV by token
router.get('/cv', verifiedToken, userController.getCV);

// Route to get a user's CV by id
router.get('/cv/:id', adminToken, userController.getCVById);

// Route to delete a user's and applications by id
router.delete('/:id', adminToken, userController.delete);

module.exports = router;
