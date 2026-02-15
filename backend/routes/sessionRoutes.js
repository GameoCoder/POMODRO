const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");
const auth = require("../middleware/auth");

router.post("/bulk-save", auth, sessionController.bulkSaveSession);

module.exports = router;
