const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        firstname: { type: String, require: true },
        lastname: { type: String, require: true },
        email: { type: String, require: true },
        passwd_hash: { type: String, require: true },
        gender: { type: String, enum: ["Male", "Female"], require: true },
        groups: [
            {
                groupID: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Group",
                },
                role: {
                    type: String,
                    enum: ["owner", "member"],
                },
            },
        ],
    },
    { timestamps: true }
);

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ _id: this._id, firstname: this.firstname }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ _id: this._id, firstname: this.firstname }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1d",
    });
};

module.exports = mongoose.model("User", userSchema);
