const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Validate
const verifyJWT = require("../middlewares/verifyJWT");
const validateAjv = require("../middlewares/validateAjv");
const userSchema = require("../schemas/user/userSchema");
const userSchemaUpdate = require("../schemas/user/userSchemaUpdate");
const userSchemaPasswd = require("../schemas/user/userSchemaPasswd");

// @desc Create new user
// @access Public
// @route POST: /user/
router.route("/").post(validateAjv(userSchema), userController.createNewUser);

// Update user | Get user data | Delete user
// Authentication required
// PATCH|GET|DELETE: /user/
router.use(verifyJWT);
router
    .route("/")
    .patch(validateAjv(userSchemaUpdate), userController.updateUser)
    .get(userController.getUserData)
    .delete(userController.deleteUser);

// @desc Update user password
// @access Private
// @route PATCH: /user/passwd
router.route("/passwd").patch(validateAjv(userSchemaPasswd), userController.updatePasswd);

// @desc Get user groups
// @access Private
// @route GET: /user/groups
router.route("/groups").get(userController.getUserGroups);

module.exports = router;
