const Group = require("../models/Group");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");
// @desc Create new group by user
// @access Private
// @route POST: /group/
const createNewGroup = async (req, res) => {
    const { name } = req.body;
    const idUser = req.id_user;
    try {
        // Get owner
        const owner = await User.findOne({ _id: idUser }).exec();
        const group = await Group.create({
            name,
            members: [
                {
                    userID: owner._id,
                    role: "owner",
                },
            ],
        });

        await User.findOneAndUpdate(
            { _id: idUser },
            {
                $push: {
                    groups: {
                        groupID: group._id,
                        role: "owner",
                    },
                },
            }
        ).exec();

        return res.status(201).json({ success: group._id });
    } catch (err) {
        return res.sendStatus(500);
    }
};

// @desc Get group data by user
// @access Private
// @route GET: /group/:id
const getGroup = async (req, res) => {
    const id_group = req.params.id;

    try {
        const groupData = await Transaction.aggregate([
            { $match: { groupID: new mongoose.Types.ObjectId(id_group) } },
            { $lookup: { from: "users", localField: "userID", foreignField: "_id", as: "user" } },
            {
                $group: {
                    _id: "$userID",
                    firstname: { $first: { $arrayElemAt: ["$user.firstname", 0] } },
                    lastname: { $first: { $arrayElemAt: ["$user.lastname", 0] } },
                    gender: { $first: { $arrayElemAt: ["$user.gender", 0] } },
                    chargeAll: { $sum: "$charge" },
                },
            },
        ]);

        const users = await Group.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id_group) } },
            { $unwind: "$members" },
            { $lookup: { from: "users", localField: "members.userID", foreignField: "_id", as: "groupUsers" } },
            {
                $group: {
                    _id: "$_id",
                    users: {
                        $push: {
                            firstname: {
                                $arrayElemAt: ["$groupUsers.firstname", 0],
                            },
                            lastname: {
                                $arrayElemAt: ["$groupUsers.lastname", 0],
                            },
                        },
                    },
                },
            },
            { $project: { _id: 0, users: 1 } },
        ]);

        if (groupData) {
            return res.status(201).json({ groupData, users: users[0].users });
        } else {
            return res.status(400).json({ message: "Invalid data" });
        }
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const deleteGroup = (req, res) => {};

// @desc Add user to group
// @access Private
// @route GET: /group/:id/addMember
const addMember = async (req, res) => {
    const { id_user, role } = req.body;
    const id_group = req.params.id;

    try {
        const check = await Group.find({
            _id: id_group,
            members: { $elemMatch: { userID: id_user } },
        }).exec();

        if (check.length !== 0) return res.status(401).json({ message: "User already in group" });

        await User.findOneAndUpdate(
            { _id: id_user },
            {
                $push: {
                    groups: {
                        groupID: id_group,
                        role: role,
                    },
                },
            }
        ).exec();

        await Group.findOneAndUpdate(
            { _id: id_group },
            {
                $push: {
                    members: {
                        userID: id_user,
                        role: role,
                    },
                },
            }
        ).exec();
        return res.status(201).json();
    } catch (err) {
        return res.sendStatus(500);
    }
};

// Check if user is member
// Authentication required
// GET: /group/:id/isMember
const isMember = async (req, res) => {
    return res.sendStatus(200);
};

// @desc Get user transaction in group
// @access Private
// GET /group/:id/getUserTransactions
const getUserTransactions = async (req, res) => {
    const id_user = req.id_user;
    const id_group = req.params?.id;

    try {
        const userTransactions = await Transaction.find({ $and: [{ userID: id_user }, { groupID: id_group }] });
        console.log(userTransactions);
        return res.status(201).json({ userTransactions });
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

// @desc Delete user transaction in group
// @access Private
// GET /group/:id/getUserTransactions
const deleteTransaction = async (req, res) => {
    const id_transaction = req.params?.id_transaction;

    try {
        const check = await Transaction.findOneAndRemove({ _id: id_transaction });
        if (check instanceof Transaction) {
            return res.sendStatus(201);
        } else {
            return res.status(400).json({ message: "Invalid data" });
        }
    } catch (err) {
        return res.sendStatus(500);
    }
};

module.exports = {
    createNewGroup,
    getGroup,
    deleteGroup,
    addMember,
    isMember,
    getUserTransactions,
    deleteTransaction,
};
