const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/api/auth/login", userController.login);
router.post("/api/auth/register", userController.register);

module.exports = router;
