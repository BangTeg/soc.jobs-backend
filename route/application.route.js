const express = require('express');
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const { adminToken } = require("../middleware/auth");

// Route to get all applications listed
router.get("/", adminToken, applicationController.getAll);

// Route to get an application by ID
router.get("/:id", adminToken, applicationController.getById);

// Route to create a new application
router.post("/", applicationController.create);

// Route to update an application by ID
router.put("/:id", adminToken, applicationController.update);

// Route to delete an application by ID
router.delete("/:id", adminToken, applicationController.delete);

// Route to get applications by createdAt date range
router.get("/filter/date-range", adminToken, applicationController.getApplicationsByDateRange);

module.exports = router;
