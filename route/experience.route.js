const express = require('express');
const router = express.Router();
const experienceController = require("../controllers/experienceController");
const { adminToken } = require("../middleware/auth");

// Route to get all experience listed
router.get("/", experienceController.getAll);

// // Route to get an experience by ID
// router.get("/:id", experienceController.getById);

// // Route to create a new experience
// router.post("/", adminToken, experienceController.create);

// // Route to update an experience by ID
// router.put("/:id", adminToken, experienceController.update);

// // Route to delete an experience by ID
// router.delete("/:id", adminToken, experienceController.delete);

module.exports = router;
