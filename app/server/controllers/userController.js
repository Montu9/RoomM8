const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// @desc Create new user
// @access Public
// @route POST: /user/
const createNewUser = async (req, res) => {
    const { firstname, lastname, email, passwd, gender } = req.body;

    try {
        // Check for duplicates
        const duplicate = await User.findOne({ email }).lean().exec();
        if (duplicate) return res.status(409).json({ message: "Email is already associated with other account" });

        // Hash password
        const salt = await bcrypt.genSalt(15);
        const passwd_hash = await bcrypt.hash(passwd, salt);

        const user = await User.create({
            firstname,
            lastname,
            email,
            passwd_hash,
            gender,
        });

        if (user) {
            return res.status(201).json({ message: `New user ${email} created` });
        } else {
            return res.status(400).json({ message: "Invalid user data received" });
        }
    } catch (err) {
        return res.sendStatus(500);
    }
};

// @desc Update User
// @access Private
// @route PATCH: /user/
const updateUser = async (req, res) => {
    const { firstname, lastname, email, gender } = req.body;
    const id_user = req.id_user;

    const userData = { firstname, lastname, email, gender };

    for (let key in userData) {
        if (!userData[key] || userData[key].length == 0) {
            delete userData[key];
        }
    }
    try {
        const check = await User.findOneAndUpdate({ _id: id_user }, userData, {
            new: true,
        });

        if (check) {
            const { passwd_hash, groups, createdAt, updatedAt, ...user } = check._doc;

            return res.status(201).json({ user: user });
        } else return res.sendStatus(401);
    } catch (err) {
        return res.sendStatus(500);
    }
};

// @desc Get user data
// @access Private
// @route GET: /user/
const getUserData = (req, res) => {
    const { id_user } = req;
};
// @desc Delete user
// @access Private
// @route DELETE: /user/
const deleteUser = (req, res) => {};

// @desc Update user password
// @access Private
// @route PATCH: /user/passwd
const updatePasswd = async (req, res) => {
    const { oldPasswd, passwd } = req.body;
    const id_user = req.id_user;

    try {
        const foundUser = await User.findOne({ _id: id_user });
        if (!foundUser) throw new Error();

        const matchPasswd = await bcrypt.compare(oldPasswd, foundUser.passwd_hash);
        if (!matchPasswd) return res.status(401).json({ message: "Unauthorized" });

        const salt = await bcrypt.genSalt(15);
        const passwd_hash = await bcrypt.hash(passwd, salt);

        const check = await User.findByIdAndUpdate(
            { _id: id_user },
            { passwd_hash: passwd_hash },
            {
                new: true,
            }
        );
        if (check) return res.status(201).json({ success: "Password changed successfully" });
        else return res.sendStatus(401);
    } catch (err) {
        return res.sendStatus(500);
    }
};

// @desc Get user groups
// @access Private
// @route GET: /user/groups
const getUserGroups = async (req, res) => {
    const id_user = req.id_user;

    try {
        const userGroups = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id_user) } },
            { $unwind: "$groups" },
            { $lookup: { from: "groups", localField: "groups.groupID", foreignField: "_id", as: "userGroups" } },
            {
                $group: {
                    _id: "$_id",
                    groups: {
                        $push: {
                            name: {
                                $arrayElemAt: ["$userGroups.name", 0],
                            },
                            role: "$groups.role",
                            id_group: "$groups.groupID",
                        },
                    },
                },
            },
            { $project: { _id: 0, groups: 1 } },
        ]);
        const result = Array.isArray(userGroups[0]?.groups) ? userGroups[0].groups : [];
        return res.status(201).json({ userGroups: result });
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};
module.exports = {
    createNewUser,
    updateUser,
    getUserData,
    deleteUser,
    updatePasswd,
    getUserGroups,
};
