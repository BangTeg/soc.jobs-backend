const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { adminToken } = require("../middleware/auth");
const applicationController = require("../controllers/applicationController");

// Route to get all jobs listed
router.get('/', jobController.getAll);

// Route to get all jobs with filters
router.get('/filter', jobController.getAllWithFilters);

// Route to get a job by ID
router.get('/:id', jobController.getById);

// Route to create a new job
router.post("/", adminToken, jobController.create);

// Route to update a job by ID
router.put("/:id", adminToken, jobController.update);

// Route to delete a job by ID
router.delete("/:id", adminToken, jobController.delete);

// Route to get applications by JobID
router.get("/application/:id", adminToken, applicationController.getByJobId);

// Route to get applications
router.get("/application", adminToken, applicationController.getByJobId);

module.exports = router;
