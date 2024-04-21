const Group = require("../models/Group");

const verifyGroupMember = async (req, res, next) => {
    const id_group = req.params?.id;
    const id_user = req.id_user;

    try {
        const check = await Group.find({
            $and: [
                { _id: id_group },
                { members: { $elemMatch: { userID: id_user, $or: [{ role: "member" }, { role: "owner" }] } } },
            ],
        }).exec();

        if (Array.isArray(check) && check.length !== 0) next();
        else return res.status(401).json({ message: "You are not a group member" });
    } catch (err) {
        return res.status(401).json({ message: "You are not a group member" });
    }
};

module.exports = verifyGroupMember;
