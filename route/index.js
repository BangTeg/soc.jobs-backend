const { Router } = require('express');
const router = Router();
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const jobRoute = require('./job.route');
const adminRoute = require('./admin.route');
const applicationRoute = require("./application.route");
const positionRoute = require("./position.route");
const jobTypeRoute = require("./jobType.route");
const experienceRoute = require("./experience.route");
const {verifiedToken} = require('../middleware/auth');

// Route to the auth route
router.use('/auth', authRoute);

// Route to the user router
router.use('/user', verifiedToken, userRoute);

// // Route to the admin router
// router.use('/admin', verifiedToken, adminRoute);

// Route to the job router
router.use('/job', verifiedToken, jobRoute);

// Route to the application router
router.use('/application', verifiedToken, applicationRoute);

// Route to the position router
router.use("/position", verifiedToken, positionRoute);

// Route to the jobType router
router.use("/jobType", verifiedToken, jobTypeRoute);

// Route to the experience router
router.use("/experience", verifiedToken, experienceRoute);

module.exports = router;