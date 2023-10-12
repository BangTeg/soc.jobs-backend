const express = require('express');
const router = express.Router();
const positionController = require("../controllers/positionController");
const { adminToken } = require("../middleware/auth");

// Route to get all position listed
router.get("/", positionController.getAll);

// // Route to get an position by ID
// router.get("/:id", positionController.getById);

// // Route to create a new position
// router.post("/", adminToken, positionController.create);

// // Route to update an position by ID
// router.put("/:id", adminToken, positionController.update);

// // Route to delete an position by ID
// router.delete("/:id", adminToken, positionController.delete);

module.exports = router;
