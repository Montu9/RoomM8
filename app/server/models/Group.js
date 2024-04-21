const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    name: { type: String, require: true },
    members: [
        {
            userID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            role: {
                type: String,
                enum: ["owner", "member"],
            },
        },
    ],
});

module.exports = mongoose.model("Group", groupSchema);
