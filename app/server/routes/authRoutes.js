const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

const validateAjv = require("../middlewares/validateAjv");
const authSchema = require("../schemas/user/authSchemaLogin");

// @desc Handle user login
// @access Public
// @route POST: /auth/login
router.route("/login").post(validateAjv(authSchema), authController.handleLogin);

// @desc Handle user refresh token
// @access Public
// GET: /auth/refresh
router.route("/refresh").get(authController.refresh);

// @desc Handle user logout
// @access Public
// GET: /auth/logout
router.route("/logout").get(authController.logout);

module.exports = router;
