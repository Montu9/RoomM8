const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        title: { type: String, require: true },
        charge: { type: Number, require: true },
        category: { type: String, require: true },
        groupID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            require: true,
        },
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true,
        },
        created: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
