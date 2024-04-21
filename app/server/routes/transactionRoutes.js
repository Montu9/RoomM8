const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const verifyJWT = require("../middlewares/verifyJWT");
const verifyGroupMember = require("../middlewares/verifyGroupMember");

router.use(verifyJWT);
router.route("/:id").post(verifyGroupMember, transactionController.createNewTransaction);
router.route("/categories").get(transactionController.getTransactionCategories);

module.exports = router;
