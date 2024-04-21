const Group = require("../models/Group");

const verifyGroupOwner = async (req, res, next) => {
    const id_group = req.params?.id;
    const id_user = req.id_user;

    try {
        const check = await Group.find({
            _id: id_group,
            members: { $elemMatch: { userID: id_user, role: "owner" } },
        }).exec();

        if (check.length !== 0) next();
        else return res.status(401).json({ message: "You are not a group owner!" });
    } catch (err) {
        return res.status(401).json({ message: "You are not a group member" });
    }
};

module.exports = verifyGroupOwner;
