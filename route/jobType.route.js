const express = require('express');
const router = express.Router();
const jobTypeController = require("../controllers/jobTypeController");
const { adminToken } = require("../middleware/auth");

// Route to get all jobType listed
router.get("/", jobTypeController.getAll);

// // Route to get an jobType by ID
// router.get("/:id", jobTypeController.getById);

// // Route to create a new jobType
// router.post("/", adminToken, jobTypeController.create);

// // Route to update an jobType by ID
// router.put("/:id", adminToken, jobTypeController.update);

// // Route to delete an jobType by ID
// router.delete("/:id", adminToken, jobTypeController.delete);

module.exports = router;
