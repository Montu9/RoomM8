const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const verifyJWT = require("../middlewares/verifyJWT");
const verifyGroupOwner = require("../middlewares/verifyGroupOwner.js");
const verifyGroupMember = require("../middlewares/verifyGroupMember");

const validateAjv = require("../middlewares/validateAjv");
const createGroupSchema = require("../schemas/group/groupSchema");
const groupSchemaNewMember = require("../schemas/group/groupSchemaNewMember");

router.use(verifyJWT);

// @desc Create new group by user
// @access Private
// @route POST: /group/
router.route("/").post(validateAjv(createGroupSchema), groupController.createNewGroup);

// Get group data by user | Delete group by owner
// Authentication required
// GET|DELETE: /group/:id
router.route("/:id").get(verifyGroupMember, groupController.getGroup).delete(groupController.deleteGroup);

// Check if user is member
// Authentication required
// GET: /group/:id/isMember
router.route("/:id/isMember").get(verifyGroupMember, groupController.isMember);

// Add user to group
// Authentication required
// GET: /group/:id/addMember
router.route("/:id/addMember").post(verifyGroupOwner, validateAjv(groupSchemaNewMember), groupController.addMember);

// @desc Get user transaction in group
// @access Private
// GET /group/:id/getUserTransactions
router.route("/:id/getUserTransactions").get(verifyGroupMember, groupController.getUserTransactions);

// @desc Delete user transaction in group
// @access Private
// GET /group/:id/getUserTransactions
router.route("/:id/deleteTransaction/:id_transaction").delete(verifyGroupMember, groupController.deleteTransaction);

module.exports = router;
